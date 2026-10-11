export type TeamMember = {
  name: string;
  role: string;
  shortRole: string;
  bio: string;
  specialties: string[];
  image?: string;
};

export const teamMembers: TeamMember[] = [
  {
    name: 'Abdullah Al Rakib',
    role: 'Founder and CEO',
    shortRole: 'China and strategy',
    bio: 'Leads EduExpress and the institutional work behind the China service, with experience in Chinese higher education since 2018.',
    specialties: ['China', 'Institutional relationships', 'Complex decisions'],
  },
  {
    name: 'Mukta Rahaman',
    role: 'Senior Counselor',
    shortRole: 'Student counseling',
    bio: 'Helps students and families compare study fit, recognition and total cost before choosing an application route.',
    specialties: ['Education fit', 'Parent consultations', 'Cost planning'],
  },
  {
    name: 'Jannatun Ema',
    role: 'Counselor',
    shortRole: 'Student guidance',
    bio: 'Supports students from their first questions through a clear shortlist and written next steps.',
    specialties: ['First consultation', 'Study options', 'Student follow-up'],
  },
  {
    name: 'Md Tauhidul Islam Nur',
    role: 'Country Manager, China',
    shortRole: 'China applications',
    bio: 'Coordinates China university routes and helps the team align program, intake and application information.',
    specialties: ['China universities', 'Programs', 'Intakes'],
  },
  {
    name: 'Md Taj Ahmed',
    role: 'Application Processing',
    shortRole: 'Application files',
    bio: 'Prepares application files and keeps document requirements, submissions and deadlines organized.',
    specialties: ['Documents', 'Applications', 'Deadline tracking'],
  },
  {
    name: 'Md Abdullah Al Razib',
    role: 'Application Processing',
    shortRole: 'Proof tracking',
    bio: 'Maintains application references, receipts and file progress so students retain a clear record of each step.',
    specialties: ['Proof packs', 'File tracking', 'Student updates'],
  },
];

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.[0] || ''}${parts.at(-1)?.[0] || ''}`.toUpperCase();
}
