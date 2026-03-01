
export interface UniversityFee {
  item: string;
  cost: string;
  notes?: string;
}

export interface Universityscholarship {
  title: string;
  type?: string;
  details: string[];
  amount?: string;
  condition?: string;
}

export interface University {
  id: string;
  name: string;
  location: string; // Display string, e.g. "Chengdu, China"
  country: string;
  city: string;
  intake: string[];
  degree: string[];
  taught: string[];
  rankings: {
    country?: number;
    world?: number;
    national?: number;
  };
  details: {
    majors: string[];
    tuition: string; // Base or range
    tuitionDetails?: string[]; // Specifics per major if needed
  };
  fees: UniversityFee[];
  scholarships: Universityscholarship[];
  documents: string[];
  deadlines: {
    application: string;
    startDate: string;
  };
  notes?: string[];
  badges?: string[]; // e.g., "English Taught"
  logo?: string;
}

export const universities: University[] = [
  {
    id: 'sichuan-university',
    name: 'Sichuan University',
    location: 'Chengdu, China',
    country: 'China',
    city: 'Chengdu',
    intake: ['September'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {
      country: 15,
      world: 98
    },
    badges: ['Bachelor Degree', 'English Taught'],
    details: {
      majors: [
        'Software Engineering',
        'Civil Engineering',
        'Business Administration',
        'International Tourism and Hotel Management'
      ],
      tuition: '17,500 - 22,000 CNY/Year',
      tuitionDetails: [
        'Software Engineering: 22,000 CNY ($3040)/Year',
        'Civil Engineering: 22,000 CNY ($3040)/Year',
        'Business Administration: 17,500 CNY ($2420)/Year',
        'International Tourism and Hotel Management: 17,500 CNY ($2420)/Year'
      ]
    },
    fees: [
      { item: 'Accommodation (Jiangan Campus)', cost: '4500 CNY ($621)/Year', notes: 'Software, Civil & Tourism' },
      { item: 'Accommodation (WangJiang Campus - Male)', cost: '1500 CNY ($215)/Year', notes: 'Business Administration' },
      { item: 'Accommodation (WangJiang Campus - Female)', cost: '6000 CNY ($865)/Year', notes: 'Business Administration' },
      { item: 'Medical Insurance', cost: '800 CNY ($115)/Year' },
      { item: 'Visa Extension', cost: '400 CNY ($60)/Year' },
      { item: 'Application Fee', cost: '600 CNY' }
    ],
    scholarships: [
      {
        title: 'Bachelor Scholarship',
        details: ['Scholarship amount is 20,000 CNY ($2875)/Year/student']
      }
    ],
    notes: [
      'Students must pay half of the Tuition and accommodation fees at the beginning of every semester.',
      'Students will get Half of the Scholarship amount in their bank account at the end of Every Semester.',
      'China Scholastic Competency Assessment (CSCA) Exam Score Report required for documents.'
    ],
    documents: [
      'Passport', 'Photo', 'Highest Educational Transcript and Certificate', 'Medical Check up',
      'English Proficiency Certificate', 'Non-Criminal Record', 'Create Resume/CV',
      'Bank Statement (Minimum 6 Month)', 'Study Plan', 'CSCA Exam Score Report'
    ],
    deadlines: {
      application: '30th May, 2026',
      startDate: 'September 2026'
    }
  },
  {
    id: 'nuaa',
    name: 'Nanjing University of Aeronautics and Astronautics',
    location: 'Nanjing, China',
    country: 'China',
    city: 'Nanjing',
    intake: ['September'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {
      country: 68,
      world: 712
    },
    badges: ['Bachelor Degree', 'English Taught'],
    details: {
      majors: [
        'Artificial Intelligence',
        'Computer Science and Technology',
        'Civil Engineering',
        'International Business',
        'Aeronautical Engineering',
        'Mechanical Engineering',
        'Electrical and Electronic Engineering'
      ],
      tuition: '12,900 - 13,900 CNY/Year',
      tuitionDetails: [
        'Engineering program: 13,900 CNY/Year',
        'Business program: 12,900 CNY/Year'
      ]
    },
    fees: [
      { item: 'Accommodation', cost: '4000/7000 CNY/Year (Double room)' },
      { item: 'Insurance', cost: '800 CNY/Year' },
      { item: 'Visa extension', cost: '400 CNY/Year' },
      { item: 'Medical Check up', cost: 'Approx 400 CNY' },
      { item: 'Application fees', cost: '400 CNY' }
    ],
    scholarships: [
      {
        title: 'Type A',
        details: ['Free tuition fees (For the first year)'],
        condition: 'High school GPA >= 80'
      },
      {
        title: 'Type B',
        details: ['One-time 10,000 RMB']
      }
    ],
    notes: [
      'From 2nd to 4th year, students can apply academic scholarship (10,000 CNY/Year).',
      'Students have to hold the CASA exam to apply.'
    ],
    documents: [
      'Passport', 'Photo', 'Higher Secondary School / Grade 12th / A Level / GED',
      'Medical Check up report', 'English Proficiency Certificate', 'Non Criminal Record',
      'Bank Statement (6000$)', 'Application Form', 'Extra Curriculum Activities', 'Study plan'
    ],
    deadlines: {
      application: '30th May 2026',
      startDate: 'September 2026'
    }
  },
  {
    id: 'cupb',
    name: 'China University of Petroleum, Beijing (CUPB)',
    location: 'Beijing City, China',
    country: 'China',
    city: 'Beijing City',
    intake: ['September'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {
      world: 686,
      national: 501
    },
    badges: ['Bachelor Degree', 'English Taught'],
    details: {
      majors: [
        'Computer Science & Technology',
        'International Trade & Economics',
        'Chemical Engineering and Technics',
        'Petroleum Engineering',
        'English'
      ],
      tuition: '25,000 CNY/Year',
    },
    fees: [
      { item: 'Application Fee', cost: '400 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '25,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '1,200 - 1,500 CNY/Month' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'First Class Scholarship',
        details: [
          '100% Tuition Free',
          '100% Accommodation Free',
          '100% Insurance Free',
          'Stipend: 2,500 CNY/Month'
        ]
      },
      {
        title: 'Second Class Scholarship',
        details: [
          '100% Tuition Free',
          '100% Accommodation Free',
          '100% Insurance Free'
        ]
      },
      {
        title: 'Third Class Scholarship',
        details: ['100% Tuition Free']
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Requirements: HSC 4.00+',
      'English Proficiency: IELTS 6.0 or DET 115',
      'CSCA Required',
      'All scholarship winners must pass an annual review.'
    ],
    documents: [
      'Requirements: HSC 4.00+',
      'IELTS: 6.0 or DET: 115',
      'CSCA Required'
    ],
    deadlines: {
      application: 'May 5th, 2026 (Depends on Seats)',
      startDate: 'September'
    }
  },
  {
    id: 'njtech',
    name: 'Nanjing Tech University (NJTech)',
    location: 'Nanjing City, Jiangsu Province, China',
    country: 'China',
    city: 'Nanjing',
    intake: ['September'],
    degree: ['Bachelor'],
    taught: ['English'],
    documents: [],
    rankings: {
      world: 301
    },
    badges: ['QS Rank: 301-350', 'Times Higher Edu: 601-800', 'U.S.News: 556'],
    details: {
      majors: [
        'Computer Science & Technology',
        'Applied Chemistry',
        'Electrical Engineering & Automation',
        'Mechanical Engineering',
        'Pharmacy',
        'International Trade & Economics',
        'Transportation Engineering',
        'Surveying and Mapping Engineering',
        'Materials science and Engineering'
      ],
      tuition: '16,000 CNY/Year',
    },
    fees: [
      { item: 'Application Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '16,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '2,000-4,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'First Year Scholarship',
        amount: '100% Free Tuition',
        details: [
          'Tuition Fee: 100% Free',
          'Stipend: 400 CNY/Month'
        ]
      },
      {
        title: 'From Second Year: Type A (10%)',
        amount: '100% Free Tuition + Stipend',
        details: [
          'Tuition Fee: 100% Free',
          'Accommodation Fee: Self-Paid',
          'Stipend: 400 CNY/Month'
        ]
      },
      {
        title: 'From Second Year: Type B (30%)',
        amount: '100% Free Tuition',
        details: [
          'Tuition Fee: 100% Free',
          'Accommodation Fee: Self-Paid',
          'Stipend: N/A'
        ]
      },
      {
        title: 'From Second Year: Type C (60%)',
        details: [
          'Tuition Fee: 8,000 CNY/Year',
          'Accommodation Fee: Self-Paid',
          'Stipend: N/A'
        ]
      }
    ],
    notes: [
      'Requirements: HSC 4.50+',
      'English Proficiency: IELTS 6.0 or DET 105',
      'Age Limit: 18-25'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'dalian-university-of-technology',
    name: 'Dalian University of Technology',
    location: 'Dalian, China',
    country: 'China',
    city: 'Dalian',
    intake: ['September'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {
      country: 28,
      world: 151
    },
    badges: ['Bachelor Degree', 'English Taught', '211 Project', '985 Project'],
    details: {
      majors: [
        'Intelligent Construction',
        'Mechanical Design & Manufacturing and Automation',
        'Applied Physics',
        'Engineering Mechanics',
        'Process Equipment and Control Engineering',
        'Foundations of Mathematical Science',
        'Bioengineering (DUT-BGI)',
        'Applied Chemistry',
        'Environmental and Ecological Engineering',
        'Pharmacy'
      ],
      tuition: '19,500 - 25,000 CNY/Year'
    },
    fees: [
      { item: 'Accommodation (Single)', cost: '600/1800 CNY/Month' },
      { item: 'Accommodation (Double)', cost: '1200 CNY/Month' },
      { item: 'Insurance', cost: '800 CNY/Year' },
      { item: 'Application Fee', cost: '800 CNY' },
      { item: 'Visa Extension', cost: '400 CNY/Year' },
      { item: 'Medical Check Up', cost: '400-800 CNY (1st Year)' }
    ],
    scholarships: [
      {
        title: 'Scholarship',
        type: 'Tuition',
        details: ['Free tuition for the 1st year']
      }
    ],
    notes: [
      'Age: 18-25',
      'Must participate in CSCA (China Scholastic Competency Assessment).',
      'The guardian should be the resident in Dalian.'
    ],
    documents: [
      'Passport', 'Picture', 'High School Certificate and Transcript', 'Health Check Up',
      'Language Certificate', 'Non Criminal Record', 'Bank Statement', 'Application Form',
      'CSCA transcript', 'Study plan', 'Blood test report', 'Recommendation letter'
    ],
    deadlines: {
      application: '30th June 2026',
      startDate: 'September 2026'
    }
  },
  {
    id: 'xidian-university',
    name: 'Xidian University',
    location: 'Xi\'an, China',
    country: 'China',
    city: 'Xi\'an',
    intake: ['September'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {
      country: 40,
      world: 301
    },
    badges: ['Bachelor Degree', 'English Taught'],
    details: {
      majors: [
        'Computer Science and Technology',
        'Information and Computational Science',
        'Applied Physics'
      ],
      tuition: '25,000 CNY/Year'
    },
    fees: [
      { item: 'Accommodation', cost: '3600-9600 CNY/Year (1-4 Beds)' },
      { item: 'Insurance', cost: '1000 CNY/Year' },
      { item: 'Medical Fees', cost: '400 CNY (depends)' },
      { item: 'Visa Extension', cost: '400 CNY/Year' },
      { item: 'Application Fees', cost: '800 CNY (non-refundable)' }
    ],
    scholarships: [
      {
        title: 'HuaShan Scholarship (1st Year)',
        type: 'Full + Stipend',
        details: [
          'Tuition Fees Free',
          'Accommodation Fees Free (2 Beds Room)',
          'Living Allowance: 30000 CNY/Year'
        ]
      },
      {
        title: 'First Class Scholarship',
        type: 'Full + Stipend',
        details: [
          'Tuition Fees Free',
          'Accommodation Fees Free (2 Beds Room)',
          'Living Allowance: 15000 CNY/Year'
        ]
      },
      {
        title: 'Second Class Scholarship',
        type: 'Full',
        details: [
          'Tuition Fees Free',
          'Accommodation Fees Free (2 Beds Room)'
        ]
      },
      {
        title: 'Third Class Scholarship',
        type: 'Partial',
        details: [
          '50% of Tuition Fees Waived'
        ]
      }
    ],
    notes: [
      'Age: At least 18 years old.',
      'Applicants must submit CSCA test score.',
      'Interview arranged by school.',
      'Video self-introduction (3-5 mins) required.'
    ],
    documents: [
      'Passport (Info + Cover)', 'Photo', 'Highest diploma Certificate and Transcript',
      'IELTS-6.0 or TOFEL-80 or equivalent', 'Health Check Up', 'Non Criminal Record',
      'Bank Statement (5000USD+)', 'Application Form', 'Study Plan (800+ words)',
      'CSCA Test Scores', '3-5 minutes self-introduction video'
    ],
    deadlines: {
      application: '15th May 2026',
      startDate: 'September 2026'
    }
  },
  {
    id: 'nanchang-university',
    name: 'Nanchang University',
    location: 'Nanchang, China',
    country: 'China',
    city: 'Nanchang',
    intake: ['September'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {
      country: 73,
      world: 301
    },
    badges: ['Bachelor Degree', 'English Taught'],
    details: {
      majors: [
        'Software Engineering',
        'Computer Science and Technology',
        'Artificial Intelligence',
        'Materials Science and Engineering',
        'English (International Students Track)',
        'Business Administration'
      ],
      tuition: '18,000 - 19,000 CNY/Year'
    },
    fees: [
      { item: 'Accommodation', cost: '3000-7500 CNY/Year', notes: 'Varies by room type (Triple to Suite)' },
      { item: 'Insurance', cost: '800 CNY/Year' },
      { item: 'Application fees', cost: '800 CNY' },
      { item: 'Visa Extension', cost: '400 CNY/Year' },
      { item: 'Medical Check Up', cost: '400-800 CNY (1st Year only)' }
    ],
    scholarships: [
      {
        title: 'Type A',
        type: 'Full',
        details: ['Tuition fee free']
      },
      {
        title: 'Type B',
        type: 'Partial',
        details: ['70% tuition fee free']
      },
      {
        title: 'Type C',
        type: 'Partial',
        details: ['50% tuition fee free']
      }
    ],
    notes: [
      'Age: 18-25',
      'Must provide CSCA score (English version) before June 30th.',
      'Math & Physics test required for Engineering majors.',
      'Interview required.'
    ],
    documents: [
      'Passport', 'Picture', 'High School Certificate and Transcript', 'Health Check Up',
      'Language Certificate (TOEFL 82/IELTS 6)', 'Non Criminal Record', 'Bank Statement',
      'Application Form', 'CSCA transcript', 'Study plan'
    ],
    deadlines: {
      application: '30th June 2026',
      startDate: 'September 2026'
    }
  },
  {
    id: 'npu',
    name: 'Northwestern Polytechnical University (NPU)',
    location: 'Xi\'an City, Shaanxi Province, China',
    country: 'China',
    city: 'Xi\'an',
    intake: ['September'],
    degree: ['Bachelor'],
    taught: ['English'],
    documents: [],
    logo: 'https://upload.wikimedia.org/wikipedia/en/3/32/Seal_of_NWPU.png',
    rankings: {
      world: 207
    },
    badges: ['ShanghaiRank: 128', 'U.S.News: 207', 'Times Higher Edu: 273'],
    details: {
      majors: [
        'Aerospace Engineering (Aeronautics)',
        'Aerospace Engineering (Astronautics)',
        'Mechanical Engineering',
        'Electrical Engineering and Automation',
        'Electronics & Information Engineering',
        'Biotechnology',
        'Computer Science & Technology (till 15th March)',
        'Business Administration (till 15th April)',
        'Materials Science and Engineering'
      ],
      tuition: '25,000 CNY/Year',
    },
    fees: [
      { item: 'Application Fee', cost: '600 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '25,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '5,400-7,200 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'The Belt & Road Scholarship (Only 1st Year)',
        details: []
      },
      {
        title: 'NPU President Scholarship (All Years)',
        details: []
      }
    ],
    notes: [
      'All scholarship winners must pass an annual review.',
      'Requirements: HSC 4.50+',
      'English Proficiency: IELTS: 6.0 or DET: 115',
      'Additional Requirements: Exam + Interview, CSCA Required',
      'Age Limit: 18-25'
    ],
    deadlines: {
      application: 'May 1st, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  }
];
