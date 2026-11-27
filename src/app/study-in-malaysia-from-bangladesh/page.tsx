import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  FileText,
  GraduationCap,
  HelpCircle,
  Landmark,
  MapPin,
  Plane,
  Scale,
  School,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/study-in-malaysia-from-bangladesh';
const canonical = `${SITE}${PATH}`;
const applyHref = '/apply?country=Malaysia';
export const revalidate = 3600;

const MALAYSIA_HUB_SOURCES = [
  { label: 'Education Malaysia Global Services (EMGS)', href: 'https://educationmalaysia.gov.my/' },
  { label: 'Malaysian Qualifications Agency (MQA)', href: 'https://www2.mqa.gov.my/mqr/' },
  { label: 'Ministry of Higher Education Malaysia (MoHE)', href: 'https://www.mohe.gov.my/en' },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in Malaysia from Bangladesh 2027: Total Cost in BDT, EMGS Visa & BDT 0 Fee | EduExpress',
    description:
      'Study in Malaysia from Bangladesh in 2027: total cost in BDT, MQA universities (UTM, APU, Taylor’s, Sunway, UCSI), EMGS eVAL visa timeline, MOI rules, and BDT 0 service charge.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('malaysia', 'Study in Malaysia from Bangladesh — EduExpress International'),
  });
}

