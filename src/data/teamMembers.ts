export type TeamMember = {
  slug: string;
  empId: string;
  name: string;
  role: string;
  shortRole: string;
  bio: string;
  specialties: string[];
  image: string;
  phone: string;
  email: string;
  team: 'all' | 'china' | 'general';
};

export const teamMembers: TeamMember[] = [
  {
    slug: 'abdullah-al-rakib',
    empId: 'E-01',
    name: 'Abdullah Al Rakib',
    role: 'Founder & CEO',
    shortRole: 'Executive Strategy & China Partnerships',
    bio: 'Founded EduExpress in 2018 with hands-on experience in Chinese higher education, university partner governance, and visa-first admissions transparency across Bangladesh and international corridors.',
    specialties: ['China Strategy', 'Institutional Partnerships', 'Cost Governance'],
    image: '/images/team/abdullah-al-rakib.webp',
    phone: '+8618550629808',
    email: 'rakib.nuist@gmail.com',
    team: 'general',
  },
  {
    slug: 'sakib-al-jubaer',
    empId: 'E-02',
    name: 'Sakib Al Jubaer',
    role: 'Managing Director',
    shortRole: 'Operations & Partner Relations',
    bio: 'Oversees Dhaka HQ operations, compliance standards, and B2B partner coordination so every student application progresses through verified milestones cleanly and on schedule.',
    specialties: ['Operations Leadership', 'B2B Partner Desk', 'Quality Assurance'],
    image: '/images/team/sakib-al-jubaer.webp',
    phone: '+8801843433699',
    email: 'sjubaer015@gmail.com',
    team: 'general',
  },
  {
    slug: 'mahmudul-hasan-tamal',
    empId: 'E-06',
    name: 'Mahmudul Hasan Tamal',
    role: 'Business Development Manager',
    shortRole: 'University Outreach & Partnerships',
    bio: 'Leads university relations, institutional outreach, and partner network expansion while guiding applicants on international scholarships and program pathways.',
    specialties: ['Business Development', 'Agency Partnerships', 'University Relations'],
    image: '/images/team/mahmudul-hasan-tamal.webp',
    phone: '+8801798631827',
    email: 'mhtamal04@gmail.com',
    team: 'china',
  },
  {
    slug: 'mukta-rahaman',
    empId: 'E-07',
    name: 'Mukta Rahaman',
    role: 'Senior Consultant',
    shortRole: 'All Destinations & ClearCost Planning',
    bio: 'Leads academic fit reviews, parent consultations, and multi-destination cost schedules across China, Malaysia, Europe, and the UK with written cost transparency.',
    specialties: ['Senior Consultation', 'Multi-Destination Fit', 'ClearCost Schedules'],
    image: '/images/team/mukta-rahaman.webp',
    phone: '+8801329663505',
    email: 'muktarehman909@gmail.com',
    team: 'all',
  },
  {
    slug: 'afsana-meme',
    empId: 'E-04',
    name: 'Afsana Meme',
    role: 'Senior Consultant',
    shortRole: 'China Admissions & Scholarships',
    bio: 'Specializes in Chinese university admissions, CSC and provincial scholarship guidance, and document readiness for Bachelor, MBBS, and graduate applicants.',
    specialties: ['China Admissions', 'CSC Scholarships', 'MBBS Guidance'],
    image: '/images/team/afsana-meme.webp',
    phone: '+8801577300731',
    email: 'afsanarahman727@gmail.com',
    team: 'china',
  },
  {
    slug: 'shamoyla-narmin',
    empId: 'E-08',
    name: 'Shamoyla Narmin',
    role: 'Consultant',
    shortRole: 'Admissions Counseling',
    bio: 'Supports prospective students from initial academic screening through university shortlisting, scholarship matching, and ongoing applicant follow-up.',
    specialties: ['Student Counseling', 'University Shortlisting', 'Applicant Follow-Up'],
    image: '/images/team/shamoyla-narmin.webp',
    phone: '+8801835903872',
    email: 'shamoylanarmin.mim2001@gmail.com',
    team: 'china',
  },
  {
    slug: 'md-taj-ahmmed',
    empId: 'E-05',
    name: 'Md Taj Ahmmed',
    role: 'Files & Visa Processing Executive',
    shortRole: 'Application & Visa Filing',
    bio: 'Manages portal submissions, document verification, JW202/DQ tracking, and embassy visa file preparation so every deadline and proof record stays accurate.',
    specialties: ['Application Filing', 'JW202 & Embassy Docs', 'Deadline Compliance'],
    image: '/images/team/md-taj-ahmmed.webp',
    phone: '+8801341226195',
    email: 'tajahmmed2@gmail.com',
    team: 'china',
  },
  {
    slug: 'md-manjurul-islam',
    empId: 'E-09',
    name: 'Md Manjurul Islam',
    role: 'Creative Designer & Video Editor',
    shortRole: 'Brand Design & Video Media',
    bio: 'Produces official educational explainers, student testimonial stories, campus guides, and institutional visual assets across EduExpress public channels.',
    specialties: ['Video Production', 'Visual Design', 'Educational Media'],
    image: '/images/team/md-manjurul-islam.webp',
    phone: '+8801767980780',
    email: 'contact@mmanjurul.com',
    team: 'general',
  },
];

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.[0] || ''}${parts.at(-1)?.[0] || ''}`.toUpperCase();
}
