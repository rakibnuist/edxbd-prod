export interface DegreeLevel {
  title: string;
  duration: string;
  desc: string;
  icon: string;
  color: string;
}

export interface ProgramCategory {
  name: string;
  programs: string[];
  icon: string;
}

export interface CityDetail {
  name: string;
  stats: string;
  highlights: string[];
  imageQuery: string;
}

export interface ScholarshipDetail {
  name: string;
  amount: string;
  deadline: string;
  icon: string;
}

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
  benefits: string[];
  isActive: boolean;
  featured: boolean;
  images: string[];
  metaTitle?: string;
  metaDescription?: string;
  
  // Extended fields for rich template rendering
  nextDeadline?: string;
  intakesText?: string;
  factText?: string;
  degreesList?: DegreeLevel[];
  popularProgramsList?: ProgramCategory[];
  citiesList?: CityDetail[];
  scholarshipsList?: ScholarshipDetail[];
  faqs?: { question: string; answer: string }[];

  // SEO Strategy 14-Point Module Fields
  serviceStatus?: 'Flagship' | 'Active' | 'Pilot' | 'Launching' | 'Researching' | 'Temporarily Paused';
  valueStatement?: string;
  whoItFits?: string[];
  whoShouldReconsider?: string[];
  educationSystemAndRecognition?: string;
  workRightsAndCareer?: {
    rights: string;
    opportunities: string;
    caveats: string;
  };
  comparisons?: {
    countryA: string;
    countryA_description: string;
    countryB: string;
    countryB_description: string;
  };
  reviewerInfo?: {
    name: string;
    role: string;
    lastVerifiedDate: string;
    primarySources: string[];
  };
}

