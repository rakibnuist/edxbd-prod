// Compact wire format for the university finder. The finder filters ~2,000 programmes
// in the browser, so the server sends only the fields it reads: programmes as short
// tuples with a per-university tuition table, open scholarships only, the one ranking
// the cards show, and course lists only where no programme records exist.
// `expandDirectory` rebuilds the normal DirectoryUniversity shape on the client.
import { programIsCscaFree, type DirectoryUniversity } from './university-directory';

type Program = DirectoryUniversity['programs'][number];

// [name, level, languages, intakes, tuitionIndex, status, subject?, cscaSourceUrl?]
type ProgramTuple = [string, string, string, string, number, 0 | 1 | 2, string?, string?];

export type CompactUniversity = Omit<DirectoryUniversity, 'programs'> & { p: ProgramTuple[]; tu: string[] };

const STATUS: Program['status'][] = ['active', 'planned', 'paused'];
const SEP = '|';
const FULL_WAIVER = /tuition(?: fee)?\s*:\s*100%\s*(?:free|waived)/i;
const CSCA_FREE = 'CSCA not required.';

export function compactDirectory(universities: DirectoryUniversity[]): CompactUniversity[] {
  return universities.map(university => {
    // Pick fields explicitly: callers may pass full records with documents, fees and notes.
    const { programs, scholarships, publishedRankings, details } = university;
    const { id, slug, name, aliases, city, country, isActive, logo, degree, taught, intake, fundingRoutes, verification, relationship, clearCost } = university;
    const rest = { id, slug, name, aliases, city, country, isActive, logo, degree, taught, intake,
      ...(fundingRoutes ? { fundingRoutes } : {}), ...(verification ? { verification } : {}),
      ...(relationship ? { relationship } : {}), ...(clearCost ? { clearCost } : {}) };
    const tuitions: string[] = [];
    const tuitionIndex = (value?: string) => {
      if (!value) return -1;
      const at = tuitions.indexOf(value);
      return at >= 0 ? at : tuitions.push(value) - 1;
    };
    const p = programs.map(program => {
      const cscaFree = programIsCscaFree(program) && program.sourceUrl ? program.sourceUrl : '';
      const subject = program.subject && program.subject !== program.name ? program.subject : '';
      const tuple: ProgramTuple = [
        program.name,
        program.level,
        program.languages.join(SEP),
        program.intakes.join(SEP),
        tuitionIndex(program.tuition),
        Math.max(0, STATUS.indexOf(program.status)) as 0 | 1 | 2,
      ];
      if (subject || cscaFree) tuple.push(subject);
      if (cscaFree) tuple.push(cscaFree);
      return tuple;
    });
    const ranks = publishedRankings || [];
    const best = ranks.find(rank => rank.scope === 'world') || ranks.find(rank => rank.scope === 'national') || ranks[0];
    return {
      ...rest,
      publishedRankings: best ? [best] : [],
      details: { majors: programs.length ? [] : details.majors, tuition: details.tuition, tuitionDetails: [] },
      scholarships: scholarships
        .filter(award => award.status !== 'closed')
        .map(award => ({
          title: award.title,
          status: award.status,
          details: FULL_WAIVER.test(award.details.join('; ')) ? ['Tuition: 100% waived'] : [],
          eligiblePrograms: [],
          ...(award.coverage ? { coverage: award.coverage } : {}),
          ...(award.amount ? { amount: award.amount } : {}),
        })),
      p,
      tu: tuitions,
    };
  });
}

export function expandDirectory(compact: CompactUniversity[]): DirectoryUniversity[] {
  return compact.map(({ p, tu, ...rest }) => ({
    ...rest,
    programs: p.map(([name, level, languages, intakes, tuition, status, subject, cscaSource]) => ({
      name,
      level,
      languages: languages ? languages.split(SEP) : [],
      intakes: intakes ? intakes.split(SEP) : [],
      ...(tuition >= 0 ? { tuition: tu[tuition] } : {}),
      status: STATUS[status],
      ...(subject ? { subject } : {}),
      eligibility: cscaSource ? [CSCA_FREE] : [],
      ...(cscaSource ? { sourceUrl: cscaSource } : {}),
    })),
  }));
}
