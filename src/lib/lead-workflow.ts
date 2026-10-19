export const LEAD_STATUSES = [
  ['new', 'New'], ['contacted', 'Contacted'], ['no_response', 'No Response'],
  ['consultation_scheduled', 'Consultation scheduled'], ['consultation_completed', 'Consultation completed'],
  ['qualified', 'Qualified'], ['application_started', 'Application started'],
  ['application_submitted', 'Application submitted'], ['admission_received', 'Admission received'],
  ['visa_applied', 'Visa applied'], ['visa_approved', 'Visa approved'], ['enrolled', 'Enrolled'],
  ['converted', 'Converted'], ['not_interested', 'Not interested'], ['closed', 'Closed'],
] as const;
export type LeadStatus = typeof LEAD_STATUSES[number][0];
export type LeadQueue = 'all' | 'new' | 'no_response' | 'in_progress' | 'closed';
export type LeadRecord = {
  id: string; name: string; email: string; phone?: string | null; country: string;
  program?: string | null; message?: string | null; status: string; source: string;
  notes?: string | null; assignedTeam?: string | null; assignedTo?: string | null;
  leadType?: string; riskFlag?: boolean; medicalProgram?: boolean;
  assessAcademicLevel?: string | null; assessAcademicResults?: string | null;
  assessSubject?: string | null; assessBudget?: string | null; assessIntake?: string | null;
  assessLanguage?: string | null; assessCareerGoal?: string | null;
  destinationInterest?: string | null; landingPage?: string | null;
  createdAt: string; updatedAt: string;
};
export const isLeadStatus = (value: unknown): value is LeadStatus =>
  typeof value === 'string' && LEAD_STATUSES.some(([status]) => status === value);
export const leadStatusLabel = (value: string) => LEAD_STATUSES.find(([status]) => status === value)?.[1]
  ?? value.replaceAll('_', ' ').replace(/^./, value => value.toUpperCase());
const closed = new Set(['closed', 'not_interested', 'enrolled', 'converted']);
export function leadQueue(status: string): Exclude<LeadQueue, 'all'> {
  if (status === 'new' || status === 'no_response') return status;
  return closed.has(status) ? 'closed' : 'in_progress';
}
export const leadStatusTone = (status: string) => status === 'no_response' ? 'bg-amber-50 text-amber-900'
  : status === 'new' ? 'bg-sky-50 text-sky-900'
  : ['enrolled', 'converted', 'visa_approved'].includes(status) ? 'bg-emerald-50 text-emerald-900'
  : 'bg-gray-100 text-gray-700';
export function leadCounts(leads: LeadRecord[]) {
  const counts = { all: leads.length, new: 0, no_response: 0, in_progress: 0, closed: 0 };
  for (const lead of leads) counts[leadQueue(lead.status)]++;
  return counts;
}
export function filterLeads(leads: LeadRecord[], filters: {
  search: string; queue: LeadQueue; status: string; country: string; source: string; sort: string;
}) {
  const query = filters.search.trim().toLocaleLowerCase();
  return leads.filter(lead => (!query || [lead.name, lead.email, lead.phone, lead.country, lead.program, lead.source]
    .some(value => value?.toLocaleLowerCase().includes(query)))
    && (filters.queue === 'all' || leadQueue(lead.status) === filters.queue)
    && (filters.status === 'all' || lead.status === filters.status)
    && (filters.country === 'all' || lead.country === filters.country)
    && (filters.source === 'all' || lead.source === filters.source))
    .sort((a, b) => filters.sort === 'oldest' ? Date.parse(a.createdAt) - Date.parse(b.createdAt)
      : filters.sort === 'updated' ? Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
      : Date.parse(b.createdAt) - Date.parse(a.createdAt));
}
export function validateLeadUpdate(value: unknown): { data?: { status?: LeadStatus; notes?: string }; error?: string } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { error: 'Provide a lead update.' };
  const body = value as Record<string, unknown>;
  if (Object.keys(body).some(key => !['status', 'notes'].includes(key))) return { error: 'Only status and counselor notes can be updated here.' };
  const data: { status?: LeadStatus; notes?: string } = {};
  if ('status' in body) {
    if (!isLeadStatus(body.status)) return { error: 'Choose a supported lead status.' };
    data.status = body.status;
  }
  if ('notes' in body) {
    if (typeof body.notes !== 'string' || body.notes.length > 12000) return { error: 'Counselor notes must be text of at most 12,000 characters.' };
    data.notes = body.notes.trim();
  }
  return Object.keys(data).length ? { data } : { error: 'Choose a status or update the counselor notes.' };
}
export function leadContactLinks(lead: Pick<LeadRecord, 'phone' | 'email' | 'name'>) {
  const digits = (lead.phone || '').replace(/[^0-9]/g, '');
  const whatsapp = digits.startsWith('00880') ? digits.slice(2) : /^01[0-9]{9}$/.test(digits) ? `88${digits}` : digits;
  return {
    call: digits ? `tel:${(lead.phone || '').trim().startsWith('+') ? '+' : ''}${digits}` : null,
    email: lead.email ? `mailto:${encodeURIComponent(lead.email)}` : null,
    whatsapp: whatsapp ? `https://wa.me/${whatsapp}` : null,
  };
}