const universitiesStatic = [
  {
    slug: 'universiti-malaya',
    name: 'Universiti Malaya (UM)',
    city: 'Kuala Lumpur',
    type: 'Premier Public Research University',
    ranking: 'QS World #60 · Malaysia #1',
    tuition: 'RM 14,000 – RM 24,000 / yr (~BDT 3.8L – 6.5L)',
    highlights: 'Malaysia’s oldest and top-ranked university. World top 60. Premier MBBS, Computing & Engineering.',
    logo: '/images/universities/logos/universiti-malaya.webp',
    levels: ['Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'universiti-teknologi-malaysia',
    name: 'Universiti Teknologi Malaysia (UTM)',
    city: 'Johor Bahru & KL',
    type: 'Top Public Technological University',
    ranking: 'QS World #181 · Engineering Top 100',
    tuition: 'RM 16,000 – RM 24,000 / yr (~BDT 4.3L – 6.5L)',
    highlights: 'Premier public engineering & computing powerhouse with campuses in Johor Bahru and Kuala Lumpur.',
    logo: '/images/universities/logos/universiti-teknologi-malaysia.webp',
    levels: ['Foundation', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'universiti-kebangsaan-malaysia',
    name: 'Universiti Kebangsaan Malaysia (UKM)',
    city: 'Bangi, Selangor',
    type: 'National Public Research University',
    ranking: 'QS World #138 · QS Asia #28',
    tuition: 'RM 15,000 – RM 25,000 / yr (~BDT 4.0L – 6.8L)',
    highlights: 'National research giant spanning 1,096 hectares in Bangi with top faculties in Medicine, Pharmacy & IT.',
    logo: '/images/universities/logos/universiti-kebangsaan-malaysia.webp',
    levels: ['Foundation', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'universiti-sains-malaysia',
    name: 'Universiti Sains Malaysia (USM)',
    city: 'George Town, Penang',
    type: 'APEX Public Research University',
    ranking: 'QS World #146 · QS Asia #32',
    tuition: 'RM 14,000 – RM 23,000 / yr (~BDT 3.8L – 6.2L)',
    highlights: 'Malaysia’s only APEX status university, located in Penang. World top 50 for Pharmacy & Pharmacology.',
    logo: '/images/universities/logos/universiti-sains-malaysia.webp',
    levels: ['Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'universiti-putra-malaysia',
    name: 'Universiti Putra Malaysia (UPM)',
    city: 'Serdang, Selangor',
    type: 'Top Public Research University',
    ranking: 'QS World #148 · QS Asia #25',
    tuition: 'RM 15,000 – RM 22,000 / yr (~BDT 4.0L – 5.9L)',
    highlights: 'Leading agricultural, biotechnology & computing research institution on an expansive 1,100-hectare campus.',
    logo: '/images/universities/logos/universiti-putra-malaysia.webp',
    levels: ['Foundation', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'monash-university-malaysia',
    name: 'Monash University Malaysia',
    city: 'Sunway, Selangor',
    type: 'Australian Go8 Branch Campus',
    ranking: 'QS World #37 (Monash Australia)',
    tuition: 'RM 42,000 – RM 58,000 / yr (~BDT 11.3L – 15.6L)',
    highlights: 'Full Australian Group of Eight degree at 1/3 Australian cost. AMC & MMC accredited BMedSc/MD medical degree.',
    logo: '/images/universities/logos/monash-university-malaysia.webp',
    levels: ['Pre-U (MUFY)', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'university-of-southampton-malaysia',
    name: 'University of Southampton Malaysia',
    city: 'Iskandar Puteri, Johor',
    type: 'UK Russell Group Branch Campus',
    ranking: 'QS World #80 · #1 UK Engineering in MY',
    tuition: 'RM 45,000 – RM 62,000 / yr (~BDT 12.1L – 16.7L)',
    highlights: 'World top 80 UK Russell Group institution in EduCity Johor. Premier 2+2 and 4+0 MEng Aeronautics & EEE tracks.',
    logo: '/images/universities/logos/university-of-southampton-malaysia.webp',
    levels: ['Foundation', 'Bachelor', 'Master'],
  },
  {
    slug: 'university-of-nottingham-malaysia',
    name: 'University of Nottingham Malaysia',
    city: 'Semenyih, Selangor',
    type: 'UK Russell Group Branch Campus',
    ranking: 'QS World #108 (Nottingham UK)',
    tuition: 'RM 40,000 – RM 55,000 / yr (~BDT 10.8L – 14.8L)',
    highlights: 'Authentic UK Russell Group education on a 125-acre garden campus in Semenyih with identical UK degree awards.',
    logo: '/images/universities/logos/university-of-nottingham-malaysia.webp',
    levels: ["Foundation", "Bachelor", "Master", "PhD"],
  },
  {
    slug: 'heriot-watt-university-malaysia',
    name: 'Heriot-Watt University Malaysia',
    city: 'Putrajaya',
    type: 'UK Royal Charter Branch Campus',
    ranking: 'QS World #235 · World #1 Actuarial Science',
    tuition: 'RM 38,000 – RM 52,000 / yr (~BDT 10.2L – 14.0L)',
    highlights: 'Lakeside green campus in Putrajaya specializing in Actuarial Science, Petroleum Engineering & Business.',
    logo: '/images/universities/logos/heriot-watt-university-malaysia.webp',
    levels: ['Foundation', 'Bachelor', 'Master'],
  },
  {
    slug: 'taylors-university',
    name: "Taylor's University",
    city: 'Subang Jaya, Selangor',
    type: 'Top Southeast Asian Private University',
    ranking: 'QS World #251 · #1 Private in SE Asia',
    tuition: 'RM 32,000 – RM 48,000 / yr (~BDT 8.6L – 12.9L)',
    highlights: 'World top 20 for Hospitality; dual awards with UWE Bristol UK and Univ of Toulouse; official MBBS programme.',
    logo: '/images/universities/logos/taylors-university.webp',
    levels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'ucsi-university',
    name: 'UCSI University',
    city: 'Kuala Lumpur & Terengganu',
    type: 'Leading Comprehensive Private University',
    ranking: 'QS World #265 · Top 1% Globally',
    tuition: 'RM 24,000 – RM 38,000 / yr (~BDT 6.5L – 10.2L)',
    highlights: 'World top 25 for Performing Arts; strong Doctor of Medicine (MD), Pharmacy, AI & Chemical Engineering.',
    logo: '/images/universities/logos/ucsi-university.webp',
    levels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'inti-international-university',
    name: 'INTI International University & Colleges',
    city: 'Nilai, Negeri Sembilan & Subang',
    type: 'Premier Private University · UK/US Dual Degrees',
    ranking: 'QS World #516 · QS Asia #170',
    tuition: 'RM 22,000 – RM 36,000 / yr (~BDT 5.9L – 9.7L)',
    highlights: '82-acre Nilai campus; dual degrees with University of Hertfordshire (UK) and Southern New Hampshire University (USA 4+0).',
    logo: '/images/universities/logos/inti-international-university.webp',
    levels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'sunway-university',
    name: 'Sunway University',
    city: 'Subang Jaya, Selangor',
    type: 'Premier Private University · UK Dual Degree',
    ranking: 'QS World #539 · QS 5-Star Rated',
    tuition: 'RM 28,000 – RM 44,000 / yr (~BDT 7.5L – 11.9L)',
    highlights: 'Dual Bachelor awards with Lancaster University UK. Jeffrey Cheah Scholarships of up to RM 18,000.',
    logo: '/images/universities/logos/sunway-university.webp',
    levels: ['Foundation (FIA/FIST)', 'Diploma', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'management-and-science-university',
    name: 'Management & Science University (MSU)',
    city: 'Shah Alam, Selangor',
    type: 'Medical, Health & Management Powerhouse',
    ranking: 'QS World #580 · Top 50 Hospitality',
    tuition: 'RM 20,000 – RM 32,000 / yr (~BDT 5.4L – 8.6L)',
    highlights: 'Own on-campus teaching hospital (MSUMC). Highly rated MBBS, Pharmacy, Computing & International Business.',
    logo: '/images/universities/logos/management-and-science-university.webp',
    levels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'asia-pacific-university',
    name: 'Asia Pacific University (APU)',
    city: 'Kuala Lumpur',
    type: 'Premier Digital Tech Institution (MDEC)',
    ranking: 'QS World #611 · De Montfort UK Dual Awards',
    tuition: 'RM 26,000 – RM 38,000 / yr (~BDT 7.0L – 10.2L)',
    highlights: 'Cybersecurity, AI, Computing, Cloud & FinTech hub inside Technology Park Malaysia with 100% employability.',
    logo: '/images/universities/logos/asia-pacific-university.webp',
    levels: ["Foundation", "Diploma", "Bachelor", "Master", "PhD"],
  },
  {
    slug: 'uow-malaysia',
    name: 'UOW Malaysia (Univ. of Wollongong)',
    city: 'Shah Alam, Selangor',
    type: 'Australian University Network',
    ranking: 'QS World #620 · Part of UOW Australia #167',
    tuition: 'RM 24,000 – RM 38,000 / yr (~BDT 6.5L – 10.2L)',
    highlights: 'Australian dual-award degrees in Computing, Software Engineering, Game Development & Accounting at Glenmarie campus.',
    logo: '/images/universities/logos/uow-malaysia.webp',
    levels: ["Foundation", "Diploma", "Bachelor", "Master"],
  },
  {
    slug: 'segi-university',
    name: 'SEGi University & Colleges',
    city: 'Kota Damansara, Selangor & KL',
    type: 'Comprehensive Private University · UK Dual Awards',
    ranking: 'QS 5-Star Plus · MQA Tier 5',
    tuition: 'RM 18,000 – RM 28,000 / yr (~BDT 4.8L – 7.5L)',
    highlights: 'Full 5-Year MBBS Package (RM 101,986 Yr 1); Dentistry (BDS); dual awards with UCLan and University of Sunderland.',
    logo: '/images/universities/logos/segi-university.webp',
    levels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'mahsa-university',
    name: 'MAHSA University',
    city: 'Bandar Saujana Putra, Selangor',
    type: 'Healthcare, Dental & Medical Mega-Campus',
    ranking: 'SETARA 5-Star · WHO & MMC Listed',
    tuition: 'RM 18,000 – RM 28,000 / yr (~BDT 4.8L – 7.5L)',
    highlights: '48-acre healthcare mega-campus. Top institution for MBBS (RM 512,100 Full 5 Yrs), Dentistry (DDS), Pharmacy & Nursing.',
    logo: '/images/universities/logos/mahsa-university.webp',
    levels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'university-of-cyberjaya',
    name: 'University of Cyberjaya (UoC)',
    city: 'Cyberjaya, Selangor',
    type: 'Healthcare & Technology Specialist',
    ranking: 'QS 5-Star Teaching · SETARA 5-Star',
    tuition: 'RM 20,000 – RM 28,000 / yr (~BDT 5.4L – 7.5L)',
    highlights: 'MBBS with special RM 50,000 promotional scholarship (RM 98,300 Yr 1); Doctor of Pharmacy (PharmD) & Physiotherapy.',
    logo: '/images/universities/logos/university-of-cyberjaya.webp',
    levels: ['Foundation (FAS)', 'Diploma', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'city-university-malaysia',
    name: 'City University Malaysia',
    city: 'Petaling Jaya, Selangor',
    type: 'Established Private University (Estd. 1984)',
    ranking: 'SETARA 5-Star · QS Asia #351-400',
    tuition: 'RM 16,000 – RM 24,000 / yr (~BDT 4.3L – 6.5L)',
    highlights: '40 years of academic excellence in Petaling Jaya. Practical career degrees in Software Engineering, IT, Graphic Design & MBA.',
    logo: '/images/universities/logos/city-university-malaysia.webp',
    levels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'universiti-tun-abdul-razak',
    name: 'Universiti Tun Abdul Razak (UNIRAZAK)',
    city: 'Kuala Lumpur',
    type: 'Government-Backed Business & Governance',
    ranking: 'EPAS/EFMD European Accredited · MoHE Tier 5',
    tuition: 'RM 18,000 – RM 26,000 / yr (~BDT 4.8L – 7.0L)',
    highlights: 'Established by Yayasan Tun Abdul Razak in downtown KL. CPA Australia accredited Accounting & Public Policy leader.',
    logo: '/images/universities/logos/universiti-tun-abdul-razak.webp',
    levels: ["Foundation", "Diploma", "Bachelor", "Master", "PhD"],
  },
  {
    slug: 'lincoln-university-college',
    name: 'Lincoln University College',
    city: 'Petaling Jaya, Selangor',
    type: 'Health Sciences & Medical University',
    ranking: 'THE Impact Top 35 World · BMDC Recognised',
    tuition: 'RM 16,000 – RM 24,000 / yr (~BDT 4.3L – 6.5L)',
    highlights: 'Doctor of Medicine (MD/MBBS) recognised by WHO & BMDC with special Bangladesh transparent pricing. Pharmacy & Public Health.',
    logo: '/images/universities/logos/lincoln-university-college.webp',
    levels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'nilai-university',
    name: 'Nilai University',
    city: 'Nilai, Negeri Sembilan',
    type: '105-Acre Campus · Aviation & Biotech Hub',
    ranking: 'SETARA 5-Star · CAAM Approved ATO',
    tuition: 'RM 18,000 – RM 28,000 / yr (~BDT 4.8L – 7.5L)',
    highlights: 'Aviation Maintenance Engineering with real aircraft hangars; guaranteed 30% international scholarship across full degree.',
    logo: '/images/universities/logos/nilai-university.webp',
    levels: ["Foundation", "Diploma", "Bachelor", "Master", "PhD"],
  },
  {
    slug: 'multimedia-university',
    name: 'Multimedia University (MMU)',
    city: 'Cyberjaya & Melaka',
    type: 'Pioneer Digital Tech (TM Group)',
    ranking: 'QS World #1001-1200 · QS Asia #207',
    tuition: 'RM 22,000 – RM 32,000 / yr (~BDT 5.9L – 8.6L)',
    highlights: 'Government-linked digital tech pioneer by Telekom Malaysia. World-renowned Animation, AI, Cybersecurity & Engineering.',
    logo: '/images/universities/logos/multimedia-university.webp',
    levels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'universiti-kuala-lumpur',
    name: 'Universiti Kuala Lumpur (UniKL)',
    city: 'Kuala Lumpur',
    type: 'Premier Technical & HTVET University',
    ranking: 'SETARA 5-Star · 12 Specialized Institutes',
    tuition: 'RM 20,000 – RM 28,000 / yr (~BDT 5.4L – 7.5L)',
    highlights: 'Malaysia’s largest technical university. MBBS at UniKL RCMP (RM 93,704 Yr 1); Software Engineering (MIIT); Robotics & Aviation.',
    logo: '/images/universities/logos/universiti-kuala-lumpur.webp',
    levels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
  },
  {
    slug: 'alfa-university-college',
    name: 'ALFA University College',
    city: 'Subang Jaya, Selangor',
    type: 'Architecture & Design Pioneer (Estd. 1998)',
    ranking: 'LAM Recognized Architecture · MQA Accredited',
    tuition: 'RM 18,000 – RM 26,000 / yr (~BDT 4.8L – 7.0L)',
    highlights: '25+ years pioneer in Architecture (LAM Part 1), Interior Architecture, Creative Design & Cybersecurity in Subang Jaya.',
    logo: '/images/universities/logos/alfa-university-college.webp',
    levels: ["Diploma", "Bachelor", "Master", "Doctorate"],
  },
  {
    slug: 'asia-metropolitan-university',
    name: 'Asia Metropolitan University (AMU)',
    city: 'Johor Bahru',
    type: 'Healthcare & Nursing Specialist',
    ranking: 'MQA & Nursing Board Accredited',
    tuition: 'RM 16,000 – RM 26,000 / yr (~BDT 4.3L – 7.0L)',
    highlights: 'Affordable specialist healthcare degrees in Pharmacy, Physiotherapy, Nursing & Healthcare Management in Johor Bahru.',
    logo: '/images/universities/logos/asia-metropolitan-university.webp',
    levels: ["Foundation", "Diploma", "Bachelor", "Master", "MBBS"],
  },
  {
    slug: 'london-school-of-business-and-finance-malaysia',
    name: 'London School of Business & Finance (LSBF)',
    city: 'Kuala Lumpur',
    type: 'Global Business & ACCA Gold Partner',
    ranking: 'Global University Systems (GUS UK)',
    tuition: 'RM 15,000 – RM 22,000 / yr (~BDT 4.0L – 5.9L)',
    highlights: 'ACCA Gold Approved Learning Partner in KL Sentral. British-curriculum Accounting, Digital Marketing & Finance degrees.',
    logo: '/images/universities/logos/london-school-of-business-and-finance-malaysia.webp',
    levels: ["Diploma", "Advanced Diploma", "Executive"],
  },
  {
    slug: 'intec-education-college',
    name: 'INTEC Education College',
    city: 'Shah Alam, Selangor',
    type: 'Pioneer Pre-University & ACCA Platinum',
    ranking: 'ACCA Platinum Partner · Estd 1983 by UiTM',
    tuition: 'RM 14,000 – RM 20,000 / yr (~BDT 3.8L – 5.4L)',
    highlights: 'Premier ACCA Platinum provider and overseas university preparation centre in Shah Alam with 40+ years track record.',
    logo: '/images/universities/logos/intec-education-college.webp',
    levels: ["Pre-U", "Diploma", "Professional ACCA"],
  },
  {
    slug: 'kuala-lumpur-university-of-science-and-technology',
    name: 'Kuala Lumpur Univ of Science & Tech (KLUST)',
    city: 'Kuala Lumpur',
    type: 'STEM & Executive Management College',
    ranking: 'MQA Accredited · Downtown KL',
    tuition: 'RM 16,000 – RM 24,000 / yr (~BDT 4.3L – 6.5L)',
    highlights: 'Postgraduate MBA with special AES 20% discount (RM 13,200 total); Water Resources & Environmental Engineering.',
    logo: '/images/universities/logos/kuala-lumpur-university-of-science-and-technology.webp',
    levels: ["Undergraduate", "Postgraduate MBA", "Doctorate"],
  },
];

const foundationDiplomaPrograms = [
  {
    institution: 'Asia Pacific University (APU)',
    program: 'Foundation in Computing & Technology (Pre-U)',
    level: '1-Year Foundation',
    duration: '1 Year (3 Semesters)',
    requirement: '5 O-Level / SSC Credits (incl. Math)',
    tuitionMyr: 'RM 27,600',
    tuitionBdt: '~BDT 7.45 Lakhs',
    progression: 'Direct entry to Year 1 of BSc (Hons) Computer Science, Software Engineering, Cyber Security, or AI',
  },
  {
    institution: 'Asia Pacific University (APU)',
    program: 'Diploma in Information & Communication Technology (ICT)',
    level: '2-Year Diploma',
    duration: '2 Years (5 Semesters)',
    requirement: '3 O-Level / SSC Credits (incl. Math)',
    tuitionMyr: 'RM 54,200',
    tuitionBdt: '~BDT 14.63 Lakhs',
    progression: 'Direct Credit Transfer into Year 2 of Bachelor’s in Computing / Software Engineering at APU',
  },
  {
    institution: 'University of Cyberjaya (UoC)',
    program: 'Foundation in Allied Science (FAS)',
    level: '1-Year Foundation',
    duration: '1 Year (3 Semesters)',
    requirement: '5 O-Level / SSC Credits (Science stream)',
    tuitionMyr: 'RM 18,700 (Net)',
    tuitionBdt: '~BDT 5.05 Lakhs',
    progression: 'Pathway to Bachelor of Pharmacy (BPharm), MBBS, Physiotherapy, or Biomedical Sciences (RM 8,700 scholarship applied)',
  },
  {
    institution: 'University of Cyberjaya (UoC)',
    program: 'Diploma in Pharmacy / Diploma in Nursing',
    level: '3-Year Diploma',
    duration: '3 Years (Full-time)',
    requirement: '3–5 O-Level / SSC Credits (Science/Biology)',
    tuitionMyr: 'RM 45,000 – RM 56,000',
    tuitionBdt: '~BDT 12.15L – 15.12L',
    progression: 'Pharmacy Board / Nursing Board Malaysia accredited with full hospital clinical rotations; eligible for bachelor progression',
  },
  {
    institution: 'MAHSA University',
    program: 'Foundation in Science',
    level: '1-Year Foundation',
    duration: '1 Year (3 Semesters)',
    requirement: '5 O-Level / SSC Credits (incl. Sciences)',
    tuitionMyr: 'RM 24,200 (Net)',
    tuitionBdt: '~BDT 6.53 Lakhs',
    progression: 'Direct entry into MBBS, Dentistry, Pharmacy, Physiotherapy, or Biomedical Engineering (RM 7,200 scholarship applied)',
  },
  {
    institution: 'MAHSA University',
    program: 'Foundation in Business / Arts',
    level: '1-Year Foundation',
    duration: '1 Year (3 Semesters)',
    requirement: '5 O-Level / SSC Credits',
    tuitionMyr: 'RM 20,600 (Net)',
    tuitionBdt: '~BDT 5.56 Lakhs',
    progression: 'Direct entry into BBA, Accounting & Finance, International Business, or Hospital Management',
  },
  {
    institution: 'SEGi University & Colleges',
    program: 'Foundation in Science / Foundation in Arts',
    level: '1-Year Foundation',
    duration: '1 Year (3 Semesters)',
    requirement: '5 O-Level / SSC Credits',
    tuitionMyr: 'RM 37,868 – RM 39,628 (All-in)',
    tuitionBdt: '~BDT 10.22L – 10.70L',
    progression: 'Inclusive of EMGS, admin & facilities fees. Progresses to UK Dual Award degrees (University of Central Lancashire)',
  },
  {
    institution: 'SEGi University & Colleges',
    program: 'Diploma in Computer Science / IT / Business',
    level: '2.5-Year Diploma',
    duration: '2.5 Years',
    requirement: '3 O-Level / SSC Credits',
    tuitionMyr: 'RM 38,000 – RM 44,000',
    tuitionBdt: '~BDT 10.26L – 11.88L',
    progression: 'Credit transfer into Year 2 of Bachelor’s Degree with practical software & IT industry projects',
  },
  {
    institution: 'Lincoln University College',
    program: 'Diploma in Computer Science / Multimedia',
    level: '2.5-Year Diploma',
    duration: '2.5 Years (Coursework)',
    requirement: '3 O-Level / SSC Credits (incl. Math)',
    tuitionMyr: 'RM 42,200 (Total)',
    tuitionBdt: '~BDT 11.39 Lakhs',
    progression: 'Direct credit transfer into Year 2 of BSc (Hons) Computer Science or Software Engineering',
  },
  {
    institution: 'Lincoln University College',
    program: 'Diploma in Electrical & Electronic Engineering (EEE)',
    level: '2.5-Year Diploma',
    duration: '2.5 Years',
    requirement: '3 O-Level / SSC Credits (Math & Science)',
    tuitionMyr: 'RM 39,200 (Total)',
    tuitionBdt: '~BDT 10.58 Lakhs',
    progression: 'Practical lab & engineering workshop curriculum with direct progression into BEng (Hons) Engineering',
  },
  {
    institution: 'Sunway University & College',
    program: 'Sunway Foundation in Arts (FIA) / Science (FIST)',
    level: '1-Year Foundation',
    duration: '1 Year (3 Semesters)',
    requirement: '5 O-Level / SSC Credits',
    tuitionMyr: 'RM 28,000 – RM 35,000',
    tuitionBdt: '~BDT 7.56L – 9.45L',
    progression: 'Direct pathway to Lancaster University (UK) Dual Honours Degrees at Sunway University',
  },
  {
    institution: 'Taylor’s University',
    program: 'Taylor’s Foundation in Computing / Business / Design',
    level: '1-Year Foundation',
    duration: '1 Year (3 Semesters)',
    requirement: '5 O-Level / SSC Credits',
    tuitionMyr: 'RM 32,000 – RM 38,000',
    tuitionBdt: '~BDT 8.64L – 10.26L',
    progression: 'Premier pre-university preparation leading into QS Asia #41 Bachelor’s degrees',
  },
];

const faqs = [
  {
    question: 'Why is Malaysia so popular among Bangladeshi students?',
    answer:
      'Malaysia offers globally recognized UK and Australian degrees (via foreign branch campuses like Monash and Nottingham, or dual-award private universities like Sunway and Taylor’s) at 60%–70% lower tuition and living costs than London or Melbourne. Instruction across international degree programs is in English, MQA-accredited qualifications are recognized for global higher study and employment, and Malaysia is a welcoming, multicultural Muslim-majority nation with widely available halal food and a short 3.5-hour direct flight from Dhaka.',
  },
  {
    question: 'What is EduExpress’s service charge for Malaysian university applications?',
    answer:
      'EduExpress charges BDT 0 for Malaysian university counseling, application submission, document attestation guidance, and EMGS visa support. Students pay all institutional application fees, EMGS processing charges, and tuition directly to the respective university and Malaysian government agencies.',
  },
  {
    question: 'Do Bangladeshi students need an IELTS score to study in Malaysia?',
    answer:
      'Most undergraduate programs require an IELTS score of 5.0 to 6.0 (or equivalent TOEFL iBT / PTE Academic). However, several premier private universities accept a Medium of Instruction (MOI) English verification letter from Bangladeshi English-medium schools or recognized universities for conditional admission. Students entering without the requisite IELTS can also take an intensive English pathway course on campus in Malaysia.',
  },
  {
    question: 'How long does the EMGS eVAL visa approval process take?',
    answer:
      'The Education Malaysia Global Services (EMGS) visa clearance process generally takes 3 to 6 weeks from document submission to the issuance of the electronic Visa Approval Letter (eVAL) by the Malaysian Immigration Department. Once the eVAL is generated, students apply for their Single Entry Visa (SEV) either online or via the High Commission of Malaysia in Dhaka.',
  },
  {
    question: 'Can Bangladeshi students work part-time while studying in Malaysia?',
    answer:
      'Malaysian Immigration strictly regulates student employment. International students are permitted to work a maximum of 20 hours per week only during semester breaks or vacations exceeding 7 days. Permitted sectors are limited to restaurants, petrol stations, minimarkets, and hotels. Working off-campus during term time or without university permission is illegal and risks Student Pass cancellation.',
  },
  {
    question: 'How does credit transfer (2+1 or 1+2) to the UK, Australia, or Canada work?',
    answer:
      'Many Malaysian private institutions maintain formal articulation agreements with partner universities in the UK, Australia, New Zealand, the USA, and Canada. Under these agreements, students complete 1 or 2 years in Malaysia paying local Malaysian fees, and then transfer credits to the parent or partner institution abroad to complete their degree, saving millions of BDT in total overseas tuition.',
  },
];

export default async function StudyInMalaysiaPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: '2026-11-15',
        name: 'Study in Malaysia from Bangladesh | Costs, Visa & Universities',
        description:
          'Comprehensive guide for Bangladeshi students: MQA accreditation, UK/AU dual degrees, EMGS eVAL visa guide, itemized costs, and BDT 0 service charge.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/malaysia.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(MALAYSIA_HUB_SOURCES),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#universities`,
        name: 'Top Malaysian Universities for Bangladeshi Students',
        numberOfItems: universitiesStatic.length,
        itemListElement: universitiesStatic.map((u, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: u.name,
          url: `${SITE}/universities/${u.slug}`,
        })),
      },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      {/* Page Hero */}
      <PageHero
        path={PATH}
        trail={[{ name: 'Destinations', path: '/destinations' }, { name: 'Malaysia' }]}
        eyebrow="MQA Accredited · UK & Australian Dual Degrees · BDT 0 Agency Fee"
        title="Study in Malaysia from Bangladesh."
        lead="Earn a globally recognized UK, Australian, or Malaysian degree at 60%–70% lower total cost. Transparent tuition fees in MYR & BDT, step-by-step EMGS eVAL visa guidance, and free counseling with BDT 0 EduExpress service charge."
        actions={
          <>
            <Link href={applyHref} className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Get My Malaysia Study Plan <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#universities" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Explore 30 Verified Universities
            </a>
            <Link href="/study-in-malaysia-after-o-level" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              After O-Level Pathway
            </Link>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl border border-rule bg-white shadow-sm">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/destinations/malaysia-hero.webp"
                alt="Modern university campus and skyline in Kuala Lumpur, Malaysia"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="p-4 text-xs font-semibold text-petrol-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-emerald-600" aria-hidden="true" />
                Kuala Lumpur & Selangor Campus Hubs
              </span>
              <span className="rounded-full bg-lime/40 px-2.5 py-0.5 text-[11px] font-bold text-petrol-800">
                Planning ref: 1 MYR ≈ 27 BDT
              </span>
            </figcaption>
          </figure>
        }
      />

      <TrustBar destination="Malaysia" universities={9} />

      {/* Value Statement & Quick Navigation Bar */}
      <section aria-label="Malaysia study guide overview" className="border-b border-canvas-soft bg-white py-8">
        <div className={`${kit.wrap} grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">The EduExpress Standard</span>
            <p className="mt-2 text-[17px] font-medium leading-relaxed text-slate-700">
              Malaysia bridges world-class Western curriculum and affordable living in Southeast Asia. We provide direct institutional applications to 9 MQA-accredited institutions with full fee transparency and zero hidden consultancy fees.
            </p>
          </div>
          <nav aria-label="On this page" className="flex flex-wrap gap-2">
            {[
              ['Why Malaysia', '#why-malaysia'],
              ['Who It Fits', '#who-it-fits'],
              ['9 Universities', '#universities'],
              ['Admission Rules', '#admission'],
              ['Costs & Living', '#costs'],
              ['EMGS Visa', '#visa'],
              ['Work Rights', '#work-rights'],
              ['Comparison', '#comparison'],
              ['FAQs', '#faq'],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="inline-flex min-h-[40px] items-center rounded-full bg-canvas-soft px-4 text-xs font-bold text-petrol-800 transition-colors hover:bg-lime/30"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Module 1: Why Study in Malaysia */}
      <Section
        id="why-malaysia"
        title="Why Study in Malaysia? Education Quality First."
        intro="Malaysia has emerged as Southeast Asia’s premier higher education hub, combining Western degree certifications, English-medium coursework, and affordable living costs."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className={kit.cardSage}>
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-white text-petrol-800 shadow-sm">
              <Award size={24} className="text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-petrol-800">UK & Australian Branch Campuses</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Study at Monash University (Australia Go8), University of Nottingham (UK Russell Group), or Heriot-Watt University (UK) in Malaysia. Receive the exact same graduation parchment issued by the home campus at 60%–70% lower total expense.
            </p>
          </div>

          <div className={kit.cardSage}>
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-white text-petrol-800 shadow-sm">
              <Sparkles size={24} className="text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-petrol-800">Dual Degree Awards</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Leading private universities offer dual degrees with prominent British institutions—such as Sunway University with Lancaster University UK, Taylor’s with UWE Bristol, and APU with De Montfort University UK.
            </p>
          </div>

          <div className={kit.cardSage}>
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-white text-petrol-800 shadow-sm">
              <ShieldCheck size={24} className="text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-petrol-800">MQA & Global Recognition</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              All degree programs are accredited by the Malaysian Qualifications Agency (MQA) and fully recognized by the University Grants Commission (UGC) Bangladesh, ensuring global credibility for further study and careers.
            </p>
          </div>

          <div className={kit.cardSage}>
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-white text-petrol-800 shadow-sm">
              <Wallet size={24} className="text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-petrol-800">Affordable Modern Living</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Monthly living expenses range from RM 1,200 to RM 2,000 (~BDT 32,000–54,000), covering campus dormitories, halal food, and subsidized public transit across Kuala Lumpur and Selangor.
            </p>
          </div>
        </div>
      </Section>

      {/* Module 2: Who This Destination Fits — And Who Should Reconsider */}
      <Section
        id="who-it-fits"
        tone="sage"
        title="Who This Destination Fits — And Who Should Reconsider"
        intro="Transparent guidance ensures students make the right educational investment. Here is our realistic evaluation of who thrives in Malaysia and who should reconsider."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                <CheckCircle2 size={22} />
              </span>
              <h3 className="text-xl font-bold text-petrol-800">Malaysia Is an Ideal Fit For:</h3>
            </div>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>
                  <strong>Cost-Conscious Quality Seekers:</strong> Students wanting verified UK or Australian qualifications without bearing UK/US living costs of 30–50 lakh BDT per year.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>
                  <strong>Credit Transfer Planners:</strong> High school graduates planning a 1+2 or 2+1 twinning pathway to transition smoothly to campus in Australia, the UK, or Canada.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>
                  <strong>STEM, Computing & AI Enthusiasts:</strong> Applicants aiming for top digital technology programs (cybersecurity, software engineering, FinTech, and cloud computing) with industry internships.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>
                  <strong>Comfortable Cultural Transition:</strong> Families who value safety, modern infrastructure, widely available halal food, and close proximity to Dhaka (3.5 hours flight time).
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
                <ShieldAlert size={22} />
              </span>
              <h3 className="text-xl font-bold text-petrol-800">Who Should Reconsider:</h3>
            </div>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-600" />
                <span>
                  <strong>Students Relying on Part-Time Work for Tuition:</strong> Malaysian law strictly caps part-time student work at 20 hours/week during semester breaks only. Term-time off-campus work is illegal and leads to Student Pass cancellation.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-600" />
                <span>
                  <strong>Applicants Seeking Immediate Permanent Residency (PR):</strong> Malaysia does not offer permanent residency through student pathways. Post-study options require skilled Employment Pass (EP) sponsorship or the DE Rantau Nomad Pass.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-600" />
                <span>
                  <strong>Students Expecting 100% Free Government Grants:</strong> Unlike China’s CSC Scholarships, Malaysian public scholarships are highly restricted for international students. Expect partial merit awards (15%–75%), not zero-tuition government stipends.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 3: 30 Verified Malaysian Universities */}
      <Section
        id="universities"
        title="30 Verified Malaysian Universities & Colleges"
        intro="Explore our comprehensive catalog of 30 accredited Malaysian universities. Compare premier public research giants, world-top foreign branch campuses, top private dual-award institutions, and specialized healthcare & engineering colleges with official logos, verified QS rankings, and itemized fees."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {universitiesStatic.map((uni) => (
            <div
              key={uni.slug}
              className="flex flex-col justify-between rounded-3xl border border-rule bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-rule bg-canvas-soft p-1.5">
                    {uni.logo ? (
                      <Image
                        src={uni.logo}
                        alt={`${uni.name} official logo`}
                        fill
                        unoptimized
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <span className="grid size-full place-items-center text-xs font-bold text-petrol-800">
                        {uni.name.slice(0, 3)}
                      </span>
                    )}
                  </div>
                  <span className="rounded-full bg-canvas-soft px-3 py-1 text-[11px] font-bold text-petrol-800">
                    {uni.city}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-petrol-800">{uni.name}</h3>
                <span className="text-xs font-semibold text-emerald-800 block mt-0.5">{uni.type}</span>
                <p className="mt-1 text-xs font-bold text-slate-500">{uni.ranking}</p>

                {uni.levels && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {uni.levels.map((lvl) => (
                      <span
                        key={lvl}
                        className="rounded-md border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800"
                      >
                        {lvl}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-3 text-xs leading-relaxed text-slate-600">{uni.highlights}</p>

                <div className="mt-4 rounded-2xl bg-canvas-soft p-3 text-xs">
                  <span className="text-slate-500 block">Indicative Tuition:</span>
                  <span className="font-bold text-petrol-800 block mt-0.5">{uni.tuition}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-rule pt-4 text-xs font-bold">
                <span className="text-emerald-700">EduExpress Fee: BDT 0</span>
                <Link
                  href={`/universities/${uni.slug}`}
                  className="inline-flex items-center gap-1 text-petrol-800 hover:text-emerald-700"
                >
                  View Profile <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/universities?country=Malaysia"
            className="ed-btn ed-btn-outline min-h-[48px] px-8 text-sm"
          >
            Compare All Programs & Fees in Directory <ArrowRight size={16} />
          </Link>
        </div>
      </Section>

      {/* Module 4: Admission Requirements for Bangladesh */}
      <Section
        id="admission"
        tone="sage"
        title="Admission Requirements for Bangladeshi Students"
        intro="Direct entry criteria vary by study level and university tier. Here are the standardized benchmarks for applicants from Bangladesh."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800">
              UG
            </span>
            <h3 className="mt-4 text-lg font-bold text-petrol-800">Bachelor’s Degree Entry</h3>
            <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-slate-600">
              <li>• <strong>HSC / Alim:</strong> Minimum GPA 3.50 to 4.00 (Engineering and Computing require GPA 4.00+ with Higher Math and Physics).</li>
              <li>• <strong>A Levels:</strong> Minimum 2–3 passes with grade C or above in relevant subjects.</li>
              <li>• <strong>Foundation Year:</strong> Available for students with SSC or O-Level passes to bridge into undergraduate programs.</li>
              <li>• <strong>English:</strong> IELTS 5.5–6.0 or Medium of Instruction (MOI) verification.</li>
            </ul>
            <div className="mt-4 border-t border-rule pt-3">
              <Link
                href="/study-in-malaysia-after-o-level"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-petrol-800 hover:underline"
              >
                O-Level Foundation &amp; Diploma Guide (Skip 2-Yr A-Levels) <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800">
              PG
            </span>
            <h3 className="mt-4 text-lg font-bold text-petrol-800">Master’s & MBA Entry</h3>
            <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-slate-600">
              <li>• <strong>Bachelor’s CGPA:</strong> Minimum 2.75 / 4.00 from a recognized Bangladeshi university (public or private).</li>
              <li>• <strong>Work Experience:</strong> 2+ years preferred for executive MBA tracks; not mandatory for standard MSc programs.</li>
              <li>• <strong>Research Proposal:</strong> Required only for Master’s by Research or MPhil pathways.</li>
              <li>• <strong>English:</strong> IELTS 6.0–6.5 or institutional English proficiency letter.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800">
              DOC
            </span>
            <h3 className="mt-4 text-lg font-bold text-petrol-800">Required File Checklist</h3>
            <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-slate-600">
              <li>• <strong>Passport:</strong> Clean scan of all pages with minimum 18 months remaining validity.</li>
              <li>• <strong>Academic Transcripts:</strong> Certificates & marksheets attested by Education Board & MoFA.</li>
              <li>• <strong>Photographs:</strong> 35mm x 45mm passport photos with white and blue backgrounds (EMGS spec).</li>
              <li>• <strong>Health Form:</strong> Pre-departure EMGS Health Declaration Form signed by applicant.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 4B: O-Level & SSC Fast-Track: Foundation & Diploma Pathways */}
      <Section
        id="olevel-pathways"
        title="O-Level &amp; SSC Fast-Track: Foundation &amp; Diploma Pathways"
        intro="Skip 2 years of expensive A-Levels or HSC in Bangladesh: Enter accredited Malaysian universities directly after Grade 10 / Year 11 through 1-Year Pre-University Foundation or 2 to 2.5-Year Professional Diploma programs."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pathway A */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-emerald-500/20 bg-emerald-50/40 p-7 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Option A · Fastest Route
                </span>
                <span className="text-xs font-bold text-slate-500">Duration: 12 Months</span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-petrol-800">1-Year Pre-University Foundation</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Specifically designed for students completing O-Levels (IGCSE) or SSC. Provides an intensive, subject-tailored academic bridge covering required prerequisite modules in Computing, Allied Science, Engineering, or Business.
              </p>

              <div className="mt-5 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span><strong>Minimum Entry:</strong> 5 Credits (Grade C / GPA 3.0+) in O-Level or SSC subjects.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span><strong>Progression:</strong> Direct entry into Year 1 of a 3-Year Bachelor’s degree.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span><strong>Total Time to Degree:</strong> 4 Years from O-Level (saves 1 full year vs traditional 2-year A-Level + 3-year degree).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span><strong>Tuition Range:</strong> RM 18,000 – RM 32,000 total (~BDT 4.86L – 8.64L).</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-emerald-200/60 pt-4">
              <span className="text-[11px] font-semibold text-emerald-800">Best For: Students targeting Computing, Business, Engineering, or Pre-Med degrees.</span>
            </div>
          </div>

          {/* Pathway B */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-petrol-800/15 bg-white p-7 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-petrol-100 px-3 py-1 text-xs font-bold text-petrol-800">
                  Option B · Practical Dual-Exit
                </span>
                <span className="text-xs font-bold text-slate-500">Duration: 24–30 Months</span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-petrol-800">2 to 2.5-Year Professional Diploma</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Hands-on, skills-focused qualifications accredited by MQA, Pharmacy Board, and Nursing Board. Combines theoretical coursework, industry laboratory training, and compulsory paid/supervised internships.
              </p>

              <div className="mt-5 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-petrol-800" />
                  <span><strong>Minimum Entry:</strong> 3 Credits (Grade C / GPA 2.5+) in O-Level or SSC subjects.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-petrol-800" />
                  <span><strong>Credit Transfer Advantage:</strong> Articulates directly into <strong>Year 2</strong> of a relevant Bachelor’s degree.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-petrol-800" />
                  <span><strong>Dual-Exit Safety:</strong> Graduate with an immediate career-ready Diploma OR complete a Bachelor’s in just 1.5–2 additional years.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-petrol-800" />
                  <span><strong>Tuition Range:</strong> RM 36,000 – RM 56,000 total (~BDT 9.72L – 15.12L across 2–2.5 yrs).</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-rule pt-4">
              <span className="text-[11px] font-semibold text-petrol-800">Best For: Students with 3–4 credits, or those pursuing Nursing, Pharmacy, ICT, or EEE.</span>
            </div>
          </div>
        </div>

        {/* Authentic Program Fee Schedule Table */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-rule bg-white shadow-sm">
          <div className="border-b border-rule bg-canvas-soft px-6 py-4">
            <h3 className="text-sm font-bold text-petrol-800">
              Verified Foundation &amp; Diploma Fee Schedules (Asian Education Solutions Partner Rates)
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Exact published tuition, duration, and degree progression pathways for Bangladeshi students at top partner institutions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-rule bg-slate-50 font-bold text-petrol-800">
                <tr>
                  <th className="p-4">Institution &amp; Program</th>
                  <th className="p-4">Pathway Level</th>
                  <th className="p-4">Duration &amp; Requirement</th>
                  <th className="p-4">Official Total Tuition</th>
                  <th className="p-4">Bachelor Degree Progression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-slate-700">
                {foundationDiplomaPrograms.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <span className="font-bold text-petrol-800 block">{p.program}</span>
                      <span className="text-[11px] text-slate-500">{p.institution}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          p.level.includes('Foundation')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {p.level}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold block">{p.duration}</span>
                      <span className="text-[11px] text-slate-500">{p.requirement}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-emerald-800 block">{p.tuitionMyr}</span>
                      <span className="text-[11px] text-slate-500">{p.tuitionBdt}</span>
                    </td>
                    <td className="p-4 text-[11px] leading-relaxed text-slate-600 max-w-xs">
                      {p.progression}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-rule bg-canvas-soft p-5 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-700 shrink-0" />
              <span className="text-slate-700">
                <strong>EduExpress Zero-Fee Policy:</strong> BDT 0 application and EMGS student visa processing charge for all Foundation &amp; Diploma applicants.
              </span>
            </div>
            <Link
              href="/study-in-malaysia-after-o-level"
              className="inline-flex items-center gap-1.5 font-bold text-petrol-800 hover:text-emerald-700 whitespace-nowrap"
            >
              Read Full O-Level Comparison Guide <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Section>

      {/* Module 5: Total Cost & Funding Reality */}
      <Section
        id="costs"
        title="Total Cost of Studying in Malaysia"
        intro="Financial planning for Bangladeshi families: Tuition fees in MYR & BDT, monthly living budgets, and the Bangladesh Bank Student File remittance pathway."
      >
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
                <tr>
                  <th className="p-4">Institution Category</th>
                  <th className="p-4">Annual Tuition (MYR)</th>
                  <th className="p-4">Annual Tuition (BDT)</th>
                  <th className="p-4">Degree Awarded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-slate-700">
                <tr>
                  <td className="p-4 font-bold text-petrol-800">Pre-U Foundation Programs (1 Year)</td>
                  <td className="p-4">RM 18,000 – 32,000 total</td>
                  <td className="p-4">~4.8L – 8.6L BDT</td>
                  <td className="p-4">Direct Bachelor Year 1 Entry (Skip A-Levels)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-petrol-800">Diploma Programs (2 – 2.5 Years Total)</td>
                  <td className="p-4">RM 36,000 – 56,000 total</td>
                  <td className="p-4">~9.7L – 15.1L BDT</td>
                  <td className="p-4">MQA Diploma + Direct Credit Transfer to Degree Yr 2</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-petrol-800">Public Research Universities (UM, UTM, UKM, USM)</td>
                  <td className="p-4">RM 14,000 – 24,000 / yr</td>
                  <td className="p-4">~3.8L – 6.5L BDT</td>
                  <td className="p-4">Malaysian Public Degree</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-petrol-800">Premier Private Dual-Award (Sunway, Taylor’s, APU, SEGi)</td>
                  <td className="p-4">RM 24,000 – 42,000 / yr</td>
                  <td className="p-4">~6.5L – 11.3L BDT</td>
                  <td className="p-4">UK Dual Degree / Malaysian Degree</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-petrol-800">UK/AU Branch Campuses (Monash, Southampton)</td>
                  <td className="p-4">RM 38,000 – 58,000 / yr</td>
                  <td className="p-4">~10.2L – 15.6L BDT</td>
                  <td className="p-4">Direct UK / Australian Parchment</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-petrol-800">Initial Visa &amp; EMGS Processing (One-Time)</td>
                  <td className="p-4">RM 2,800 – 3,500</td>
                  <td className="p-4">~75,000 – 95,000 BDT</td>
                  <td className="p-4">EMGS eVAL, Medical Screening &amp; Insurance</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-petrol-800">Monthly Living Expenses (Food &amp; Dorm)</td>
                  <td className="p-4">RM 1,200 – 2,000 / mo</td>
                  <td className="p-4">~32,000 – 54,000 BDT</td>
                  <td className="p-4">Hostel, Meals, Local Transit, SIM (No hidden agency fee)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between rounded-3xl bg-petrol-800 p-7 text-white shadow-sm sm:p-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-lime">Bank Student File Note</span>
              <h3 className="mt-2 text-xl font-bold">Bangladesh Bank Student File</h3>
              <p className="mt-3 text-xs leading-relaxed text-white/80">
                Unlike China’s full scholarship route, studying in Malaysia requires setting up an Authorized Dealer (AD) Bank Student File in Dhaka. This enables legal wire transfers of semester tuition directly to the Malaysian institution and releases an international Education Card for living expenses.
              </p>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-white/20 pt-4">
              <Link
                href="/malaysia-study-cost-bangladesh"
                className="flex items-center gap-2 text-sm font-bold text-lime hover:underline"
              >
                Read Itemized Malaysia Cost Guide <ArrowRight size={16} />
              </Link>
              <Link
                href="/malaysia-scholarships-bangladesh"
                className="flex items-center gap-2 text-sm font-bold text-white hover:text-lime hover:underline"
              >
                Explore Malaysia Scholarships &amp; 10%–75% Merit Waivers <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 6: EMGS Visa & Residence Process */}
      <Section
        id="visa"
        tone="sage"
        title="EMGS Student Visa & Immigration Process"
        intro="The Malaysian student pass system is fully centralized under Education Malaysia Global Services (EMGS). Here is the 5-step official pathway from Dhaka to arrival."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              step: 'Step 1',
              title: 'Offer Letter',
              desc: 'Apply and receive an official Offer Letter from an MQA-accredited Malaysian institution.',
            },
            {
              step: 'Step 2',
              title: 'EMGS eVAL',
              desc: 'University submits passport and medical file to EMGS. Approval letter (eVAL) issued in 3–6 weeks.',
            },
            {
              step: 'Step 3',
              title: 'SEV in Dhaka',
              desc: 'Apply for Single Entry Visa (SEV) at Malaysian High Commission in Dhaka or via eVISA portal.',
            },
            {
              step: 'Step 4',
              title: 'Airport Meet',
              desc: 'Fly to KLIA. University officer meets and clears student at Immigration border control.',
            },
            {
              step: 'Step 5',
              title: 'Medical & i-KAD',
              desc: 'Complete 7-day post-arrival clinic check. Passport stamped with Student Pass sticker and i-KAD issued.',
            },
          ].map((item) => (
            <div key={item.step} className="rounded-3xl bg-white p-5 shadow-sm">
              <span className="text-xs font-black uppercase text-emerald-700">{item.step}</span>
              <h3 className="mt-2 text-sm font-bold text-petrol-800">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-rule bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Official Regulatory Roadmap · 2027 Intake
              </span>
              <h3 className="text-base font-bold text-petrol-800">
                Deep Dive: EMGS eVAL Tracking, High Commission (Dhaka) Checklist & i-KAD
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Access percentage milestone breakdown (0% to 100%), required certificate attestations (Board & MoFA), Section 15 airport border escort protocols, and BDT 0 service terms.
              </p>
            </div>
            <Link
              href="/malaysia-student-visa-bangladesh"
              className="ed-btn ed-btn-signal min-h-[48px] px-6 text-xs font-bold whitespace-nowrap shrink-0"
            >
              Read Visa & eVAL Guide <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/malaysia-student-visa-bangladesh"
            className="ed-btn ed-btn-outline min-h-[48px] px-8 text-sm"
          >
            View Complete Malaysia Student Visa Guide <ArrowRight size={16} />
          </Link>
        </div>
      </Section>

      {/* Module 7: Work Rights & Career Pathways */}
      <Section
        id="work-rights"
        title="Work Rights and Post-Study Career Pathways"
        intro="Understand the realistic legal boundaries of part-time employment and post-graduation opportunities in Malaysia."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <h3 className="text-lg font-bold text-petrol-800">Part-Time Student Work Regulations</h3>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-700" />
                <span><strong>Permitted Hours:</strong> Maximum 20 hours per week strictly during semester breaks or vacations exceeding 7 days.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-700" />
                <span><strong>Permitted Sectors:</strong> Restaurants, petrol stations, minimarkets, and hotels only. Work in other roles (e.g. cashiering, bars, entertainment) is prohibited.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-700" />
                <span><strong>University Approval:</strong> A formal application must be endorsed by the university dean before commencing work.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <h3 className="text-lg font-bold text-petrol-800">Post-Graduation Career Progression</h3>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-700" />
                <span><strong>Employment Pass (EP):</strong> Multinational corporations (MNCs) in Greater KL and Penang actively hire STEM, IT, and Finance graduates under EP category visas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-700" />
                <span><strong>DE Rantau Nomad Visa:</strong> Tech and software graduates working remotely can transition to Malaysia’s official Digital Nomad Visa.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-700" />
                <span><strong>UK/Australia Mobility:</strong> Dual-degree and branch-campus credentials allow seamless admission to postgraduate and career routes in the UK, Australia, and Singapore.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 8: Comparison with Alternatives */}
      <Section
        id="comparison"
        tone="sage"
        title="Comparing Malaysia with Alternative Destinations"
        intro="How does studying in Malaysia compare with China’s full-scholarship routes or direct study in the UK and Australia?"
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Criteria</th>
                <th className="p-4 text-emerald-800">Study in Malaysia</th>
                <th className="p-4">Study in China</th>
                <th className="p-4">Direct UK / Australia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">Annual Tuition</td>
                <td className="p-4 font-bold text-emerald-800">RM 14,000 – 45,000 (~3.8L – 12L BDT)</td>
                <td className="p-4">0 BDT (CSC) / 12,000–30,000 RMB (~2.2L–5.6L BDT)</td>
                <td className="p-4">£15,000 – £35,000 (~23L – 55L BDT)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Annual Living Cost</td>
                <td className="p-4 font-bold text-emerald-800">~3.8L – 6.5L BDT / year</td>
                <td className="p-4">~2.2L – 3.5L BDT (Stipends offset for CSC)</td>
                <td className="p-4">~18L – 25L BDT / year</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Medium of Instruction</td>
                <td className="p-4 font-bold text-emerald-800">English medium across international programs</td>
                <td className="p-4">English or Chinese (HSK required for bilingual)</td>
                <td className="p-4">English medium</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Degree Type</td>
                <td className="p-4 font-bold text-emerald-800">UK/AU Branch, UK Dual, or Malaysian</td>
                <td className="p-4">Chinese National University Degree</td>
                <td className="p-4">UK or Australian Degree</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Bank Student File</td>
                <td className="p-4 font-bold text-emerald-800">Required (Semester tuition wire transfer)</td>
                <td className="p-4">Not Required (Zero pre-departure tuition)</td>
                <td className="p-4">Required (Substantial financial solvency)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">EduExpress Service Charge</td>
                <td className="p-4 font-bold text-emerald-800">BDT 0 (Free Service)</td>
                <td className="p-4">BDT 0 Pre-Visa / Package Fee Post-Visa</td>
                <td className="p-4">Standard Agency Terms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 9: FAQs */}
      <Section id="faq" title="Frequently Asked Questions" intro="Common questions from Bangladeshi students and parents regarding studying in Malaysia.">
        <FaqBlock items={faqs} />
      </Section>

      {/* Module 10: EduExpress Commitment & Sources */}
      <Section tone="sage" title="Our Transparent Service Commitment">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-petrol-800">BDT 0 Service Charge</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              EduExpress charges zero service fees for Malaysian university applications, offer letter issuance, and EMGS visa guidance.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-petrol-800">Official Direct Transfers</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Students pay application fees, EMGS visa charges, and tuition directly to the university’s official account via Bangladesh Bank student file.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-petrol-800">Official Regulatory Sources</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Data verified against Malaysian Qualifications Agency (MQA), Education Malaysia Global Services (EMGS), and Ministry of Higher Education Malaysia (MoHE).
            </p>
            <ul className="mt-3 space-y-1.5 text-xs font-semibold text-petrol-800">
              {MALAYSIA_HUB_SOURCES.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 underline-offset-4 hover:underline"
                  >
                    <ExternalLink size={12} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />
                    <span>{source.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 11: Education Fit Assessment CTA */}
      <section className="bg-canvas-soft py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Free Assessment</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Malaysia Eligibility & Cost</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic results and preferred subject. An EduExpress counselor will evaluate your direct admission and scholarship eligibility within one working day.
              </p>
            </div>
            <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm sm:p-10">
              <EducationFitAssessment />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
