/** Public scholarship facts. Source records and maintenance timestamps remain internal. */
export type UniversityScholarshipOption = {
  id: string;
  title: string;
  type: string;
  levels: string[];
  languages?: string[];
  programNames?: string[];
  programIds?: string[];
  feeWaivers?: ('housing' | 'insurance')[];
  coverage: string[];
  conditions: string[];
  renewal: string[];
  documents: string[];
  applicationSteps: string[];
  status: 'open' | 'closed' | 'confirm';
  cycle?: string;
  deadline?: string;
  tuitionReduction?: {
    type: 'percent' | 'fixed';
    value: number;
    currency?: string;
    period?: 'year' | 'semester' | 'programme';
  };
  stipend?: string;
  notes: string[];
};