export const countries: Country[] = [
  {
    name: 'China',
    slug: 'china',
    flag: '🇨🇳',
    description: 'Full Scholarships & Top Global Rankings for Bangladeshi Students',
    universities: ['Tsinghua University', 'Peking University', 'Zhejiang University', 'Shanghai Jiao Tong', 'Fudan University', 'Nanjing University'],
    programs: ['MBBS', 'Engineering', 'Computer Science', 'Business', 'Mandarin Language'],
    requirements: {
      language: ['IELTS not always required (English Proficiency Letter from Bangladeshi College/University accepted)', 'HSK 4+ required only for Chinese-medium programs'],
      documents: ['Notarized Transcripts & Certificates (SSC/HSC/Bachelors)', 'Physical Examination Form (From Dhaka Hospitals)', 'Police Clearance Certificate (From Bangladesh Police)', 'Study Plan/SOP'],
      visa: ['JW202/JW201 Government Form', 'X1/X2 Visa Application at China Embassy in Dhaka, Bangladesh']
    },
    costs: {
      tuition: '$2,500 - $6,000 / year (CSC scholarship may cover full tuition, subject to eligibility)',
      living: '$200 - $400 / month',
      currency: 'USD'
    },
    scholarships: ['CSC Scholarship (Type A & B)', 'University Presidential Scholarship', 'Belt & Road Scholarship', 'Provincial Government Scholarship'],
    benefits: ['100% Free Tuition & Hostel Accommodation', 'Global Top 100 QS Ranking Universities', 'No IELTS Options for Bangladeshi Students'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Best Agency for China in Bangladesh | Scholarships 2027',
    metaDescription: 'EduExpress is the best education consultancy in Bangladesh for studying in China. Get full free CSC scholarships for MBBS and Engineering.',
    nextDeadline: 'December 15th',
    intakesText: 'March & September',
    factText: 'Chinese universities host state-of-the-art research labs and represent the frontier of AI, clean tech, and high-speed rail development.',
    degreesList: [
      { title: 'Foundation Program', duration: '1 Year', desc: 'Pre-university preparation bridging academic gaps after HSC.', icon: 'Sparkles', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
      { title: 'Diploma Program', duration: '2-3 Years', desc: 'Vocational and technical training focused on practical engineering.', icon: 'Scroll', color: 'bg-teal-50 text-teal-600 border-teal-100' },
      { title: 'Bachelor Degree', duration: '4-6 Years', desc: 'Undergraduate programs in Engineering, Medicine (MBBS), Business, etc.', icon: 'GraduationCap', color: 'bg-red-50 text-red-600 border-red-100' },
      { title: 'Masters Degree', duration: '2-3 Years', desc: 'Postgraduate specialization with intensive research opportunities.', icon: 'Award', color: 'bg-purple-50 text-purple-600 border-purple-100' },
      { title: 'PhD / Doctoral', duration: '3-4 Years', desc: 'Advanced research degrees and fellowship-backed academic excellence.', icon: 'Landmark', color: 'bg-amber-50 text-amber-600 border-amber-100' },
      { title: 'Language Program', duration: '6 Months - 2 Years', desc: 'Intensive Chinese language immersion courses.', icon: 'Languages', color: 'bg-pink-50 text-pink-600 border-pink-100' }
    ],
    popularProgramsList: [
      { name: 'Engineering & Technology', programs: ['Computer Science', 'AI & Data Science', 'Mechanical Engineering', 'Civil Engineering'], icon: 'Building2' },
      { name: 'Business & Economics', programs: ['MBA', 'Finance & Accounting', 'Marketing', 'International Trade'], icon: 'Wallet' },
      { name: 'Medicine & Health', programs: ['MBBS', 'Dentistry', 'Pharmacy', 'Nursing'], icon: 'CheckCircle2' },
      { name: 'Arts & Humanities', programs: ['Chinese Law', 'Applied Linguistics', 'History', 'International Relations'], icon: 'BookOpen' }
    ],
    citiesList: [
      { name: 'Beijing', stats: '21.5M Pop • 39 Universities', highlights: ['Capital City', 'Cultural & Historical Hub', 'Home of Tsinghua & Peking'], imageQuery: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Shanghai', stats: '24.3M Pop • 64 Universities', highlights: ['Financial Center', 'Ultra-Modern Skyline', 'Vibrant Global Student Life'], imageQuery: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?q=80&w=2069&auto=format&fit=crop' },
      { name: 'Guangzhou', stats: '15.3M Pop • 83 Universities', highlights: ['Historical Trade Port', 'Warm Climate', 'Major Business Hub'], imageQuery: 'https://images.unsplash.com/photo-1583491470868-8772074815d0?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Hangzhou', stats: '10.4M Pop • 47 Universities', highlights: ['Tech Capital (Alibaba)', 'Scenic West Lake', 'Innovation Center'], imageQuery: 'https://images.unsplash.com/photo-1568222629618-9366c8f94cb4?q=80&w=2070&auto=format&fit=crop' }
    ],
    scholarshipsList: [
      { name: 'Chinese Government Scholarship (CSC)', amount: '100% Tuition + Living Stipend + Free Dormitory', deadline: 'December 15th (Spring) / March 31st (Autumn)', icon: 'Crown' },
      { name: 'Confucius Institute Scholarship', amount: 'Full Tuition + Health Insurance + Monthly Stipend', deadline: 'April 20th', icon: 'Languages' },
      { name: 'Provincial Government Scholarship', amount: 'Partial to Full Tuition Coverage (¥10,000 - ¥30,000 / year)', deadline: 'Varies', icon: 'MapPin' },
      { name: 'University Presidential Scholarship', amount: '10% - 100% Tuition Waiver + Free Accommodation', deadline: 'Varies', icon: 'School' }
    ],
    faqs: [
      {
        question: 'Which is the best agency for China in Bangladesh?',
        answer: 'EduExpress International is widely recognized as the best agency for China in Bangladesh. We have successfully sent hundreds of Bangladeshi students to top Chinese universities with full CSC scholarships.'
      },
      {
        question: 'Can Bangladeshi students study in China without IELTS?',
        answer: 'Yes! Many top universities in China accept an English Proficiency Certificate from your previous school or college in Bangladesh instead of IELTS.'
      },
      {
        question: 'How to apply for the CSC Scholarship from Bangladesh?',
        answer: 'The CSC Scholarship requires applying through the official CSC portal and the university portal. EduExpress International provides complete, free assistance to Bangladeshi students for CSC Type A and Type B applications.'
      },
      {
        question: 'Is a Chinese MBBS degree valid in Bangladesh?',
        answer: 'Yes, MBBS degrees from BMDC (Bangladesh Medical and Dental Council) recognized Chinese universities are fully valid in Bangladesh. You just need to pass the BMDC licensing exam upon return.'
      }
    ],
    serviceStatus: 'Flagship',
    valueStatement: 'China offers world-class research universities with massive government funding, allowing Bangladeshi students to study Engineering and Medicine for a fraction of Western costs—or entirely free with a CSC Scholarship.',
    whoItFits: [
      'Students seeking top 100 QS-ranked global universities',
      'Those aiming for full-ride scholarships (tuition + hostel + stipend)',
      'Engineering, MBBS, and AI/Tech focused students',
      'Students with strong academic records but low IELTS scores'
    ],
    whoShouldReconsider: [
      'Students looking for immediate permanent residency (PR) options',
      'Those who strictly want to work part-time during studies (limited in China)',
      'Students unwilling to adapt to a new culture or language'
    ],
    educationSystemAndRecognition: 'Chinese universities are highly ranked globally, heavily funded by the government, and lead the world in engineering and tech research. MBBS programs are recognized by WHO and the Bangladesh Medical and Dental Council (BMDC).',
    workRightsAndCareer: {
      rights: 'International students can work part-time (up to 20 hrs/week) with university permission, but jobs are limited.',
      opportunities: 'High demand for STEM graduates within China and globally. Major opportunities in international trade and technology.',
      caveats: 'Securing a work visa post-graduation requires finding an employer willing to sponsor you, which can be highly competitive.'
    },
    comparisons: {
      countryA: 'UK',
      countryA_description: 'UK offers 2-year PSW and faster degrees, but China costs 70% less and offers significantly more full scholarships.',
      countryB: 'Malaysia',
      countryB_description: 'Malaysia has a similar cost profile and tropical climate, but China has higher globally ranked universities and better funding.'
    },
    reviewerInfo: {
      name: 'EduExpress Review Team',
      role: 'Senior Admissions Counselors',
      lastVerifiedDate: 'July 2026',
      primarySources: ['CSC Official Portal', 'Chinese Embassy in Dhaka', 'Ministry of Education (MOE) China']
    }
  },
  {
    name: 'South Korea',
    slug: 'south-korea',
    flag: '🇰🇷',
    description: 'Technology Hub with GKS Scholarships',
    universities: ['Seoul National University', 'KAIST', 'Korea University', 'Yonsei University', 'Sungkyunkwan University', 'Hanyang University'],
    programs: ['Computer Science', 'Engineering', 'Business', 'Media & Arts'],
    requirements: {
      language: ['IELTS 5.5+ or Duolingo 100+ required for English track', 'TOPIK Level 3+ required for Korean track'],
      documents: ['Apostilled or Consular-verified Transcripts', 'Comprehensive Study Plan', 'Bank Solvency Certificate ($20,000)'],
      visa: ['Certificate of Admission (CoA)', 'D-2 Student Visa Application']
    },
    costs: {
      tuition: '$3,000 - $6,000 / semester (scholarships may offset part or all, subject to eligibility)',
      living: '$500 - $800 / month',
      currency: 'USD'
    },
    scholarships: ['GKS (Global Korea Scholarship)', 'Professor Scholarship', 'University Merit Scholarship'],
    benefits: ['GKS Full Funding (Tuition, Flight, Monthly Stipend)', 'Part-time Work Allowed (Up to 25 hours/week)', 'World-Leader in Tech & Semiconductor Research'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in South Korea from Bangladesh | GKS Scholarship 2027',
    metaDescription: 'Apply for GKS Scholarship in South Korea. Study in top tech universities with full funding and living allowance.',
    nextDeadline: 'October 30th',
    intakesText: 'March & September',
    factText: 'South Korea has the highest R&D expenditure per capita globally, making it a dream destination for technology, AI, and engineering students.',
    degreesList: [
      { title: 'Korean Language', duration: '6M - 1 Year', desc: 'Intensive language programs to meet TOPIK requirements.', icon: 'Languages', color: 'bg-pink-50 text-pink-600 border-pink-100' },
      { title: 'Associate Degree', duration: '2 Years', desc: 'Practical, industry-focused diplomas at community colleges.', icon: 'Scroll', color: 'bg-teal-50 text-teal-600 border-teal-100' },
      { title: 'Bachelor Degree', duration: '4 Years', desc: 'Undergraduate degrees in advanced tech, K-culture, and business.', icon: 'GraduationCap', color: 'bg-blue-50 text-blue-600 border-blue-100' },
      { title: 'Masters Degree', duration: '2 Years', desc: 'Research-focused postgraduate degrees with professor-backed stipends.', icon: 'Award', color: 'bg-purple-50 text-purple-600 border-purple-100' },
      { title: 'PhD / Doctorate', duration: '3-4 Years', desc: 'Advanced academic and industrial research fellowships.', icon: 'Landmark', color: 'bg-amber-50 text-amber-600 border-amber-100' }
    ],
    popularProgramsList: [
      { name: 'Advanced Technology', programs: ['Computer Science & AI', 'Semiconductor Engineering', 'Robotics & Automation', 'Bio-engineering'], icon: 'Building2' },
      { name: 'Business & Management', programs: ['Global MBA', 'Finance & Analytics', 'Technology Management'], icon: 'Wallet' },
      { name: 'Media & Entertainment', programs: ['K-Wave & Digital Media', 'Film & Animation', 'Fashion Design'], icon: 'Sparkles' }
    ],
    citiesList: [
      { name: 'Seoul', stats: '9.7M Pop • Global Megacity', highlights: ['Capital City', 'High-Tech Innovation', 'Top Universities Location'], imageQuery: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Daejeon', stats: '1.5M Pop • Science City', highlights: ['R&D Hub', 'KAIST Campus', 'Technological Frontier'], imageQuery: 'https://images.unsplash.com/photo-1620121478247-ec786b9be2ad?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Busan', stats: '3.4M Pop • Coastal Metropolis', highlights: ['Port City Culture', 'Major Film Festival Hub', 'Beautiful Beaches'], imageQuery: 'https://images.unsplash.com/photo-1570114603079-464571d87af8?q=80&w=2070&auto=format&fit=crop' }
    ],
    scholarshipsList: [
      { name: 'Global Korea Scholarship (GKS)', amount: '100% Tuition + Monthly Stipend + Airfare + Insurance', deadline: 'October 30th (Graduate) / February 20th (Undergraduate)', icon: 'Crown' },
      { name: 'Professor-Funded Internships', amount: 'Tuition Waiver + Monthly Stipend (KRW 1M - 1.5M)', deadline: 'Varies by Lab', icon: 'Award' },
      { name: 'University Academic Excellence', amount: '30% - 100% Tuition Waiver based on GPA', deadline: 'Varies', icon: 'School' }
    ],
    serviceStatus: 'Active',
    valueStatement: 'South Korea offers exceptional technological universities with full-ride government scholarships (GKS). It is a top choice for students willing to learn Korean to unlock zero-cost engineering and AI degrees.',
    whoItFits: [
      'Students seeking world-leading tech and engineering programs',
      'Applicants with strong academics aiming for the fully-funded GKS Scholarship',
      'Those willing to dedicate 1 year to intensive Korean language learning'
    ],
    whoShouldReconsider: [
      'Students looking for 100% English-speaking daily environments',
      'Those who want guaranteed permanent residency strictly through a post-study work visa',
      'Applicants with low academic scores expecting full scholarships'
    ],
    educationSystemAndRecognition: 'South Korean universities (e.g. SNU, KAIST) rank among the top 50 globally. Degrees in tech and business are universally recognized and highly valued by global corporations.',
    workRightsAndCareer: {
      rights: 'International students can work part-time up to 25 hours per week (varies by TOPIK level).',
      opportunities: 'Massive demand for STEM graduates in semiconductor, automotive, and IT industries (Samsung, Hyundai).',
      caveats: 'Most professional jobs post-graduation require business-level Korean proficiency (TOPIK 4+).'
    },
    comparisons: {
      countryA: 'China',
      countryA_description: 'Both offer strong tech degrees and full scholarships, but South Korea has a higher living cost and a more prominent K-culture influence.',
      countryB: 'Japan',
      countryB_description: 'South Korea\'s GKS offers a slightly higher stipend and more straightforward application process compared to Japan\'s MEXT scholarship.'
    },
    reviewerInfo: {
      name: 'EduExpress Review Team',
      role: 'Senior East Asia Admissions Counselor',
      lastVerifiedDate: 'July 2026',
      primarySources: ['NIIED (Study in Korea)', 'Embassy of the Republic of Korea in Bangladesh']
    }
  },
  {
    name: 'United Kingdom',
    slug: 'uk',
    flag: '🇬🇧',
    description: 'Prestigious Degrees & Post-Study Work',
    universities: ['University of Manchester', 'UWE Bristol', 'Coventry University', 'Russell Group Universities', 'University of Birmingham', 'Cardiff University'],
    programs: ['Business', 'Law', 'Data Science', 'Public Health', 'Engineering'],
    requirements: {
      language: ['IELTS Academic 6.0 - 6.5 minimum', 'Medium of Instruction (MOI) accepted by select universities', 'PTE Academic 58+'],
      documents: ['Statement of Purpose (SOP)', 'Two Academic References (LORs)', 'Bank Solvency (28-day rule)', 'TB Screening Certificate'],
      visa: ['Confirmation of Acceptance for Studies (CAS)', 'Student Visa Application', 'Immigration Health Surcharge (IHS)']
    },
    costs: {
      tuition: '£12,000 - £18,000 / year (Partially offset by scholarships)',
      living: '£1,000 - £1,300 / month',
      currency: 'GBP'
    },
    scholarships: ['Chevening Scholarship', 'Great Scholarship', 'Vice Chancellor Excellence'],
    benefits: ['Graduate Route post-study work visa (up to 2 years)', 'Spouse Visa Integration Options', 'Accelerated 1-Year Masters Programs saving time & cost'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in UK from Bangladesh - Graduate Route Work Visa',
    metaDescription: 'Study in UK with the Graduate Route post-study work visa. Gap accepted. Top Russell Group universities.',
    nextDeadline: 'August 15th',
    intakesText: 'January & September',
    factText: 'A British Masters degree takes only one year, allowing you to save on living costs and re-enter the workforce much faster than elsewhere.',
    degreesList: [
      { title: 'International Foundation', duration: '9 Months', desc: 'Preparatory pathway for international high school graduates.', icon: 'Sparkles', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
      { title: 'Bachelor Degree (Hons)', duration: '3 Years', desc: 'Standard undergraduate degrees with immediate specialization.', icon: 'GraduationCap', color: 'bg-blue-50 text-blue-600 border-blue-100' },
      { title: 'Masters (Taught)', duration: '1 Year', desc: 'Intensive postgraduate program focused on academic and corporate skills.', icon: 'Award', color: 'bg-purple-50 text-purple-600 border-purple-100' },
      { title: 'Integrated Masters', duration: '4 Years', desc: 'Combined undergraduate and postgraduate paths (e.g., MEng).', icon: 'Scroll', color: 'bg-teal-50 text-teal-600 border-teal-100' },
      { title: 'PhD / Research', duration: '3-4 Years', desc: 'Advanced independent research degrees.', icon: 'Landmark', color: 'bg-amber-50 text-amber-600 border-amber-100' }
    ],
    popularProgramsList: [
      { name: 'Business & Management', programs: ['Executive MBA', 'Finance & Investment', 'Data Analytics', 'Digital Marketing'], icon: 'Wallet' },
      { name: 'STEM Fields', programs: ['Computer Science', 'Cyber Security', 'Data Science', 'Civil Engineering'], icon: 'Building2' },
      { name: 'Law & Social Sciences', programs: ['Corporate Law (LLM)', 'Public Health (MPH)', 'International Relations'], icon: 'BookOpen' }
    ],
    citiesList: [
      { name: 'London', stats: '9.0M Pop • World\'s #1 Student City', highlights: ['Global Financial Hub', 'Unmatched Networking', 'Imperial & UCL campuses'], imageQuery: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Manchester', stats: ' student capital of the North', highlights: ['Affordable Living', 'Vibrant Music & Art Scene', 'Leading Research Center'], imageQuery: 'https://images.unsplash.com/photo-1508711046474-2f4c2d3d30ca?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Edinburgh', stats: 'Historic Capital of Scotland', highlights: ['Majestic Castle Views', 'UNESCO World Heritage', 'High Quality of Life'], imageQuery: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2070&auto=format&fit=crop' }
    ],
    scholarshipsList: [
      { name: 'Chevening Scholarships', amount: '100% Tuition + Monthly Stipend + Airfare + Visa Costs', deadline: 'November 5th', icon: 'Crown' },
      { name: 'Commonwealth Scholarships', amount: 'Full Tuition Waiver + Living Allowance + Airfare', deadline: 'December 10th', icon: 'Globe' },
      { name: 'GREAT Scholarships', amount: 'Minimum £10,000 Tuition Waiver contribution', deadline: 'Varies', icon: 'Award' },
      { name: 'University Vice Chancellor Awards', amount: '£2,000 - £5,000 Automatic Entry Discounts', deadline: 'Automatic', icon: 'School' }
    ],
    serviceStatus: 'Active',
    valueStatement: 'The UK offers prestigious, accelerated 1-year Master\'s degrees and the Graduate Route post-study work visa, making it a strong choice for rapid career advancement and global employability.',
    whoItFits: [
      'Students looking for fast-track 1-year Master\'s degrees',
      'Professionals seeking strong Post-Study Work (PSW) rights',
      'Students targeting top-tier Russell Group universities',
      'Spouses seeking dependent visas with full work rights (for PhD/Research only)'
    ],
    whoShouldReconsider: [
      'Students needing 100% full-ride scholarships for standard undergraduate/master\'s programs',
      'Those with very low budget for living expenses (London is highly expensive)',
      'Undergraduate dependents (who can no longer bring spouses)'
    ],
    educationSystemAndRecognition: 'UK degrees are recognized universally. The system focuses on independent research, critical thinking, and accelerated learning, saving students an entire year compared to the US or Canada.',
    workRightsAndCareer: {
      rights: 'Students can work 20 hrs/week during term. Graduates get the Graduate Route visa to work without an immediate sponsor: 2 years for applications on or before 31 December 2026, 18 months from January 2027, and 3 years after a PhD. Confirm the current rule for your intake before applying.',
      opportunities: 'Strong job market in Tech, Healthcare, Finance, and Engineering, particularly outside of London in emerging hubs.',
      caveats: 'Securing a skilled worker visa after the Graduate Route requires a minimum salary threshold, which can be challenging for entry-level roles.'
    },
    comparisons: {
      countryA: 'USA',
      countryA_description: 'The US takes 2 years for a Master\'s and has a lottery-based work visa system, whereas the UK is 1 year with the Graduate Route work visa afterwards.',
      countryB: 'China',
      countryB_description: 'China offers more full-ride scholarships and cheaper living, but the UK provides superior post-study work rights and English-speaking integration.'
    },
    reviewerInfo: {
      name: 'EduExpress Review Team',
      role: 'Senior UK Admissions Counselors',
      lastVerifiedDate: 'July 2026',
      primarySources: ['UKVI Official Guidance', 'UCAS', 'British Council Bangladesh']
    }
  },
  {
    name: 'Hungary',
    slug: 'hungary',
    flag: '🇭🇺',
    description: 'Stipendium Hungaricum Full Scholarship',
    universities: ['University of Debrecen', 'University of Pecs', 'Eotvos Lorand University', 'Corvinus University of Budapest', 'Budapest University of Technology'],
    programs: ['Medicine', 'Engineering', 'Business', 'Agriculture'],
    requirements: {
      language: ['IELTS 5.5+ or Duolingo 95+ required', 'English Medium of Instruction (MOI) accepted by some faculties'],
      documents: ['Medical Certificate & HIV/Hepatitis Clearance', 'Motivation Essay', 'Transcripts & Certificates (attested)'],
      visa: ['D-Type National Student Visa', 'Confirmation of Student Hostel or Rent Proof']
    },
    costs: {
      tuition: '€3,000 - €6,000 / year (Fully Funded by Stipendium)',
      living: '€400 - €600 / month',
      currency: 'EUR'
    },
    scholarships: ['Stipendium Hungaricum (Full Free + Monthly Stipend)', 'Diaspora Scholarship'],
    benefits: ['100% Free Tuition & Accommodation', 'Free Travel across 27 Schengen Countries', 'Low Cost of Living in Central Europe'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1516901632977-d141a38d469b?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in Hungary from Bangladesh | Stipendium Hungaricum 2027',
    metaDescription: 'Apply for Stipendium Hungaricum Scholarship in Hungary. Full free tuition + Dormitory + Monthly stipend. Easy Schengen travel.',
    nextDeadline: 'January 15th',
    intakesText: 'September (Main Intake)',
    factText: 'Hungary has produced 13 Nobel laureates and has a rich tradition in scientific and medical research, making its degrees highly prestigious.',
    degreesList: [
      { title: 'Bachelor Degree', duration: '3-4 Years', desc: 'Undergraduate programs in Engineering, Humanities, and Business.', icon: 'GraduationCap', color: 'bg-blue-50 text-blue-600 border-blue-100' },
      { title: 'One-Tier Masters', duration: '5-6 Years', desc: 'Integrated programs combining Bachelor & Masters (e.g., Medicine, Dentistry).', icon: 'Scroll', color: 'bg-teal-50 text-teal-600 border-teal-100' },
      { title: 'Masters Degree', duration: '1-2 Years', desc: 'Postgraduate specialization, often fully funded.', icon: 'Award', color: 'bg-purple-50 text-purple-600 border-purple-100' },
      { title: 'PhD / Doctoral', duration: '4 Years', desc: 'Advanced research programs with high government funding.', icon: 'Landmark', color: 'bg-amber-50 text-amber-600 border-amber-100' }
    ],
    popularProgramsList: [
      { name: 'Medicine & Pharmacy', programs: ['General Medicine (MD)', 'Dentistry (DMD)', 'Pharmacy', 'Nursing'], icon: 'CheckCircle2' },
      { name: 'Engineering', programs: ['Computer Science', 'Civil Engineering', 'Mechanical Engineering', 'Mechatronics'], icon: 'Building2' },
      { name: 'Business & Agriculture', programs: ['International Business', 'Agricultural Economics', 'Biotechnology'], icon: 'Wallet' }
    ],
    citiesList: [
      { name: 'Budapest', stats: '1.7M Pop • Capital City', highlights: ['Beautiful Danube Views', 'Vibrant Student Community', 'Historic Thermal Baths'], imageQuery: 'https://images.unsplash.com/photo-1565426873118-a1dfa295552b?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Debrecen', stats: '200k Pop • Calm & Safe', highlights: ['Major Educational Center', 'Surrounded by Forests', 'Affordable Accommodation'], imageQuery: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Pécs', stats: '145k Pop • Safe University Town', highlights: ['Mediterranean Vibe', 'Oldest University in Hungary', 'UNESCO Heritage Sites'], imageQuery: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop' }
    ],
    scholarshipsList: [
      { name: 'Stipendium Hungaricum', amount: '100% Tuition Waiver + Free Dormitory + HUF 43,700 Monthly Stipend + Health Insurance', deadline: 'January 15th', icon: 'Crown' },
      { name: 'Erasmus+ Mobility Grants', amount: '€400 - €600 / month for exchange semesters', deadline: 'Varies by Faculty', icon: 'Globe' },
      { name: 'Hungarian Diaspora Scholarship', amount: 'Full Tuition + Monthly Stipend for members of Hungarian heritage communities', deadline: 'January 31st', icon: 'Award' }
    ],
    serviceStatus: 'Active',
    valueStatement: 'Hungary provides a European gateway with the prestigious Stipendium Hungaricum scholarship, offering fully-funded degrees with a monthly stipend in a safe, affordable, and historic environment.',
    whoItFits: [
      'High-achieving students targeting the Stipendium Hungaricum full scholarship',
      'Medical and Engineering students seeking affordable European degrees',
      'Students looking for Schengen mobility during their studies'
    ],
    whoShouldReconsider: [
      'Students who expect high-paying part-time jobs during their studies (wages are low)',
      'Applicants looking for immediate, guaranteed post-study work visas (options exist, but require securing a job fast)'
    ],
    educationSystemAndRecognition: 'Hungarian universities are deeply integrated into the European Higher Education Area (Bologna Process). Medical degrees are globally recognized, including by the BMDC in Bangladesh.',
    workRightsAndCareer: {
      rights: 'Students can work part-time up to 24 hours per week during term time.',
      opportunities: 'Growing tech and shared-services hubs in Budapest offer English-speaking corporate roles.',
      caveats: 'Local wages are lower than Western Europe. A "Study-to-Work" permit gives 9 months to find a job after graduation.'
    },
    comparisons: {
      countryA: 'Finland',
      countryA_description: 'Finland offers a clearer PR pathway and higher wages, but Hungary is significantly cheaper and offers the 100% funded Stipendium Hungaricum.',
      countryB: 'UK',
      countryB_description: 'Hungary provides affordable Schengen access and free tuition options, whereas the UK charges high tuition but offers the Graduate Route post-study work visa.'
    },
    reviewerInfo: {
      name: 'EduExpress Review Team',
      role: 'Europe Admissions Counselor',
      lastVerifiedDate: 'July 2026',
      primarySources: ['Tempus Public Foundation', 'Study in Hungary Official Portal']
    }
  },
  {
    name: 'Finland',
    slug: 'finland',
    flag: '🇫🇮',
    description: 'Happiest Country & High Tech Education',
    universities: ['Aalto University', 'LUT University', 'Tampere University', 'University of Helsinki', 'University of Oulu', 'Metropolia UAS'],
    programs: ['IT', 'Business', 'Game Design', 'Sustainable Engineering'],
    requirements: {
      language: ['IELTS Academic 6.0+ required', 'PTE Academic 55+', 'Duolingo 105+ accepted by select Universities of Applied Sciences'],
      documents: ['SAT Test scores (frequently required for Bachelors)', 'Motivation Video Statement', 'Transcripts and graduation certificates'],
      visa: ['Type A Residence Permit (Electronic application)', 'Proof of funds (€6,720 per academic year minimum)']
    },
    costs: {
      tuition: '€6,000 - €12,000 / year (Scholarships reduce this by 50-100%)',
      living: '€600 - €800 / month',
      currency: 'EUR'
    },
    scholarships: ['Finland Scholarship (100% + €5000)', 'Early Bird Discount (50%)'],
    benefits: ['Exceptional PR & Permanent Residency Pathways', 'Spouse Can Work Full-time (No hours restriction)', 'Voted the Happiest Country in the World 7 years in a row'],
    isActive: false,
    featured: false,
    images: ['https://images.unsplash.com/photo-1517935706615-2717063c2225?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in Finland - PR Pathways & Huge Scholarships',
    metaDescription: 'Study in Finland with huge scholarships. Easy PR pathway after graduation. Bring your spouse and family.',
    nextDeadline: 'January 20th',
    intakesText: 'September (Joint Application)',
    factText: 'Finland has a unique education system where lecturers are highly accessible, and students are encouraged to work on practical, real-world startups.',
    degreesList: [
      { title: 'Bachelor Degree', duration: '3.5 - 4 Years', desc: 'Offered by Universities of Applied Sciences (UAS) and Research Universities.', icon: 'GraduationCap', color: 'bg-blue-50 text-blue-600 border-blue-100' },
      { title: 'Masters Degree', duration: '2 Years', desc: 'Advanced professional and research degrees.', icon: 'Award', color: 'bg-purple-50 text-purple-600 border-purple-100' },
      { title: 'PhD / Doctoral', duration: '4 Years', desc: 'Free tuition for doctoral studies with research salaries.', icon: 'Landmark', color: 'bg-amber-50 text-amber-600 border-amber-100' }
    ],
    popularProgramsList: [
      { name: 'Technology & Gaming', programs: ['Information Technology', 'Software Engineering', 'Game Design & Development', 'Artificial Intelligence'], icon: 'Building2' },
      { name: 'Business & Management', programs: ['International Business', 'Digital Marketing', 'Global Innovation Management'], icon: 'Wallet' },
      { name: 'Sustainability', programs: ['Circular Economy', 'Renewable Energy', 'Environmental Engineering'], icon: 'Sparkles' }
    ],
    citiesList: [
      { name: 'Helsinki', stats: '650k Pop • Innovation Hub', highlights: ['Capital City', 'Startup Capital (Slush)', 'Excellent Public Transit'], imageQuery: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Tampere', stats: '240k Pop • Largest Inland City', highlights: ['Vibrant Student City', 'Tech Hub', 'Beautiful Lakes surrounding'], imageQuery: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Oulu', stats: '200k Pop • Northern Tech Hub', highlights: ['High Tech Center (Nokia)', 'Safe & Bike-Friendly', 'Northern Lights views'], imageQuery: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=2070&auto=format&fit=crop' }
    ],
    scholarshipsList: [
      { name: 'Finland Scholarships', amount: '100% Tuition Waiver + €5,000 relocation grant for Master programs', deadline: 'January 22nd', icon: 'Crown' },
      { name: 'University Tuition Waivers', amount: '50% - 100% Tuition fee discounts based on academic performance or SAT', deadline: 'Varies', icon: 'Award' },
      { name: 'Early Bird Discounts', amount: 'Automatic 10% - 50% discount on paying tuition fee within 2 weeks of offer', deadline: 'Offer Dependent', icon: 'School' }
    ],
    serviceStatus: 'Active',
    valueStatement: 'Finland is a global leader in education and tech. It offers strong 50-100% scholarships, an excellent quality of life, and one of the clearest pathways to European Permanent Residency.',
    whoItFits: [
      'Students looking for high-tech, sustainability, and game design programs',
      'Married students (spouses get full work rights)',
      'Those seeking a clear, stable pathway to Permanent Residency (PR)'
    ],
    whoShouldReconsider: [
      'Students with a very low budget (proof of €6,720/year is strictly required)',
      'Those unable to adapt to extreme winter climates and darker months'
    ],
    educationSystemAndRecognition: 'Finland\'s education system is world-renowned. It divides into Research Universities (theoretical/academic) and Universities of Applied Sciences (UAS - practical/industry-focused).',
    workRightsAndCareer: {
      rights: 'Students can work up to 30 hours per week. Spouses can work full-time.',
      opportunities: 'High demand for IT, engineering, and healthcare professionals. Strong startup ecosystem (Slush).',
      caveats: 'While tech jobs operate in English, learning Finnish is crucial for long-term integration and broader job prospects.'
    },
    comparisons: {
      countryA: 'UK',
      countryA_description: 'Finland provides a more stable long-term PR pathway and allows dependent spouses full work rights, unlike current UK rules for taught masters.',
      countryB: 'Hungary',
      countryB_description: 'Finland is more expensive but offers vastly superior post-graduation salaries and residency pathways.'
    },
    reviewerInfo: {
      name: 'EduExpress Review Team',
      role: 'Nordic Admissions Specialist',
      lastVerifiedDate: 'July 2026',
      primarySources: ['Migri (Finnish Immigration Service)', 'Study in Finland']
    }
  },
  {
    name: 'Cyprus',
    slug: 'cyprus',
    flag: '🇨🇾',
    description: 'Affordable Education & Straightforward Admissions',
    universities: ['European University of Lefke', 'Near East University', 'Eastern Mediterranean University', 'University of Nicosia', 'Frederick University'],
    programs: ['Hotel Management', 'Business', 'Pharmacy', 'Engineering'],
    requirements: {
      language: ['No IELTS required (Institutional English assessment upon arrival)', 'Basic English communication is sufficient'],
      documents: ['High School Transcript & Certificate', 'Passport Copy', 'Minimal bank statement'],
      visa: ['On-Arrival Student Pass (Northern Cyprus)', 'Schengen-adjacent Student Visa (Southern Cyprus)']
    },
    costs: {
      tuition: '€2,500 - €4,500 / year (partial waivers available for eligible students)',
      living: '€300 - €400 / month',
      currency: 'EUR'
    },
    scholarships: ['50% Scholarship for All International Students', 'Academic Merit Scholarship'],
    benefits: ['100% Guaranteed Admission with No IELTS', 'Paid Hospitality Internships at luxury Mediterranean hotels', 'Credit Transfer options to UK, USA & Europe'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in Cyprus from Bangladesh - No IELTS Required',
    metaDescription: 'Study in Cyprus with 50% scholarship. No IELTS required. High visa success rate and paid internships in luxury hotels.',
    nextDeadline: 'August 30th',
    intakesText: 'February & October',
    factText: 'Cyprus is a major tourism and hospitality destination in Europe. Students of Hospitality & Culinary arts enjoy paid internships in local resorts.',
    degreesList: [
      { title: 'Diploma Program', duration: '2 Years', desc: 'Vocational study in Culinary, Hospitality, or General Business.', icon: 'Scroll', color: 'bg-teal-50 text-teal-600 border-teal-100' },
      { title: 'Bachelor Degree', duration: '4 Years', desc: 'Undergraduate degrees in Pharmacy, Engineering, Business, etc.', icon: 'GraduationCap', color: 'bg-blue-50 text-blue-600 border-blue-100' },
      { title: 'Masters Degree', duration: '1-2 Years', desc: 'Fast-track postgraduate specialization with flexible timings.', icon: 'Award', color: 'bg-purple-50 text-purple-600 border-purple-100' },
      { title: 'PhD / Doctoral', duration: '3-4 Years', desc: 'Postgraduate research options with teaching assistantships.', icon: 'Landmark', color: 'bg-amber-50 text-amber-600 border-amber-100' }
    ],
    popularProgramsList: [
      { name: 'Hospitality & Management', programs: ['Hotel Management', 'Culinary Arts', 'Business Administration', 'Marketing'], icon: 'Wallet' },
      { name: 'Medicine & Sciences', programs: ['Pharmacy (B.Pharm)', 'Nursing', 'Medical Lab Sciences'], icon: 'CheckCircle2' },
      { name: 'Engineering & Computing', programs: ['Computer Engineering', 'Civil Engineering', 'Management Information Systems'], icon: 'Building2' }
    ],
    citiesList: [
      { name: 'Nicosia', stats: '310k Pop • Dynamic Capital', highlights: ['Divided Culture & History', 'Corporate Headquarters', 'Major University Campuses'], imageQuery: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Limassol', stats: '180k Pop • Port & Beach Resort', highlights: ['Maritime Hub', 'Luxury Hotel Internships', 'Beaches & Tourism'], imageQuery: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop' }
    ],
    scholarshipsList: [
      { name: '50% International Tuition Waiver', amount: 'Automatic 50% discount on standard tuition fees for all Asian students', deadline: 'Automatic', icon: 'Crown' },
      { name: 'Academic Merit Scholarship', amount: 'Up to 75% - 100% Tuition fee reduction based on Semester GPA', deadline: 'Varies', icon: 'Award' },
      { name: 'Sports Scholarship', amount: '20% - 50% reduction for students representing university athletic teams', deadline: 'Varies', icon: 'School' }
    ],
    serviceStatus: 'Active',
    valueStatement: 'Cyprus provides affordable European higher education, specialized hospitality management, and clear pathways with 50% tuition waivers for international applicants. Jurisdiction (Republic vs Northern) is verified before application.',
    whoItFits: [
      'Students looking for affordable European degree programs without strict entrance exams',
      'Hospitality and Tourism majors seeking paid internships in Mediterranean resorts',
      'Students planning credit transfer routes into Western European or UK institutions'
    ],
    whoShouldReconsider: [
      'Students assuming Northern Cyprus degrees automatically grant EU Schengen travel rights (jurisdiction rules apply)',
      'Applicants expecting full post-study residency guarantees without job sponsorship'
    ],
    educationSystemAndRecognition: 'Higher education is accredited by CYQAA (Republic of Cyprus) or YÖDAK (Northern Cyprus). Verified based on official university recognition and degree equivalency.',
    workRightsAndCareer: {
      rights: 'In the Republic of Cyprus, international students can work part-time (20 hours/week) in designated sectors after 6 months. In Northern Cyprus, campus-based work is common.',
      opportunities: 'Paid seasonal internships are available in hospitality, culinary arts, and tourism during summer breaks.',
      caveats: 'Verify embassy jurisdiction and visa requirements in writing before depositing any application fees.'
    },
    comparisons: {
      countryA: 'Malaysia',
      countryA_description: 'Cyprus offers European regional proximity and Mediterranean hospitality internships, while Malaysia offers direct UK branch campus degrees.',
      countryB: 'Hungary',
      countryB_description: 'Hungary offers full Schengen travel rights and Stipendium scholarships, whereas Cyprus provides easier direct admissions and paid resort internships.'
    },
    reviewerInfo: {
      name: 'EduExpress Review Team',
      role: 'European Admissions Compliance',
      lastVerifiedDate: 'July 2026',
      primarySources: ['Ministry of Education, Sport and Youth (Cyprus)', 'CYQAA / YÖDAK Accreditation Portals']
    }
  },
  {
    name: 'Croatia',
    slug: 'croatia',
    flag: '🇭🇷',
    description: 'Schengen Country & Tourism Hub',
    universities: ['University of Zagreb', 'Algebra University College', 'RIT Croatia', 'University of Split', 'University of Rijeka'],
    programs: ['Tourism', 'Digital Marketing', 'Computer Science'],
    requirements: {
      language: ['IELTS 6.0 overall preferred', 'English Proficiency Interview conducted by some universities'],
      documents: ['Apostilled & Notarized Transcripts', 'Police Clearance Certificate (with EU translation)', 'Sufficient Health Insurance coverage'],
      visa: ['Temporary Residence Permit (Schengen Visa)', 'Proof of financial solvency (€5,000+ in bank)']
    },
    costs: {
      tuition: '€3,000 - €5,500 / year (Very affordable for a Schengen State)',
      living: '€500 - €700 / month',
      currency: 'EUR'
    },
    scholarships: ['Ministry of Science Scholarship', 'Erasmus+'],
    benefits: ['Program and institution comparison', 'Destination specific visa readiness review', 'Education fit and total cost planning'],
    isActive: false,
    featured: false,
    images: ['https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in Croatia - Schengen Visa & Placements',
    metaDescription: 'Compare Croatia education options, recognition, total costs and visa readiness for Bangladeshi students.',
    nextDeadline: 'July 15th',
    intakesText: 'October (Winter Intake)',
    factText: 'Croatia is one of the safest countries in the EU. Its capital, Zagreb, has won awards for the best student lifestyle and Christmas markets.',
    degreesList: [
      { title: 'Bachelor Degree', duration: '3 Years', desc: 'Standard European undergraduate programs fully taught in English.', icon: 'GraduationCap', color: 'bg-blue-50 text-blue-600 border-blue-100' },
      { title: 'Masters Degree', duration: '2 Years', desc: 'Advanced postgraduate degrees with Erasmus exchange semesters.', icon: 'Award', color: 'bg-purple-50 text-purple-600 border-purple-100' },
      { title: 'PhD / Doctoral', duration: '3 Years', desc: 'Advanced doctoral research and project collaborations.', icon: 'Landmark', color: 'bg-amber-50 text-amber-600 border-amber-100' }
    ],
    popularProgramsList: [
      { name: 'Hospitality & Tourism', programs: ['International Tourism Management', 'Hotel Administration', 'Leisure & Events'], icon: 'Sparkles' },
      { name: 'IT & Engineering', programs: ['Software Engineering', 'System Engineering', 'Digital Technologies', 'AI'], icon: 'Building2' },
      { name: 'Business', programs: ['Digital Marketing', 'Global MBA', 'E-Commerce'], icon: 'Wallet' }
    ],
    citiesList: [
      { name: 'Zagreb', stats: '800k Pop • Cultural Capital', highlights: ['Thriving Student Population', 'Schengen Central Location', 'High Tech Job Market'], imageQuery: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Split', stats: '180k Pop • Coastal History', highlights: ['Dubrovnik proximity', 'Historic Roman Palace', 'Beaches & Nightlife'], imageQuery: 'https://images.unsplash.com/photo-1572297794908-32219fdfd70a?q=80&w=2070&auto=format&fit=crop' }
    ],
    scholarshipsList: [
      { name: 'Croatian Government Scholarship', amount: 'Full Tuition Waiver + HUF 1500+ Stipend support (Varies by bilateral agreements)', deadline: 'May 31st', icon: 'Crown' },
      { name: 'Erasmus+ Exchange Grants', amount: '€400 - €700 / month during exchange semesters in Western Europe', deadline: 'Biannual', icon: 'Globe' }
    ],
    serviceStatus: 'Active',
    valueStatement: 'Croatia offers high-quality Schengen European education in IT, Engineering, and Hospitality with affordable tuition (€3,000–€5,500/year) and full EU Schengen travel rights.',
    whoItFits: [
      'Students looking for affordable English-taught degree options in a European Schengen country',
      'Technology, Engineering, and Digital Business majors seeking EU study-exchange opportunities (Erasmus+)',
      'Students preferring safe Mediterranean living with reasonable living costs (€500–€700/mo)'
    ],
    whoShouldReconsider: [
      'Students assuming part-time work alone can cover all first-year tuition and living expenses',
      'Applicants who cannot provide notarized, apostilled academic documents and police clearance'
    ],
    educationSystemAndRecognition: 'Higher education is accredited by the Agency for Science and Higher Education (ASHE) in Croatia. Degrees are recognized across the EU and ECTS system.',
    workRightsAndCareer: {
      rights: 'International students with a Croatian temporary residence permit can work up to 20 hours/week via the Student Centre (Student Servis).',
      opportunities: 'Growing career opportunities in IT development, digital marketing, tourism, and European tech startups in Zagreb.',
      caveats: 'No "Schengen visa selling" language — visa issuance depends on official embassy financial and document verification.'
    },
    comparisons: {
      countryA: 'Hungary',
      countryA_description: 'Croatia and Hungary both offer affordable Schengen education, but Hungary offers the Stipendium Hungaricum full scholarship scheme.',
      countryB: 'Finland',
      countryB_description: 'Croatia offers significantly lower living expenses and tuition fees than Nordic nations, while Finland offers higher tech research funding.'
    },
    reviewerInfo: {
      name: 'EduExpress Review Team',
      role: 'European Admissions Compliance',
      lastVerifiedDate: 'July 2026',
      primarySources: ['Ministry of Science and Education (Croatia)', 'ASHE Accreditation Agency']
    }
  },
  {
    name: 'Georgia',
    slug: 'georgia',
    flag: '🇬🇪',
    description: 'Popular for MBBS (No Entrance Exam)',
    universities: ['University of Georgia (UG)', 'Tbilisi State Medical University', 'Caucasus International University', 'East European University'],
    programs: ['MBBS (Medicine)', 'Dentistry', 'Business'],
    requirements: {
      language: ['No IELTS required', 'Basic English Proficiency checked via a video interview'],
      documents: ['Passport Copy', '12th Grade Transcript with Biology & Chemistry credits', 'Police clearance'],
      visa: ['Student Visa (Ministry of Foreign Affairs)', 'Local Residence Permit upon arrival']
    },
    costs: {
      tuition: '$4,500 - $6,500 / year (MBBS)',
      living: '$300 - $500 / month',
      currency: 'USD'
    },
    scholarships: ['Merit based tuition discounts'],
    benefits: ['Direct MBBS Admission with No Entrance Exam', 'WHO-listed / ECFMG-recognized universities (local licensing exams required to practise abroad)', 'Low tuition fees and very affordable living costs'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1565008576549-57569a49371d?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'MBBS in Georgia for Bangladeshi Students 2027',
    metaDescription: 'Compare medical and other education options in Georgia with recognition, licensing, cost and visa readiness checks.',
    nextDeadline: 'August 15th',
    intakesText: 'March & September',
    factText: 'Georgia is located at the intersection of Eastern Europe and Western Asia. Its medical universities follow European curriculum standards.',
    degreesList: [
      { title: 'MD / MBBS', duration: '6 Years', desc: 'Integrated General Medicine degree following European standards.', icon: 'CheckCircle2', color: 'bg-red-50 text-red-600 border-red-100' },
      { title: 'Dentistry', duration: '5 Years', desc: 'Practical training in modern dental labs.', icon: 'Scroll', color: 'bg-teal-50 text-teal-600 border-teal-100' },
      { title: 'Bachelor Degree', duration: '4 Years', desc: 'Undergraduate programs in Business Administration and IT.', icon: 'GraduationCap', color: 'bg-blue-50 text-blue-600 border-blue-100' },
      { title: 'Masters Degree', duration: '2 Years', desc: 'Postgraduate studies with focus on Global Health or Business.', icon: 'Award', color: 'bg-purple-50 text-purple-600 border-purple-100' }
    ],
    popularProgramsList: [
      { name: 'Medical & Dental', programs: ['General Medicine (MD/MBBS)', 'Dentistry (BDS)', 'Public Health'], icon: 'CheckCircle2' },
      { name: 'Business & Law', programs: ['International Business', 'BBA', 'Management'], icon: 'Wallet' }
    ],
    citiesList: [
      { name: 'Tbilisi', stats: '1.2M Pop • Capital & Medical Hub', highlights: ['Beautiful Old Town', 'Affordable Public Transit', 'Concentration of Top Medical Univ.'], imageQuery: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Kutaisi', stats: '140k Pop • Low-Cost Historic City', highlights: ['Airport Hub', 'Ancient Monuments', 'Extremely Low Living Costs'], imageQuery: 'https://images.unsplash.com/photo-1627885061614-2c70a8d6e326?q=80&w=2070&auto=format&fit=crop' }
    ],
    scholarshipsList: [
      { name: 'University Merit Discount', amount: '10% - 25% Tuition waiver for students scoring 90%+ in semester GPA', deadline: 'Biannual', icon: 'Award' }
    ],
    serviceStatus: 'Active',
    valueStatement: 'Georgia is a premier destination for affordable, English-medium Medical (MD/MBBS) and Dental education following European curriculum guidelines, with WHO and ECFMG recognition.',
    whoItFits: [
      'Students aspiring to study MBBS/MD in English at an affordable tuition fee ($4,500 - $6,500/year)',
      'Applicants seeking medical qualifications compliant with USMLE (ECFMG), PLAB (UK), and BMDC standards',
      'Students preferring a safe, Eastern European study environment with low living costs'
    ],
    whoShouldReconsider: [
      'Students assuming local licensing guarantees abroad without passing home-country medical council exams',
      'Applicants requiring full-ride medical scholarships (tuition discounts exist, but full-rides are rare)'
    ],
    educationSystemAndRecognition: 'Regulated by the National Center for Educational Quality Enhancement (NCEQE) of Georgia. Medical programs follow 6-year integrated ECTS curricula recognized by WHO, WFME, and ECFMG.',
    workRightsAndCareer: {
      rights: 'Students hold temporary residence permits. Medical students focus heavily on clinical rotations rather than part-time non-medical work.',
      opportunities: 'Graduates are eligible to sit for USMLE (USA), PLAB (UK), AMC (Australia), or BMDC (Bangladesh) qualifying examinations.',
      caveats: 'Medical licensing in Bangladesh requires passing the BMDC equivalence examination upon return.'
    },
    comparisons: {
      countryA: 'China',
      countryA_description: 'Georgia offers 6-year European-standard medical degrees in English, while China offers CSC scholarship options and extensive hospital infrastructure.',
      countryB: 'UK',
      countryB_description: 'Georgia MBBS costs 80% less than UK medical schools while allowing graduates to sit for the UK PLAB exam.'
    },
    reviewerInfo: {
      name: 'EduExpress Review Team',
      role: 'Medical Admissions & Compliance Lead',
      lastVerifiedDate: 'July 2026',
      primarySources: ['NCEQE Georgia', 'World Directory of Medical Schools (WDOMS)']
    }
  },
  {
    name: 'Malaysia',
    slug: 'malaysia',
    flag: '🇲🇾',
    description: 'World-Class Education & Affordable Living',
    universities: ['Universiti Malaya', 'Universiti Teknologi Malaysia (UTM)', 'Monash University Malaysia', 'University of Nottingham Malaysia', 'Asia Pacific University (APU)', 'Taylor\'s University'],
    programs: ['Business', 'Engineering', 'IT', 'Hospitality'],
    requirements: {
      language: ['IELTS 5.0 - 6.0 required', 'Medium of Instruction (MOI) accepted for students from English-medium schools'],
      documents: ['EMGS Passport sized photos', 'Academic transcripts', 'Health Declaration Form'],
      visa: ['EMGS Visa Approval Letter (VAL)', 'Single Entry Visa (SEV) at Malaysian High Commission']
    },
    costs: {
      tuition: '$3,500 - $7,000 / year (Very affordable for world-class campuses)',
      living: '$300 - $450 / month',
      currency: 'USD'
    },
    scholarships: ['University Merit Scholarship', 'MIS Scholarship'],
    benefits: ['Affordable tuition fees with direct foreign degree matching', 'Easy Credit Transfer options to Australia, UK, and USA', 'Modern, multicultural environment in Southeast Asia'],
    isActive: true,
    featured: true,
    images: ['https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=75&w=1200&auto=format&fit=crop'],
    metaTitle: 'Study in Malaysia from Bangladesh - Affordable Quality Education',
    metaDescription: 'Compare Malaysian universities, program quality, costs and student pass readiness for Bangladeshi students.',
    nextDeadline: 'June 30th',
    intakesText: 'February & September (Multiple intakes year-round)',
    factText: 'Many top universities in the UK and Australia (like Monash, Nottingham, Heriot-Watt) have campuses in Malaysia offering the exact same degree at 1/3 of the cost.',
    degreesList: [
      { title: 'Foundation Program', duration: '1 Year', desc: 'Pre-university preparation programs for O-level / High School graduates.', icon: 'Sparkles', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
      { title: 'Diploma Program', duration: '2 - 2.5 Years', desc: 'Practical vocational courses with industry internships.', icon: 'Scroll', color: 'bg-teal-50 text-teal-600 border-teal-100' },
      { title: 'Bachelor Degree', duration: '3 - 4 Years', desc: 'Undergraduate degrees, including dual awards with UK/US partners.', icon: 'GraduationCap', color: 'bg-blue-50 text-blue-600 border-blue-100' },
      { title: 'Masters Degree', duration: '1 - 2 Years', desc: 'Postgraduate coursework and research degrees.', icon: 'Award', color: 'bg-purple-50 text-purple-600 border-purple-100' },
      { title: 'PhD / Doctoral', duration: '3 - 4 Years', desc: 'Advanced doctoral research and project fellowships.', icon: 'Landmark', color: 'bg-amber-50 text-amber-600 border-amber-100' }
    ],
    popularProgramsList: [
      { name: 'Computing & IT', programs: ['Computer Science', 'Cyber Security', 'Software Engineering', 'Fintech'], icon: 'Building2' },
      { name: 'Business & Finance', programs: ['International Business', 'BBA', 'Finance & Investment', 'MBA'], icon: 'Wallet' },
      { name: 'Engineering', programs: ['Chemical Engineering', 'Mechanical Engineering', 'Electronics & Telecom'], icon: 'CheckCircle2' }
    ],
    citiesList: [
      { name: 'Kuala Lumpur', stats: '1.8M Pop • Cosmopolitan Capital', highlights: ['Petronas Twin Towers views', 'Cheap Public Transit', 'Massive Shopping & Dining options'], imageQuery: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Penang', stats: '700k Pop • Food & Tech Hub', highlights: ['Street Food Capital', 'Silicon Valley of the East', 'Historic George Town'], imageQuery: 'https://images.unsplash.com/photo-1616832880699-8541b04005ec?q=80&w=2070&auto=format&fit=crop' }
    ],
    scholarshipsList: [
      { name: 'Malaysia International Scholarship (MIS)', amount: '100% Tuition Waiver + Monthly Living Allowance + Book allowance', deadline: 'June 15th', icon: 'Crown' },
      { name: 'University Presidential Merit Awards', amount: '20% - 50% Tuition fee discounts based on academic average', deadline: 'Intake Dependent', icon: 'Award' }
    ],
    serviceStatus: 'Researching',
    valueStatement: 'We are actively researching and establishing partnerships in this destination to ensure it meets our Better Education Standard.',
    whoItFits: [
      'Students looking for affordable European/Asian education options',
      'Those interested in exploring emerging international study destinations'
    ],
    whoShouldReconsider: [
      'Students who require an already established, fully verified EduExpress route'
    ],
    educationSystemAndRecognition: 'Education quality, recognition, and accreditation are currently under review by our team.',
    workRightsAndCareer: {
      rights: 'Work rights during and after study are being verified with official immigration sources.',
      opportunities: 'Career pathways are being assessed.',
      caveats: 'Always verify post-study work rules directly with the respective embassy.'
    },
    comparisons: {
      countryA: 'China',
      countryA_description: 'Compare this destination with China for cost and scholarship opportunities.',
      countryB: 'UK',
      countryB_description: 'Compare this destination with the UK for post-study work and degree duration.'
    },
    reviewerInfo: {
      name: 'EduExpress Review Team',
      role: 'Research & Compliance',
      lastVerifiedDate: 'July 2026',
      primarySources: ['Official Ministry of Education', 'National Immigration Authority']
    }
  },
  {
    name: 'Malta',
    slug: 'malta',
    flag: '🇲🇹',
    description: 'Active education service with institution, recognition, cost and visa readiness checks',
    universities: [],
    programs: ['Business', 'Information Technology', 'Hospitality', 'Health Sciences'],
    requirements: {
      language: ['Program specific English language evidence is checked before application'],
      documents: ['Academic records', 'Passport', 'Program specific supporting documents'],
      visa: ['Current student visa documents and financial evidence are checked from official guidance']
    },
    costs: {
      tuition: 'Confirmed for the selected institution and intake',
      living: 'Prepared in a dated ClearCost Sheet',
      currency: 'EUR'
    },
    scholarships: [],
    benefits: ['English taught program exploration', 'Active university and study group routes', 'Written education fit and cost review'],
    isActive: true,
    featured: true,
    images: ['/images/partnership.jpg'],
    metaTitle: 'Study in Malta from Bangladesh',
    metaDescription: 'Explore Malta education options with institution checks, clear costs and visa readiness for Bangladeshi students.',
    intakesText: 'Confirmed for the selected institution',
    factText: 'EduExpress has provided active Malta education guidance since 2025.',
    serviceStatus: 'Active',
    valueStatement: 'Malta offers official English-medium European education within the Schengen zone, featuring reputable public and private higher education institutions, IT, and business qualifications.',
    whoItFits: [
      'Students looking for English-speaking Schengen European study destinations',
      'Those interested in Business, IT, Hospitality, and Maritime Studies in a Mediterranean tech hub',
      'Students seeking European qualification recognition under the Malta Further & Higher Education Authority'
    ],
    whoShouldReconsider: [
      'Students expecting to cover all tuition and living expenses through part-time work alone',
      'Applicants who cannot meet official Schengen financial proof requirements (€700-€1000/mo)'
    ],
    educationSystemAndRecognition: 'Regulated by the Malta Further & Higher Education Authority (MFHEA). Qualifications follow the European Qualifications Framework (EQF).',
    workRightsAndCareer: {
      rights: 'International students can work part-time (20 hours/week) after 90 days of study with an approved employment license (Jobsplus).',
      opportunities: 'Growing career opportunities in iGaming, Financial Technology, Tourism, and Digital Business.',
      caveats: 'Part-time work licenses require Jobsplus approval and cannot replace primary financial proof.'
    },
    comparisons: {
      countryA: 'Finland',
      countryA_description: 'Malta is an English-speaking Schengen nation with warmer climate, while Finland offers tuition waiver scholarships and high-tech research UAS.',
      countryB: 'UK',
      countryB_description: 'Malta uses EUR currency and grants Schengen access, while the UK offers a 2-year Graduate post-study work visa.'
    },
    reviewerInfo: {
      name: 'EduExpress Review Team',
      role: 'European Admissions Specialist',
      lastVerifiedDate: 'July 2026',
      primarySources: ['MFHEA Malta', 'Central Visa Unit Malta']
    }
  },
  {
    name: 'Greece',
    slug: 'greece',
    flag: '🇬🇷',
    description: 'Active university collaboration with education fit and application guidance',
    universities: [],
    programs: ['Business', 'Tourism and Hospitality', 'Technology', 'International Programs'],
    requirements: {
      language: ['Teaching language and program requirements are confirmed before application'],
      documents: ['Academic records', 'Passport', 'Program specific supporting documents'],
      visa: ['Current student visa documents and financial evidence are checked from official guidance']
    },
    costs: {
      tuition: 'Confirmed for the selected institution and intake',
      living: 'Prepared in a dated ClearCost Sheet',
      currency: 'EUR'
    },
    scholarships: [],
    benefits: ['University collaboration active', 'English taught program exploration', 'Recognition and total cost review'],
    isActive: true,
    featured: true,
    images: ['/images/partnership.jpg'],
    metaTitle: 'Study in Greece from Bangladesh',
    metaDescription: 'Explore Greece education options with program fit, university access, clear costs and visa readiness.',
    intakesText: 'Confirmed for the selected institution',
    factText: 'University collaboration and destination marketing are active.',
    serviceStatus: 'Active',
    valueStatement: 'Greece offers historical academic prestige combined with modern, accredited English-taught undergraduate and postgraduate programs in Business, Tourism, Maritime, and Technology.',
    whoItFits: [
      'Students seeking European Union education in Tourism, Hospitality, Business Administration, and Shipping/Logistics',
      'Applicants wanting affordable Mediterranean study with Schengen residency rights',
      'Students looking for joint university degree collaborations and Erasmus+ mobility options'
    ],
    whoShouldReconsider: [
      'Students requiring full-ride scholarships (Greek universities offer merit discounts, but full waivers are limited)',
      'Applicants who cannot meet Greek student visa financial proof requirements at the embassy'
    ],
    educationSystemAndRecognition: 'Regulated by the Hellenic Authority for Higher Education (HAHE). Public and accredited private university programs follow EU ECTS standards.',
    workRightsAndCareer: {
      rights: 'International students with a valid Greek student residence permit are allowed to work part-time (20 hours/week) during semesters.',
      opportunities: 'High demand for bilingual graduates in international tourism, hotel management, shipping companies, and tech startups.',
      caveats: 'Verify embassy appointment dates early as visa processing times vary.'
    },
    comparisons: {
      countryA: 'Malta',
      countryA_description: 'Greece offers larger university campuses and maritime trade specialization, while Malta offers a completely English-speaking nation environment.',
      countryB: 'Malaysia',
      countryB_description: 'Greece provides EU Schengen residence rights, while Malaysia offers UK branch campus degree transfers.'
    },
    reviewerInfo: {
      name: 'EduExpress Review Team',
      role: 'European Admissions Counselor',
      lastVerifiedDate: 'July 2026',
      primarySources: ['Ministry of Education and Religious Affairs (Greece)', 'HAHE Accreditation Portal']
    }
  },
  {
    name: 'Thailand',
    slug: 'thailand',
    flag: '🇹🇭',
    description: 'Active education service for international programs and regional study value',
    universities: [],
    programs: ['Business', 'Hospitality', 'Technology', 'International Programs'],
    requirements: {
      language: ['Teaching language and program requirements are confirmed before application'],
      documents: ['Academic records', 'Passport', 'Program specific supporting documents'],
      visa: ['Current education visa documents and financial evidence are checked from official guidance']
    },
    costs: {
      tuition: 'Confirmed for the selected institution and intake',
      living: 'Prepared in a dated ClearCost Sheet',
      currency: 'THB'
    },
    scholarships: [],
    benefits: ['International program exploration', 'Active university and study group routes', 'Quality and total cost review'],
    isActive: true,
    featured: true,
    images: ['/images/partnership.jpg'],
    metaTitle: 'Study in Thailand from Bangladesh',
    metaDescription: 'Explore Thailand international education options with university checks, clear costs and visa readiness.',
    intakesText: 'Confirmed for the selected institution',
    factText: 'EduExpress provides active education guidance for Thailand.',
    serviceStatus: 'Active',
    valueStatement: 'Thailand offers top-tier international university education in Southeast Asia, with accredited English-taught programs in Business, Hospitality, and Technology at regional tuition costs.',
    whoItFits: [
      'Students looking for affordable, high-quality international programs in Asia without Western tuition fees',
      'Hospitality, Culinary, Business, and IT students seeking modern campus facilities and regional career networking',
      'Students wanting low living expenses ($300–$450/month) with easy travel from Bangladesh'
    ],
    whoShouldReconsider: [
      'Students seeking Western European post-study work visas (Thailand ED visa is for study duration only)',
      'Applicants who plan to rely on off-campus part-time work for living expenses'
    ],
    educationSystemAndRecognition: 'Regulated by the Ministry of Higher Education, Science, Research and Innovation (MHESI) of Thailand. Top universities (Chulalongkorn, Mahidol, Assumption, Stamford) hold global accreditations.',
    workRightsAndCareer: {
      rights: 'ED visa holders are primarily focused on full-time study. Campus-based internships or research assistantships are available.',
      opportunities: 'Career pathways in multinational corporations across Southeast Asia, hospitality groups, and regional tech hubs.',
      caveats: 'The ED visa requires regular extension verification with Thai Immigration.'
    },
    comparisons: {
      countryA: 'Malaysia',
      countryA_description: 'Thailand offers lower living costs and rich international culture, while Malaysia offers direct Western branch campus degrees.',
      countryB: 'China',
      countryB_description: 'Thailand offers a completely English-medium campus environment, while China offers extensive government CSC scholarships.'
    },
    reviewerInfo: {
      name: 'EduExpress Review Team',
      role: 'Southeast Asia Admissions Lead',
      lastVerifiedDate: 'July 2026',
      primarySources: ['MHESI Thailand', 'Thai Immigration Bureau']
    }
  }
];

export const countryNames = countries.map(country => country.name);

export const getCountryBySlug = (slug: string): Country | undefined => {
  return countries.find(country => country.slug === slug);
};

export const featuredCountries = countries.filter(country => country.featured);

export const activeCountries = countries.filter(country => country.isActive);
