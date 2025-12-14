export interface Country {
  name: string;
  slug: string;
  flag: string;
  description: string;
  universities: string[];
  programs: string[];
  requirements: {
    language: string[];
    documents: string[];
    visa: string[];
  };
  costs: {
    tuition: string;
    living: string;
    currency: string;
  };
  scholarships: string[];
  benefits: string[]; // Added benefits field
  isActive: boolean;
  featured: boolean;
  images: string[];
  metaTitle?: string;
  metaDescription?: string;
}

export const countries: Country[] = [
  {
    name: 'China',
    slug: 'china',
    flag: '🇨🇳',
    description: 'Full Scholarships & Top Global Rankings',
    universities: ['Tsinghua University', 'Peking University', 'Zhejiang University', 'Shanghai Jiao Tong'],
    programs: ['MBBS', 'Engineering', 'Computer Science', 'Business', 'Mandarin Language'],
    requirements: {
      language: ['IELTS not always required', 'HSK 4+ for Chinese medium'],
      documents: ['Transcripts', 'Physical Examination', 'Police Clearance', 'Bank Statement'],
      visa: ['JW202 Form', 'X1/X2 Visa Application']
    },
    costs: {
      tuition: '$2,500 - $6,000 / year (Often Free)',
      living: '$200 - $400 / month',
      currency: 'USD'
    },
    scholarships: ['CSC Scholarship (Type A & B)', 'University Presidential Scholarship', 'Belt & Road Scholarship', 'Provincial Government Scholarship'],
    benefits: ['Full Free Scholarship', 'Global Top Ranking Universities', 'No IELTS Options'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in China from Bangladesh - Full Scholarships 2025',
    metaDescription: 'Study in China with full Free scholarship. No IELTS options available. Top ranking universities for Medicine and Engineering.'
  },
  {
    name: 'South Korea',
    slug: 'south-korea',
    flag: '🇰🇷',
    description: 'Technology Hub with GKS Scholarships',
    universities: ['Seoul National University', 'KAIST', 'Korea University', 'Yonsei University'],
    programs: ['Computer Science', 'Engineering', 'Business', 'Media & Arts'],
    requirements: {
      language: ['IELTS 5.5+ or TOPIK Level 3'],
      documents: ['Apostilled Transcripts', 'Study Plan', 'Bank Solvency ($20,000)'],
      visa: ['Certificate of Admission (CoA)', 'D-2 Visa']
    },
    costs: {
      tuition: '$3,000 - $6,000 / semester',
      living: '$500 - $800 / month',
      currency: 'USD'
    },
    scholarships: ['GKS (Global Korea Scholarship)', 'Professor Scholarship', 'University Merit Scholarship'],
    benefits: ['GKS Full Scholarship', 'Part-time Work Allowed', 'High Tech Education'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in South Korea from Bangladesh - GKS Scholarship',
    metaDescription: 'Apply for GKS Scholarship in South Korea. Study in top tech universities with funding.'
  },
  {
    name: 'United Kingdom',
    slug: 'uk',
    flag: '🇬🇧',
    description: 'Prestigious Degrees & Post-Study Work',
    universities: ['Russell Group Universities', 'University of Manchester', 'Coventry University', 'UWE Bristol'],
    programs: ['Business', 'Law', 'Data Science', 'Public Health', 'Engineering'],
    requirements: {
      language: ['IELTS 6.0+ (MOI accepted for some)', 'PTE 58+'],
      documents: ['SOP', 'LOR', 'Bank Solvency (28 days maturity)', 'TB Test'],
      visa: ['CAS Letter', 'Tier 4 Student Visa', 'IHS Surcharge Payment']
    },
    costs: {
      tuition: '£12,000 - £16,000 / year',
      living: '£1,000 - £1,300 / month',
      currency: 'GBP'
    },
    scholarships: ['Commonwealth Scholarship', 'Great Scholarship', 'Vice Chancellor Excellence'],
    benefits: ['2-Year Post Study Work', 'Spouse Visa Integration', 'World Class Education'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in UK from Bangladesh - No IELTS Options',
    metaDescription: 'Study in UK with 2-year post-study work permit (PSW). Gap accepted. Apply now.'
  },
  {
    name: 'Hungary',
    slug: 'hungary',
    flag: '🇭🇺',
    description: 'Stipendium Hungaricum Full Scholarship',
    universities: ['University of Debrecen', 'University of Pecs', 'Eotvos Lorand University'],
    programs: ['Medicine', 'Engineering', 'Business', 'Agriculture'],
    requirements: {
      language: ['IELTS 5.5+ or Duolingo'],
      documents: ['Medical Certificate', 'Motivation Letter', 'Transcripts'],
      visa: ['D-Type Visa', 'Accommodation Proof']
    },
    costs: {
      tuition: '€3,000 - €6,000 / year (Free with Scholarship)',
      living: '€300 - €500 / month',
      currency: 'EUR'
    },
    scholarships: ['Stipendium Hungaricum (Full Free + Monthly Stipend)', 'Diaspora Scholarship'],
    benefits: ['Full Scholarship + Stipend', 'Schengen Visa Access', 'Affordable Living Cost'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1516901632977-d141a38d469b?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in Hungary from Bangladesh - Stipendium Hungaricum',
    metaDescription: 'Apply for Stipendium Hungaricum Scholarship in Hungary. Full free tuition + Dormitory + Monthly stipend.'
  },
  {
    name: 'Finland',
    slug: 'finland',
    flag: '🇫🇮',
    description: 'Happiest Country & High Tech Education',
    universities: ['Aalto University', 'LUT University', 'Tampere University'],
    programs: ['IT', 'Business', 'Game Design', 'Sustainable Engineering'],
    requirements: {
      language: ['IELTS 6.0+', 'PTE 55+'],
      documents: ['SAT often required for Bachelors', 'Motivation Video'],
      visa: ['Residence Permit (Type A)', 'Block Account (€6,720)']
    },
    costs: {
      tuition: '€6,000 - €10,000 / year',
      living: '€600 - €800 / month',
      currency: 'EUR'
    },
    scholarships: ['Finland Scholarship (100% + €5000)', 'Early Bird Discount (50%)'],
    benefits: ['PR Opportunity', 'Spouse Can Work Full-time', 'Happiest Country in World'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1517935706615-2717063c2225?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in Finland - Scholarships for Bangladeshi Students',
    metaDescription: 'Study in Finland with huge scholarships. Easy PR pathway after graduation.'
  },
  {
    name: 'Cyprus',
    slug: 'cyprus',
    flag: '🇨🇾',
    description: 'Affordable Education & Easy Visa',
    universities: ['European University of Lefke', 'Near East University', 'Eastern Mediterranean University'],
    programs: ['Hotel Management', 'Business', 'Pharmacy', 'Engineering'],
    requirements: {
      language: ['No IELTS required', 'Internal English Test'],
      documents: ['Passport Copy', 'Photos', 'Transcripts'],
      visa: ['On-arrival Visa (North)', 'Embassy Visa (South)']
    },
    costs: {
      tuition: '€2,500 - €4,000 / year',
      living: '€300 - €400 / month',
      currency: 'EUR'
    },
    scholarships: ['50% Scholarship for All International Students'],
    benefits: ['No IELTS Required', 'Very Affordable Tuition', 'Easy Visa Process'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in Cyprus from Bangladesh - No IELTS',
    metaDescription: 'Study in Cyprus with 50% scholarship. No IELTS required. Affordable tuition fees.'
  },
  {
    name: 'Croatia',
    slug: 'croatia',
    flag: '🇭🇷',
    description: 'Schengen Country & Tourism Hub',
    universities: ['University of Zagreb', 'Algebra University College', 'RIT Croatia'],
    programs: ['Tourism', 'Digital Marketing', 'Computer Science'],
    requirements: {
      language: ['IELTS 6.0'],
      documents: ['Police Clearance', 'Apostilled Documents'],
      visa: ['Temporary Residence Permit']
    },
    costs: {
      tuition: '€3,000 - €5,000 / year',
      living: '€500 - €700 / month',
      currency: 'EUR'
    },
    scholarships: ['Ministry of Science Scholarship', 'Erasmus+'],
    benefits: ['Schengen Member State', 'High Visa Success Rate', 'Part-time Work Rights'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in Croatia - Schengen Visa',
    metaDescription: 'Study in Croatia (Schengen Area). Affordable tuition and work opportunities.'
  },
  {
    name: 'Georgia',
    slug: 'georgia',
    flag: '🇬🇪',
    description: 'Best for MBBS (No Entrance Exam)',
    universities: ['University of Georgia (UG)', 'Tbilisi State Medical University', 'SEU'],
    programs: ['MBBS (Medicine)', 'Dentistry', 'Business'],
    requirements: {
      language: ['Video Interview', 'Basic English'],
      documents: ['Passport', 'High School Transcripts'],
      visa: ['E-Visa or Embassy Visa']
    },
    costs: {
      tuition: '$4,500 - $6,000 / year (MBBS)',
      living: '$300 - $500 / month',
      currency: 'USD'
    },
    scholarships: ['Merit based tuition discounts'],
    benefits: ['No Entrance Exam', 'WHO Recognized Degree', 'Low Cost of Living'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1565008576549-57569a49371d?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'MBBS in Georgia for Bangladeshi Students',
    metaDescription: 'Study MBBS in Georgia. WHO recognizable degree. No entrance exam. Low cost.'
  },
  {
    name: 'Malaysia',
    slug: 'malaysia',
    flag: '🇲🇾',
    description: 'World-Class Education & Affordable Living',
    universities: ['Universiti Malaya', 'UTM', 'Monash Malaysia', 'Nottingham Malaysia'],
    programs: ['Business', 'Engineering', 'IT', 'Hospitality'],
    requirements: {
      language: ['IELTS 5.0-6.0', 'MOI Accepted'],
      documents: ['Passport', 'Photos', 'Transcripts'],
      visa: ['EMGS Approval', 'Student Pass']
    },
    costs: {
      tuition: '$4,000 - $8,000 / year',
      living: '$300 - $500 / month',
      currency: 'USD'
    },
    scholarships: ['University Merit Scholarship', 'MIS Scholarship'],
    benefits: ['Affordable Tuition', 'Transfer Options to UK/AUS', 'Multicultural Hub'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in Malaysia from Bangladesh - Affordable Quality Education',
    metaDescription: 'Study in Malaysia with affordable tuition fees. Transfer credits to UK/Australia/USA. Apply now.'
  }
];

// Simple country names for navigation
export const countryNames = countries.map(country => country.name);

// Country lookup by slug
export const getCountryBySlug = (slug: string): Country | undefined => {
  return countries.find(country => country.slug === slug);
};

// Featured countries
export const featuredCountries = countries.filter(country => country.featured);

// Active countries
export const activeCountries = countries.filter(country => country.isActive);
