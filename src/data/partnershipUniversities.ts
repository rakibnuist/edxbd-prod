
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

export interface ProgramData {
  majors: string[];
  tuition: string;
  tuitionDetails?: string[];
  fees?: UniversityFee[];
  scholarships?: Universityscholarship[];
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
  programs?: {
    bachelor?: ProgramData;
    mbbs?: ProgramData;
    masters?: ProgramData;
  };
}

export const universities: University[] = [
  {
    id: 'sichuan-university',
    name: 'Sichuan University',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/4/45/Sichuan_University_logo.svg/500px-Sichuan_University_logo.svg.png',
    location: 'Chengdu, Sichuan Province, China',
    country: 'China',
    city: 'Chengdu',
    intake: ['Fall 2026'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {},
    badges: [
      'QS Rank: 324',
      'Times Higher Edu: 201-250',
      'U.S.News: 182',
      'Bachelor Degree',
      'English Taught'
    ],
    details: {
      majors: [
        'Software Engineering',
        'Civil Engineering',
        'Business Administration',
        'International Tourism and Hotel Management'
      ],
      tuition: '17,500 - 22,000 CNY/Year',
      tuitionDetails: [
        'Software Engineering: 22,000 CNY/Year',
        'Civil Engineering: 22,000 CNY/Year',
        'Business Administration: 17,500 CNY/Year',
        'International Tourism and Hotel Management: 17,500 CNY/Year'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '600 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '17,500 - 22,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '1,500 - 6,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'Belt & Road Scholarship',
        type: 'Partial',
        amount: '20,000 CNY/Year',
        details: ['Scholarship amount is 20,000 CNY/Year/student']
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Requirements: HSC 4.80+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'Students must pay half of the Tuition and accommodation fees at the beginning of every semester.',
      'Students will get Half of the Scholarship amount in their bank account at the end of Every Semester.'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance', 'CV/Resume', 'Study Plan', 'CSCA Exam Score Report'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
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
    location: 'Beijing, China',
    country: 'China',
    city: 'Beijing',
    intake: ['September'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {
      country: 64,
      world: 497
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
      tuition: '25,000 CNY/Year (Normal)',
    },
    fees: [
      { item: 'Accommodation', cost: '1200-1500 CNY/Month' },
      { item: 'Medical Insurance', cost: '800 CNY/Year' },
      { item: 'Residence Permit', cost: '400 CNY/Year' },
      { item: 'Health Check up', cost: '400 CNY' },
      { item: 'Registration Fees', cost: '400 CNY (Only for 1st Year)' }
    ],
    scholarships: [
      {
        title: 'Type A',
        details: [
          'Full Tuition fees free',
          'Full Accommodation fees free',
          'Medical Insurance Fees Free',
          'Monthly stipend: 2500 CNY/Month'
        ]
      },
      {
        title: 'Type B',
        details: [
          'Full Tuition fees free',
          'Full Accommodation fees free',
          'Medical Insurance Fees Free'
        ]
      },
      {
        title: 'Type C',
        details: ['Full Tuition fees free']
      }
    ],
    notes: [
      'English Proficiency: IELTS 6.0 or TOFEL 75 and Duolingo 95',
      'University will take an interview for 4-5 minutes.',
      'China Scholastic Competency Assessment (CSCA) Exam Score Report required'
    ],
    documents: [
      'Passport', 'Picture', 'Higher Secondary School Certificate', 'Health Check Up',
      'English Proficiency Certificate', 'Non Criminal Record', 'Bank Statement (5000$)',
      'Study Plan', 'Application Form', 'CSCA Exam Score Report'
    ],
    deadlines: {
      application: '5th May 2026',
      startDate: 'September 2026'
    }
  },
  {
    id: 'njtech',
    name: 'Nanjing Tech University',
    location: 'Nanjing, China',
    country: 'China',
    city: 'Nanjing',
    intake: ['September'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {
      national: 74,
      world: 560
    },
    badges: ['Bachelor Degree', 'English Taught'],
    details: {
      majors: [
        'International Economy and Trade',
        'Computer Science and Technology',
        'Civil Engineering',
        'Mechanical Engineering',
        'Pharmacy',
        'Electrical Engineering and Automation',
        'Chemical Engineering and Technics',
        'Traffic Engineering'
      ],
      tuition: '16,000 CNY/Year',
    },
    fees: [
      { item: 'Accommodation', cost: '2000-4000 CNY/Year' },
      { item: 'Insurance', cost: '800 CNY/Year' },
      { item: 'Resident Permit', cost: '400 CNY/Year' },
      { item: 'Medical Check Up', cost: '400 CNY (1st Year only)' },
      { item: 'Registration Fees', cost: '500 CNY' },
      { item: 'Application Fees', cost: '500 CNY (non-refundable)' }
    ],
    scholarships: [
      {
        title: 'Scholarship',
        amount: '20,000 CNY/Year/Student',
        details: [
          'Condition: Attendance ≥ 85%, average scores ≥ 60 for continuation.'
        ]
      },
      {
        title: 'Extra Scholarship (2nd Year+ for Top Students)',
        details: [
          'Jiangsu Provincial Scholarship: 18,000 CNY',
          'Nanjing Government Scholarship: 10,000 CNY',
          'NJTECH University Scholarship: Monthly 400 CNY'
        ]
      }
    ],
    notes: [
      'Students shall pay the Tuition and Accommodation fees to the University first.',
      'Scholarship amount (20000CNY) allows deduction or stipend payment (2000CNY/Month for 10 months).'
    ],
    documents: [
      'Passport', 'Picture', 'Higher Secondary School Certificate', 'Health Check Up',
      'English Proficiency Certificate', 'Non Criminal Record', 'Bank Statement',
      'Application Form', 'Award Certificate', 'Study Plan'
    ],
    deadlines: {
      application: '10th June 2026',
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
    id: 'xsyu',
    name: "Xi'an Shiyou University (XSYU)",
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv97_SG-44xnE9haoHawGFh_qK0wZpI76MWA&s',
    country: 'China',
    city: "Xi'an",
    location: 'Xian City, Shaanxi Province, China',
    rankings: {},
    badges: ['QS Rank: 1201-1300', 'Times Higher Edu: 801-1000'],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '18,500 CNY/Year',
      majors: [
        'Civil Engineering',
        'Petroleum Engineering',
        'Geology',
        'Offshore Oil & Gas Engineering',
        'Resource Exploration Engineering'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '600 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '18,500 CNY/Year' },
      { item: 'Hostel Fee', cost: '7,500 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '100-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '800 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'Belt and Road International Students Scholarship',
        type: 'Mixed',
        amount: 'See Details',
        details: [
          '1st Type: 100% Tuition Free + 100% Accommodation Free + Monthly Stipend: 1500CNY',
          '2nd Type: 100% Tuition Free + Monthly Stipend: 1500CNY',
          '3rd Type: 50% Tuition Free + 50% Accommodation Free + Monthly Stipend: 1500CNY (Students should pay 9,250 CNY as Tuition Fee)'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'All scholarship winners must pass an annual review. The Level of scholarship will be adjusted according strictly to their academic performance.',
      'HSC 4.50+ OR Equivalent required.',
      'IELTS: 5.5 or DET: 95 required.'
    ],
    documents: [
      'Passport', 'Picture', 'Higher Secondary School /Grade 12th /A Level/ High School Certificate', 'Higher Secondary School /Grade 12th /A Level/ High School Transcript', 'Foreign Physical Medical Examination Form', 'English Proficiency Certificate (IELTS or TOFEL and Duolingo or any other valid English Certificate)', 'Non Criminal Record / Police Clearance', 'Bank Statement', 'Study Plan', 'Application Form'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'sbs',
    name: "Shanghai Business School (SBS)",
    logo: 'https://english.sbs.edu.cn/images/logo.png',
    country: 'China',
    city: "Shanghai",
    location: 'Shanghai City, China',
    rankings: {},
    badges: ['Bachelor Degree', 'English Medium'],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '24,000 CNY/Year',
      majors: [
        'Business Management',
        'Hospitality Management',
        'Finance'
      ]
    },
    fees: [
      { item: 'Entry Fee', cost: '800 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '24,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '8,400-11,200 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'SBS Scholarship Policy',
        type: 'Tiered',
        amount: 'Up to 100% + Stipend',
        details: [
          'Type A: 100% Tuition + 100% Insurance + 100% Accommodation + 1200 CNY/Month Stipend',
          'Type B: 100% Tuition + 100% Insurance + 1200 CNY/Month Stipend',
          'Type C: 100% Tuition + 100% Insurance + 600 CNY/Month Stipend',
          'Type D: 100% Tuition + 100% Insurance',
          'Type E: 1200 CNY/Month Stipend'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-30',
      'All scholarship winners must pass an annual review.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 85'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate/Transcript', 'Medical Report', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'ahut',
    name: "Anhui University of Technology (AHUT)",
    logo: 'https://www.ahut.edu.cn/images2022/logo.png',
    country: 'China',
    city: "Ma'anshan",
    location: "Ma'anshan City, Anhui Province, China",
    rankings: {},
    badges: ['U.S.News: 1354', 'Bachelor Degree', 'English Medium'],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '15,000 CNY/Year',
      majors: [
        'International Trade (Business)',
        'Civil Engineering',
        'Internet of Things Engineering (Computer Category)'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '400 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '15,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '3,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' },
      { item: 'Enrollment Deposit', cost: '3,000 CNY (Refundable)' }
    ],
    scholarships: [
      {
        title: 'AHUT Scholarship Policy',
        type: 'Tiered',
        amount: 'Up to 100% + Stipend',
        details: [
          'Type A: 100% Tuition Free + 100% Accommodation Free + 3000 CNY/Year Stipend',
          'Type B: 100% Tuition Free + 3,000 CNY/Year Accommodation Fee'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'University will review the scholarship every year.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 85',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'njit',
    name: "Nanjing Institute of Technology (NJIT)",
    logo: 'https://www.njit.edu.cn/images/logo.png',
    country: 'China',
    city: "Nanjing",
    location: "Nanjing City, Jiangsu Province, China",
    rankings: {},
    badges: ['U.S.News: 1953', 'Masters Degree', 'English Medium', '3 Years'],
    degree: ['Masters'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '24,000 CNY/Year',
      majors: [
        'Mechanical Engineering',
        'Materials and Chemical Engineering',
        'Power Engineering',
        'Electrical Engineering',
        'Control Engineering',
        'Electronic Information',
        'Library and Informatio Science',
        'Civil Engineering and Hydraulic Engineering',
        'Design',
        'Transportation and Logistic',
        'Resources and Environment',
        'Social Work'
      ]
    },
    programs: {
      masters: {
        majors: [
          'Mechanical Engineering',
          'Materials and Chemical Engineering',
          'Power Engineering',
          'Electrical Engineering',
          'Control Engineering',
          'Electronic Information',
          'Library and Informatio Science',
          'Civil Engineering and Hydraulic Engineering',
          'Design',
          'Transportation and Logistic',
          'Resources and Environment',
          'Social Work'
        ],
        tuition: '24,000 CNY/Year',
        fees: [
          { item: 'Application Fee', cost: '500 CNY (Non-refundable)' },
          { item: 'Tuition Fee', cost: '24,000 CNY/Year' },
          { item: 'Hostel Fee', cost: '2,000-9,600 CNY/Year' },
          { item: 'Insurance Fee', cost: '800 CNY/Year' },
          { item: 'Medical Fee', cost: '400 CNY (1st Year only)' },
          { item: 'Residence Permit Fee', cost: '400 CNY/Year' },
          { item: 'Dormitory Deposit', cost: '800 CNY/Person (Refundable)' },
          { item: 'Enrollment Deposit', cost: '5,000 CNY/Person (Refundable)' }
        ],
        scholarships: [
          {
            title: 'NJIT Masters Scholarship (Type A)',
            amount: 'Full Coverage + Stipend',
            details: [
              'Tuition Fee: 100% Free',
              'Insurance Fee: 100% Free',
              'Accommodation Fee: 100% Free',
              'Stipend: 1,000 CNY/Month'
            ]
          },
          {
            title: 'NJIT Masters Scholarship (Type B)',
            amount: 'Full Coverage + Stipend',
            details: [
              'Tuition Fee: 100% Free',
              'Insurance Fee: 100% Free',
              'Accommodation Fee: 100% Free',
              'Stipend: 500 CNY/Month'
            ]
          },
          {
            title: 'NJIT Masters Scholarship (Type C)',
            amount: 'Full Coverage + Stipend',
            details: [
              'Tuition Fee: 100% Free',
              'Insurance Fee: 100% Free',
              'Accommodation Fee: 100% Free',
              'Stipend: 300 CNY/Month'
            ]
          }
        ]
      }
    },
    fees: [
      { item: 'Application Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '24,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '2,000-9,600 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' },
      { item: 'Dormitory Deposit', cost: '800 CNY/Person (Refundable)' },
      { item: 'Enrollment Deposit', cost: '5,000 CNY/Person (Refundable)' }
    ],
    scholarships: [],
    notes: [
      'Age Limit: 18-35',
      'All scholarship winners must pass an annual review.',
      'Requirements: Bachelor Degree',
      'IELTS: 5.5 or DET: 95',
      'Deadline: June 30th, 2026 (Depends on Seats)'
    ],
    documents: [
      'Passport', 'Photo', 'Bachelor Certificate', 'Bachelor Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance', 'Study Plan'
    ],
    deadlines: {
      application: 'June 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'sxu',
    name: "Shaoxing University (SXU)",
    logo: 'https://wsc.usx.edu.cn/images/logo1.png',
    country: 'China',
    city: "Shaoxing",
    location: "Shaoxing City, Zhejiang Province, China",
    rankings: {},
    badges: ['U.S.News: 1646', 'Bachelor Degree', 'English Medium'],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '16,000 - 19,200 CNY/Year',
      majors: [
        'Computer Science & Technology',
        'Biology',
        'Civil Engineering',
        'English',
        'International Economics & Trade',
        'Nursing',
        'Textile Engineering'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '16,000-19,200 CNY/Year' },
      { item: 'Hostel Fee', cost: '3,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '504 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'Full Scholarship + Stipend',
        type: 'Full',
        amount: '100% Free + Stipend',
        details: [
          'Tuition Fee: 100% Free',
          'Accommodation Fee: 100% Free',
          'Stipend: 500 CNY/Month'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'University will review the scholarship every year.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'hitsz',
    name: "Harbin Institute of Technology, Shenzhen (HITSZ)",
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/50/Harbin_Institute_of_Technology_%28crest%29.gif',
    country: 'China',
    city: "Shenzhen",
    location: "Shenzhen City, China",
    rankings: {},
    badges: [
      'QS Rank: 256',
      'Times Higher Edu: 131',
      'U.S.News: 128',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '30,000 CNY/Year',
      majors: [
        'Computer Science and Technology',
        'Optoelectronic Information Science and Engineering',
        'Mechanical Design, Manufacturing and Automation',
        'Energy and Power Engineering',
        'Civil Engineering',
        'Business Administration',
        'Economics',
        'Architecture'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '400 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '30,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '240-1,000 CNY/Month' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' },
      { item: 'Security Deposit', cost: '30,000 CNY (After Admission)' }
    ],
    scholarships: [
      {
        title: 'HITSZ Entrance Scholarship',
        type: 'Tiered',
        amount: '100% Free + Stipend',
        details: [
          'Major Award: 100% Tuition Free + 1,000 CNY/Month Stipend',
          'First Award: 100% Tuition Free',
          'Second Award: 6,000 CNY/Year',
          'Third Award: 9,000 CNY/Year'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Shenzhen Universiade International Scholarship: 35,000 CNY/Year',
      'Guangdong Government Scholarship: 10,000 RMB/Year',
      'All scholarship winners must pass an annual review.',
      'Requirements: HSC 4.50+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 20th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'tyut',
    name: "Taiyuan University of Technology (TYUT)",
    logo: 'https://upload.wikimedia.org/wikipedia/en/6/63/Taiyuan_University_of_Technology_logo.png',
    country: 'China',
    city: "Taiyuan",
    location: "Taiyuan City, Shaanxi Province, China",
    rankings: {},
    badges: [
      'QS Rank: 351-400',
      'U.S.News: 1414',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '10,000 CNY/Year',
      majors: [
        'International Economics and Trade',
        'Computer Science and Technology',
        'Chinese Language (6,000 CNY/Year)'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '400 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '10,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '180 - 800 CNY/Month' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '415 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '800 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'TYUT Scholarship Policy',
        type: 'Tiered',
        amount: '100% Free + Stipend',
        details: [
          'Type B: 100% Tuition + 100% Hostel + 800 CNY/Month Stipend (CSCA M+P: 50+, IELTS 6.5+)',
          'Type C: 100% Tuition + 100% Hostel + 500 CNY/Month Stipend (CSCA M+P: 45+, IELTS 6.5+)',
          'Type D: 100% Tuition + 100% Hostel (CSCA M+P: 40+, IELTS 6.5+)',
          'Type E: 10,000 CNY/Year (Tuition Only) + 100% Hostel (CSCA M+P: 40+, EFSET 65+)'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Requirements: HSC 4.50+',
      'IELTS: 6.5 or DET: 110',
      'CSCA Required'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'ntu',
    name: "Nantong University (NTU)",
    logo: 'https://en.ntu.edu.cn/_upload/tpl/00/e5/229/template229/htmlRes/jslogo2.png',
    country: 'China',
    city: "Nantong",
    location: "Nantong City, Jiangsu Province, China",
    rankings: {},
    badges: ['QS Rank: 851-900', 'CWUR: 770', 'Bachelor Degree', 'English Medium'],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '16,000 / 26,000 CNY/Year',
      majors: [
        'International Economics and Trade',
        'Computer Science and Technology',
        'Pharmacy',
        'Clinical Medicine-MBBS (6 years)',
        'Dental Surgery-BDS (5 years)'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '600 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '16,000/26,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '2,800 CNY/Year (Off Campus-4 Beds Room)' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '100-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '800 CNY/Year' },
      { item: 'Textbook Fee', cost: '1200 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'NTU University Scholarship',
        type: 'Tiered',
        amount: 'Up to 100% Free',
        details: [
          'Type A Scholarship: 100% Tuition Free + 100% Hostel Free',
          'Type B Scholarship: 100% Tuition Free'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-24',
      'All scholarship winners must pass an annual review.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'gzu',
    name: "Guizhou University (GZU)",
    logo: 'https://upload.wikimedia.org/wikipedia/zh/9/99/Guizhou_University_Logo.png',
    country: 'China',
    city: "Guiyang",
    location: "Guiyang City, Guizhou Province, China",
    rankings: {},
    badges: ['QS Rank: 401-475', 'U.S.News: 913', 'Bachelor Degree', 'English Medium'],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '21,500 CNY/Year',
      majors: [
        'Computer Science and Technology',
        'Chemical Biology',
        'Veterinary Medicine'
      ]
    },
    fees: [
      { item: 'Registration Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '21,500 CNY/Year' },
      { item: 'Accommodation Fee', cost: '3,000 - 6,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '100-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'GZU University Scholarship',
        type: 'Full',
        amount: '100% Free Tuition & Hostel',
        details: [
          'Tuition Fee: 100% Free',
          'Hostel Fee: 100% Free'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Requirements: HSC 5.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 15th, 2026 (Result in July)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'hit-harbin',
    name: "Harbin Institute of Technology (HIT)",
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/4/46/Harbin_Institute_of_Technology_logo.svg/500px-Harbin_Institute_of_Technology_logo.svg.png',
    country: 'China',
    city: "Harbin",
    location: "Harbin, Heilongjiang Province, China",
    rankings: {},
    badges: [
      'QS Rank: 256',
      'Times Higher Edu: 131',
      'U.S.News: 128',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '26,000 CNY/Year',
      majors: [
        'Automation',
        'Integrated Circuit Design and Integrated System',
        'Electrical Engineering and Automation',
        'Computer Science and Technology',
        'Artificial Intelligence',
        'Robot Engineering',
        'Civil Engineering',
        'Chemical Engineering and Technology',
        'Biological Engineering',
        'Digital Media Art',
        'Architecture',
        'Big Data Management and Application',
        'Business Management'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '600 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '26,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '800 CNY/Month' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '300-400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' },
      { item: 'Security Deposit', cost: '13,000 CNY (For JW202)' }
    ],
    scholarships: [
      {
        title: 'HIT Scholarship',
        type: 'Tiered',
        amount: 'Up to 100% Free',
        details: [
          'Elite Class Scholarship: 100% Tuition Free',
          'First Class Scholarship: 50% Tuition Free (Pay 13,000 CNY/Year)',
          'Second Class Scholarship: 30% Tuition Free (Pay 18,200 CNY/Year)',
          'Third Class Scholarship: 20% Tuition Free (Pay 20,800 CNY/Year)'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25 (Self Fund under 30)',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'July 25th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'jxu',
    name: "Jiaxing University (JXU)",
    logo: 'https://upload.wikimedia.org/wikipedia/zh/f/f0/Jiaxing_University_logo.png',
    country: 'China',
    city: "Jiaxing",
    location: "Hangzhou City, Zhejiang Province, China",
    rankings: {},
    badges: ['CWUR: 1594', 'Bachelor Degree', 'English Medium'],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '16,000 - 21,000 CNY/Year',
      majors: [
        'Business Administration',
        'English',
        'Civil Engineering',
        'Textile Engineering'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '600 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '16,000-21,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '5,475 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '580 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'JXU Scholarship Options',
        type: 'Tiered',
        amount: 'Up to 100% Free',
        details: [
          'Friendship Scholarship: 100% Tuition + 100% Hostel + 100% Residence Permit + 100% Insurance + 100% Textbooks + 100% Physical Exam',
          'Excellent Degree Freshman Scholarship: 100% Tuition Free + 5,475 CNY/Year Accommodation',
          'Zhejiang Provincial Scholarship: 20,000 CNY/Year'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-30',
      'University will review the scholarship every year.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'zjut',
    name: "Zhejiang University of Technology (ZJUT)",
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/2/20/ZJUT_seal.svg/500px-ZJUT_seal.svg.png',
    country: 'China',
    city: "Hangzhou",
    location: "Hangzhou City, Zhejiang Province, China",
    rankings: {},
    badges: [
      'QS Rank: 1251-1300',
      'Times Higher Edu: 501-600',
      'U.S.News: 521',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '17,800 CNY/Year',
      majors: [
        'International Economics and Trade',
        'Civil Engineering',
        'Computer Science and Technology',
        'Software Engineering',
        'Mechanical Engineering',
        'Chemical Engineering and Technology',
        'Finance',
        'Electrical Engineering and Automation',
        'Environmental Engineering',
        'Law (International Law Oriented)',
        'Pharmaceutical Engineering'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '17,800 CNY/Year' },
      { item: 'Hostel Fee', cost: '3,500 - 5,300 CNY/Year' },
      { item: 'Insurance Fee', cost: '1000 CNY/Year' },
      { item: 'Medical Fee', cost: '600 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'Scholarship Policy',
        type: 'Tiered',
        amount: 'Up to 100% Free',
        details: [
          'Type A: 100% Tuition FREE for 4 Years',
          'Type B: 100% Tuition FREE for 1st Year',
          'Type C: 50% Tuition FREE for 1st Year (Pay 8,900 CNY/Year)',
          'Type D: 100% Hotel FREE for 1st Year (Pay 17,800 CNY/Year)'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'For Type B, C and D Scholarship students, University will provide scholarships from 2-4 year according to rules and regulations of ZJUT and performance of students.',
      'Students must need to pay Half of the Tuition and accommodation fees at the beginning of every semester and (the Visa and insurance fees for one year as well).',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'fuist',
    name: "Fuzhou University of International Studies and Trade (FUIST)",
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQntXaTHYqFkU1rzXiW6vXJZmIMpI1dNHI4tg&s',
    country: 'China',
    city: "Fuzhou",
    location: "Fuzhou City, Fujian Province, China",
    rankings: {},
    badges: ['Bachelor Degree', 'English Medium'],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '16,000 CNY/Year',
      majors: [
        'International Economics and Trade'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '16,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '3,200 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '600 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'Scholarship Policy',
        type: 'Tiered',
        amount: 'Up to 100% Free',
        details: [
          'Type A: 100% Tuition Free + 100% Accommodation Free',
          'Type B: 100% Tuition Free + 3,200 CNY/Year Accommodation',
          'Type C: 6,000 CNY/Year Tuition + 100% Accommodation Free',
          'Type D: 6,000 CNY/Year Tuition + 3,200 CNY/Year Accommodation'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'University will review the scholarship every year.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'jit',
    name: "Jinling Institute of Technology (JIT)",
    logo: 'https://www.jit.edu.cn/en/images/logo.png',
    country: 'China',
    city: "Nanjing",
    location: "Nanjing City, Jiangsu Province, China",
    rankings: {},
    badges: ['Bachelor Degree', 'English Medium'],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '12,000 CNY/Year',
      majors: [
        'Software Engineering',
        'International Economics and Trade'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '300 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '12,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '1,500 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '526 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'JIT Scholarship Policy',
        type: 'Full',
        amount: '100% Free Tuition & Hostel',
        details: [
          'Tuition Fee: 100% Free',
          'Accommodation Fee: 100% Free'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-23',
      'University will review the scholarship every year.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 115'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'smu',
    name: "Sanming University (SMU)",
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Sanming_University_seal.svg/500px-Sanming_University_seal.svg.png',
    country: 'China',
    city: "Sanming",
    location: "Sanming City, Fujian Province, China",
    rankings: {},
    badges: ['Bachelor Degree', 'English Medium'],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '14,000 CNY/Year',
      majors: [
        'Trade Economics',
        'Civil Engineering'
      ]
    },
    fees: [
      { item: 'Registration Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '14,000 CNY/Year' },
      { item: 'Accommodation Fee', cost: '4,500 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '100-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'SMU University Scholarship',
        type: 'Full',
        amount: '100% Free Tuition & Hostel',
        details: [
          'Tuition Fee: 100% Free',
          'Hostel Fee: 100% Free'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Requirements: HSC 5.00+',
      'IELTS: 6.0 or DET: 105',
      'CSCA Required'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 15th, 2026 (Result in July)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'hsu',
    name: "Huangshan University (HSU)",
    logo: 'https://www.hsu.edu.cn/_upload/tpl/01/72/370/template370/images/logo.svg',
    country: 'China',
    city: "Huangshan",
    location: "Huangshan, Anhui Province, China",
    rankings: {},
    badges: ['Bachelor Degree', 'English Medium'],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '12,000 CNY/Year',
      majors: [
        'Hospitality Management (Sino-France Corporation)'
      ]
    },
    fees: [
      { item: 'Registration Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '12,000 CNY/Year' },
      { item: 'Accommodation Fee', cost: '2,000-4,500 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '100-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'HSU University Scholarship',
        type: 'Full',
        amount: '100% Free Tuition & Hostel',
        details: [
          'Tuition Fee: 100% Free',
          'Hostel Fee: 100% Free'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Requirements: HSC 5.00+',
      'IELTS: 6.0 or DET: 105'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 15th, 2026 (Result in July)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'wzu',
    name: "Wenzhou University (WZU)",
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/8/88/Wenzhou_University_logo.svg/500px-Wenzhou_University_logo.svg.png',
    country: 'China',
    city: "Wenzhou",
    location: "Wenzhou City, Zhejiang Province, China",
    rankings: {},
    badges: [
      'QS Rank: 1501+',
      'Times Higher Edu: 801-1000',
      'U.S.News: 608',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '20,000 - 22,000 CNY/Year',
      majors: [
        'Computer Science & Technology',
        'International Economics and Trade',
        'Marketing',
        'Mechanical Engineering',
        'Civil Engineering',
        'Biotechnology',
        'Chemical Engineering and Technology',
        'Law',
        'Chemistry',
        'Mathematics and Applied Mathematics'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '20,000 - 22,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '2,900 - 4,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '300-400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '800 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'WZU Scholarship Options',
        type: 'Tiered',
        amount: 'Up to 100% Free',
        details: [
          'First Class Scholarship: 100% Tuition Free',
          'Second Class Scholarship: 8,000 CNY/Year'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'University will review the scholarship every year.',
      'Requirements: HSC 4.50+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'nuist',
    name: "Nanjing University of Information Science and Technology (NUIST)",
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/a/a4/NUIST.svg/500px-NUIST.svg.png',
    country: 'China',
    city: "Nanjing",
    location: "Nanjing City, Jiangsu Province, China",
    rankings: {},
    badges: [
      'U.S.News: 409',
      'Times Higher Edu: 801-1000',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '18,000 CNY/Year',
      majors: [
        'Artificial Intelligence',
        'Computer Science and Technology',
        'Electronic Information Engineering',
        'International Economics and Trade'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '18,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '2,500 - 4,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '600 CNY/Year' },
      { item: 'Medical Fee', cost: '526 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'NUIST Freshman Excellent Scholarship',
        type: 'Tiered',
        amount: 'Up to 100% Free',
        details: [
          'First Class Scholarship: 100% Tuition Free',
          'Second Class Scholarship: 50% Tuition Free (Pay 9,000 CNY/Year)',
          'Subsequent Years: Based on ranking (Top 40% for 1st Class, 41-85% for 2nd Class)'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'From Second Year: Top 40% Students get 1st Class, 41-85% get 2nd Class.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'zzu',
    name: "Zhengzhou University (ZZU)",
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/e/ed/Zhengzhou_University.svg/500px-Zhengzhou_University.svg.png',
    country: 'China',
    city: "Zhengzhou",
    location: "Zhengzhou City, Henan Province, China",
    rankings: {},
    badges: [
      'U.S.News: 203',
      'QS Rank: 618',
      'Times Higher Edu: 601-800',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '23,000 - 36,000 CNY/Year',
      majors: [
        'International Economics and Trade',
        'Tourism Management',
        'Urban and Rural Planning',
        'Architecture',
        'Civil Engineering',
        'Pharmacy',
        'Software Engineering',
        'MBBS (Tuition: 36,000 CNY/Year)'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '800 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '23,000 - 36,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '5,000 CNY/Year (Off-campus: 2,500-4,000)' },
      { item: 'Insurance Fee', cost: '1,000 CNY/Year' },
      { item: 'Medical Fee', cost: '100-600 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '430 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'University President Scholarship',
        type: 'Tiered',
        amount: 'Up to 100% Free',
        details: [
          'Type A Scholarship: 100% Tuition Free',
          'Type B Scholarship: 5,000 CNY Payable'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-23',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'cumt',
    name: "China University of Mining and Technology (CUMT)",
    logo: 'https://upload.wikimedia.org/wikipedia/en/8/82/China_University_of_Mining_and_Technology_logo.png',
    country: 'China',
    city: "Xuzhou",
    location: "Xuzhou City, Jiangsu Province, China",
    rankings: {},
    badges: [
      'QS Rank: 654',
      'Times Higher Edu: 801-1000',
      'U.S.News: 550',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '14,600 CNY/Year',
      majors: [
        'Mining Engineering',
        'Safety Engineering',
        'Mechanical Engineering'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '400 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '14,600 CNY/Year' },
      { item: 'Hostel Fee', cost: '2,000 - 3,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '690 CNY/Year' },
      { item: 'Medical Fee', cost: '300-400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'CUMT School Scholarship',
        type: 'Tiered',
        amount: 'Up to 100% Free',
        details: [
          'First Class Scholarship: 100% Tuition Free',
          'Second Class Scholarship: 50% Tuition Free (Pay 7,200 CNY/Year)'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'All scholarship winners must pass an annual review.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'nuaa',
    name: "Nanjing University of Aeronautics and Astronautics (NUAA)",
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/2/2b/Nanjing_University_of_Aeronautics_and_Astronautics.svg/500px-Nanjing_University_of_Aeronautics_and_Astronautics.svg.png',
    country: 'China',
    city: "Nanjing",
    location: "Nanjing City, Jiangsu Province, China",
    rankings: {},
    badges: [
      'U.S.News: 510',
      'QS Rank: 680',
      'Times Higher Edu: 601-800',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '22,900 - 23,900 CNY/Year',
      majors: [
        'Aircraft Design and Engineering',
        'Computer Science and Technology',
        'Mechanical Engineering',
        'Electrical and Electronic Engineering',
        'International Business',
        'Civil Engineering'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '400 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '22,900 - 23,900 CNY/Year' },
      { item: 'Hostel Fee', cost: '4,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '100-600 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'NUAA Scholarship Policy',
        type: 'Mixed',
        amount: 'Up to 100% (1st Year)',
        details: [
          'NUAA Fly High Scholarship (Only 1st Year): 100% Tuition Free',
          'Nanjing Government Scholarship: One time payment of 10,000 CNY'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Scholarship levels adjusted annually based on performance.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'scut',
    name: "South China University of Technology (SCUT)",
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/5/5e/South_China_University_of_Technology_Logo_%28Since_2022%29.svg/500px-South_China_University_of_Technology_Logo_%28Since_2022%29.svg.png',
    country: 'China',
    city: "Guangzhou",
    location: "Guangzhou City, Guangdong Province, China",
    rankings: {},
    badges: [
      'U.S.News: 166',
      'Times Higher Edu: 251-300',
      'QS Rank: 377',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '26,000 CNY/Year',
      majors: [
        'Computer Science and Technology',
        'International Trade and Economics'
      ]
    },
    fees: [
      { item: 'Registration Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '26,000 CNY/Year' },
      { item: 'Accommodation Fee', cost: '12-27 CNY/Day' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '800 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'SCUT Scholarship Policy',
        type: 'Tiered',
        amount: 'Up to 100% Free',
        details: [
          'Type A: 100% Tuition FREE for 4 Years',
          'Type B: 50% Tuition FREE for 4 Years (Pay 13,000 CNY/Year)',
          'Type C: 50% Tuition FREE for 2 Years (Pay 13,000 CNY/Year)',
          'Type D: Guangdong Government Scholarship 10,000 CNY/Year (Pay 16,000 CNY/Year)'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 30th, 2026 (Result in July)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'sues',
    name: "Shanghai University of Engineering Science (SUES)",
    logo: 'https://www.sues.edu.cn/_upload/tpl/03/2c/812/template812/images/logo_foot.png',
    country: 'China',
    city: "Shanghai",
    location: "Shanghai City, China",
    rankings: {},
    badges: [
      'U.S.News: 1542',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '20,000 - 23,000 CNY/Year',
      majors: [
        'Textile Engineering',
        'Artificial Intelligence (AI)',
        'International Economics and Trade',
        'Medicinal Chemistry'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '400 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '20,000 - 23,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '1,200 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'SUES Scholarship Policy',
        type: 'Full',
        amount: '100% Free',
        details: [
          'Tuition Fee: 100% Free',
          'Insurance Fee: 100% Free',
          'Hostel Fee: 1,200 CNY/Year'
        ],
        condition: 'Student have to pass HSK3 in First Year to continue 2nd Year scholarship and HSK4 in 2nd year to continue next year'
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'Duration: 4 Years',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'njupt',
    name: "Nanjing University of Posts and Telecommunications (NJUPT)",
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/4/44/Logo_of_NJUPT.svg/400px-Logo_of_NJUPT.svg.png',
    country: 'China',
    city: "Nanjing",
    location: "Nanjing City, Jiangsu Province, China",
    rankings: {},
    badges: [
      'U.S.News: 714',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '18,000 CNY/Year',
      majors: [
        'Electronic Information Engineering',
        'Computer Science and Technology',
        'Business Administration',
        'Electronic Commerce'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '800 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '18,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '1,500 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '430 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'NJUPT International Students Scholarship',
        type: 'Tiered',
        amount: 'Up to 100% Free',
        details: [
          '1st Year: 100% Tuition Free',
          'From 2nd Year (Top 50%): 100% Tuition Free',
          'From 2nd Year (Next 30%): Pay 6,000 CNY',
          'From 2nd Year (Last 20%): Pay 11,500 CNY'
        ]
      },
      {
        title: 'Nanjing Government Scholarship',
        type: 'Reward',
        amount: '10,000 CNY',
        details: [
          'Every year top students will get 10,000 CNY one-time payment.'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'From Second Year levels adjusted based on ranking.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'jsnu',
    name: 'Jiangsu Normal University (JSU)',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/3/39/Jiangsu_Normal_University_logo.jpg',
    country: 'China',
    city: 'Xuzhou',
    location: 'Xuzhou City, Jiangsu Province, China',
    rankings: {},
    badges: [
      'Times Higher Edu: 1501+',
      'U.S.News: 1212',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '14,000 CNY/Year',
      majors: [
        'Software Engineering',
        'Mechanical Engineering',
        'Electrical Engineering and Automation',
        'International Economics and Trade'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '14,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '1,500-3,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'Type A',
        type: 'Full',
        amount: '100% Free',
        details: [
          'Tuition Fee: 100% Free',
          'Hostel Fee: 1,500-3,000 CNY/Year'
        ]
      },
      {
        title: 'Type B',
        type: 'Partial',
        amount: '7,000 CNY/Year',
        details: [
          'Tuition Fee: 7,000 CNY/Year',
          'Hostel Fee: 1,500-3,000 CNY/Year'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'All scholarship winners must pass an annual review.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'cczu',
    name: 'Changzhou University (CCZU)',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/8/86/Logo_of_Changzhou_University_%282021%29.svg/500px-Logo_of_Changzhou_University_%282021%29.svg.png',
    country: 'China',
    city: 'Changzhou',
    location: 'Changzhou City, Jiangsu Province, China',
    rankings: {
      world: 1201, // Using first number for simplicity
      national: 1314 // Using as national for now or omit if not matching schema
    },
    badges: [
      'Times Higher Edu: 1201-1500',
      'U.S.News: 1314',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '15,000 CNY/Year',
      majors: [
        'Chemical Engineering & Technology',
        'Petroleum Engineering',
        'Computer Science & Technology',
        'International Economy and Trade'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '500 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '15,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '1,750-5,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '430 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'Type A',
        type: 'Full',
        amount: '100% Free',
        details: [
          'Tuition Fee: 100% Free',
          'Hostel Fee: 1,750 CNY/Year'
        ]
      },
      {
        title: 'Type B',
        type: 'Partial',
        amount: '5,000 CNY/Year',
        details: [
          'Tuition Fee: 5,000 CNY/Year',
          'Hostel Fee: 1,750 CNY/Year'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'All scholarship winners must pass an annual review.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 85',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'ctgu',
    name: 'China Three Gorges University (CTGU)',
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/ee/China_Three_Gorges_Logo.png',
    country: 'China',
    city: 'Yichang',
    location: 'Yichang City, Hubei Province, China',
    rankings: {
      world: 851,
      national: 1612
    },
    badges: [
      'QS Rank: 851-900',
      'U.S.News: 1612',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '10,000-15,000 CNY/Year',
      majors: [
        'Aeronautical Engineering',
        'Computer Science and Technology',
        'Business Administration',
        'Pharmacy',
        'Electrical Engineering and Automation',
        'Automation',
        'Civil Engineering',
        'Mechanical Design, Manufacturing & Automation',
        'Nursing',
        'Physical Education',
        'New Energy Materials and Devices',
        'Opto-Electronics Information Science and Engineering',
        'Mathematics',
        'Nuclear Engineering and Nuclear Technology',
        'Physics',
        'Sports Training'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '400 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '10,000-15,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '1,800-3,600 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '100-600 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'Hubei Provincial Government Scholarship',
        type: 'Full',
        amount: '100% Tuition Free',
        details: [
          'Tuition Fee: 100% Free',
          'Academic review required every year for renewal.'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable',
      'Scholarship level adjusted based on academic performance.'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'cpu',
    name: 'China Pharmaceutical University (CPU)',
    logo: 'https://upload.wikimedia.org/wikipedia/en/8/8c/China_Pharmaceutical_University_logo.png',
    country: 'China',
    city: 'Nanjing',
    location: 'Nanjing City, Jiangsu Province, China',
    rankings: {
      world: 847,
      national: 1001
    },
    badges: [
      'QS Rank: 61 (Subject)',
      'Times Higher Edu: 1001-1200',
      'U.S.News: 847',
      'Bachelor Degree',
      'English Medium'
    ],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '19,000-25,000 CNY/Year',
      majors: [
        'International Economics and Trade',
        'Pharmacy',
        'Clinical Pharmacy'
      ]
    },
    fees: [
      { item: 'Application Fee', cost: '400 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '19,000-25,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '4,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '600-800 CNY/Year' },
      { item: 'Medical Fee', cost: '300-400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'CPU President Scholarship - Category 1',
        type: 'Full',
        amount: '100% Tuition Free',
        details: [
          'Tuition Fee: 100% Free',
          'Applicable Major: International Economics and Trade'
        ]
      },
      {
        title: 'CPU President Scholarship - Category 2',
        type: 'Partial',
        amount: 'Payable 5,000 CNY/Year',
        details: [
          'Tuition Fee: 5,000 CNY/Year',
          'Applicable Majors: Pharmacy, Clinical Pharmacy'
        ]
      },
      {
        title: 'Nanjing Government Scholarship',
        type: 'Reward',
        amount: '10,000 CNY',
        details: [
          'One-time payment of 10,000 CNY'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'All scholarship winners must pass an annual review.',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'suep',
    name: 'Shanghai University of Electric Power (SUEP)',
    logo: 'https://www.sues.edu.cn/_upload/tpl/03/2c/812/template812/images/logo_foot.png',
    country: 'China',
    city: 'Shanghai',
    location: 'Shanghai City, China',
    rankings: {},
    badges: ['U.S.News: 1651', 'Bachelor Degree', 'English Medium'],
    degree: ['Bachelor'],
    taught: ['English'],
    intake: ['Fall 2026'],
    details: {
      tuition: '20,000 CNY/Year',
      majors: [
        'International Economics and Trade'
      ]
    },
    fees: [
      { item: 'Registration Fee', cost: '600 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '20,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '4,500 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'SGS Class A',
        type: 'Full',
        amount: '100% Free + Stipend',
        details: [
          'Tuition Fee: 100% Free',
          'Insurance Fee: 100% Free',
          'Hostel Fee: 100% Free',
          'Stipend: 12,000 CNY/Year'
        ]
      },
      {
        title: 'SGS Class B',
        type: 'Full',
        amount: '100% Free',
        details: [
          'Tuition Fee: 100% Free',
          'Insurance Fee: 100% Free',
          'Hostel Fee: 4,500 CNY/Year'
        ]
      },
      {
        title: 'University University',
        type: 'Partial',
        amount: 'Partial Coverage',
        details: [
          'Tuition Fee: 8,000 CNY/Year',
          'Insurance Fee: 100% Free',
          'Hostel Fee: 4,500 CNY/Year'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 85',
      'EFSET or MOI Acceptable'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'sdu',
    name: 'Shanghai Dianji University (SDU)',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/9/9b/Shanghai_Dianji_University_Emblem.svg/500px-Shanghai_Dianji_University_Emblem.svg.png',
    location: 'Shanghai City, China',
    country: 'China',
    city: 'Shanghai',
    intake: ['Fall 2026'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {
      world: 1401
    },
    badges: [
      'QS Rank: 1401-1500',
      'Bachelor Degree',
      'English Medium'
    ],
    details: {
      majors: [
        'Automation',
        'Software Engineering',
        'International Trade and Economics',
        'Marketing'
      ],
      tuition: '20,000 CNY/Year'
    },
    fees: [
      { item: 'Application Fee', cost: '400 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '20,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '9,600 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'SDU Scholarship Class A',
        type: 'Full',
        amount: 'Tuition 100% Free',
        details: [
          'Tuition Fee: 100% Free',
          'Hostel Fee: 9,600 CNY/Year (Student Pays)'
        ]
      },
      {
        title: 'SDU Scholarship Class B',
        type: 'Partial',
        amount: 'Tuition 7,500 CNY/Year',
        details: [
          'Tuition Fee: 7,500 CNY/Year',
          'Hostel Fee: 9,600 CNY/Year (Student Pays)'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 85',
      'EFSET or MOI Acceptable',
      'Need to submit study plan and self-introduction video of 3-4 minutes'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance', 'Study Plan', 'Self-introduction Video'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'sspu',
    name: 'Shanghai Polytechnic University (SSPU)',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/4/42/Shanghai_Polytechnic_University_logo.jpg',
    location: 'Shanghai City, China',
    country: 'China',
    city: 'Shanghai',
    intake: ['Fall 2026'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {},
    badges: [
      'Bachelor Degree',
      'English Medium'
    ],
    details: {
      majors: [
        'International Business',
        'E-Commerce',
        'Public Relations',
        'English Language and Literature'
      ],
      tuition: '20,000 CNY/Year'
    },
    fees: [
      { item: 'Application Fee', cost: '600 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '20,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '40 CNY/Day' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'SSPU Scholarship Policy',
        type: 'Full',
        amount: '100% Free',
        details: [
          'Tuition Fee: 100% Free',
          'Insurance Fee: 100% Free',
          'Hostel Fee: 40 CNY/Day (Student Pays)'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-25',
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 85',
      'EFSET or MOI Acceptable',
      'Need to submit study plan and self-introduction video of 3-4 minutes'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance', 'Study Plan', 'Self-introduction Video'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'hdu',
    name: 'Hangzhou Dianzi University (HDU)',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/8/85/HDU_seal.svg/500px-HDU_seal.svg.png',
    location: 'Hangzhou City, Zhejiang Province, China',
    country: 'China',
    city: 'Hangzhou',
    intake: ['Fall 2026'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {},
    badges: [
      'QS Rank: 1501+',
      'Times Higher Edu: 1201-1500',
      'U.S.News: 1435',
      'Bachelor Degree',
      'English Medium',
      'Top Ranked'
    ],
    details: {
      majors: [
        'Computer Science & Technology',
        'Materials Science & Engineering',
        'Telecommunication Engineering',
        'Artificial Intelligence (AI)',
        'Mechanical Engineering',
        'Software Engineering',
        'Electronic & Information Engineering',
        'Business Administration (BBA)',
        'Digital Economy (International Economics & Trade)'
      ],
      tuition: '22,000 CNY/Year'
    },
    fees: [
      { item: 'Application Fee', cost: '1000 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '22,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '5,400 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '300-400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'First Class Scholarship',
        type: 'Full',
        amount: '100% Free',
        details: [
          'Tuition Fee: 100% Free',
          'Accommodation Fee: 100% Free'
        ]
      },
      {
        title: 'Second Class Scholarship',
        type: 'Partial',
        amount: 'Tuition Free',
        details: [
          'Tuition Fee: 100% Free',
          'Accommodation Fee: Student Pays (5,400 CNY/Year)'
        ]
      }
    ],
    notes: [
      'Age Limit: 18-30',
      'Requirements: HSC 4.50+',
      'IELTS: 5.5 or DET: 95',
      'EFSET or MOI Acceptable',
      'University will review the scholarship every year',
      'Need to submit study plan and self-introduction video of 3-4 minutes'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance', 'Study Plan', 'Self-introduction Video'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'ncepu',
    name: 'North China Electric Power University (NCEPU)',
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/5d/North_China_Electric_Power_University_logo.png',
    location: 'Beijing City, China',
    country: 'China',
    city: 'Beijing',
    intake: ['Fall 2026'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {},
    badges: [
      'QS Rank: 451-500',
      'Times Higher Edu: 801-1000',
      'U.S.News: 703',
      'Bachelor Degree',
      'English Medium',
      'Top Ranked'
    ],
    details: {
      majors: [
        'Electrical Engineering',
        'Business Administration (BBA)',
        'Mechanical Engineering',
        'New Energy Science & Engineering'
      ],
      tuition: '22,000 CNY/Year'
    },
    fees: [
      { item: 'Application Fee', cost: '600 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '22,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '9,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '300-400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'International Students Scholarship',
        type: 'Partial',
        amount: 'Tuition Free',
        details: [
          'Tuition Fee: 100% Free',
          'Hostel Fee: 9,000 CNY/Year'
        ]
      }
    ],
    notes: [
      'Requirements: HSC 4.50+',
      'Age Limit: 18-28',
      'From Second Year: Scholarship amount depends on Academic Performance',
      'Admission Notice within 5 Days and JW202 within 10 Days'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'lyu',
    name: 'Linyi University (LYU)',
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/0f/Linyi_university_logo.jpg',
    location: 'Linyi City, Shandong Province, China',
    country: 'China',
    city: 'Linyi',
    intake: ['Fall 2026'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {},
    badges: [
      'CWUR Rank: 1496',
      'Bachelor Degree',
      'English Medium',
      'Multiple Scholarship Tiers'
    ],
    details: {
      majors: [
        'E-Commerce',
        'Civil Engineering',
        'Computer Science and Technology',
        'International Business Trade',
        'Visual Communication Design',
        'Medial Communication Design'
      ],
      tuition: '12,000 CNY/Year'
    },
    fees: [
      { item: 'Application Fee', cost: '400 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '12,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '2,880 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '320 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: '1st Class Scholarship',
        type: 'Full Tuition',
        amount: '100% Free',
        details: [
          'Tuition Fee: 100% Free'
        ]
      },
      {
        title: '2nd Class Scholarship',
        type: 'Partial',
        amount: '4,000 CNY/Year',
        details: [
          'Tuition Fee: 4,000 CNY/Year (Student Pays)'
        ]
      },
      {
        title: '3rd Class Scholarship',
        type: 'Partial',
        amount: '7,000 CNY/Year',
        details: [
          'Tuition Fee: 7,000 CNY/Year (Student Pays)'
        ]
      }
    ],
    notes: [
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'Age Limit: 18-25',
      'Performance Bonus: 2nd to 4th Year have a chance to get additional 5,000/year',
      'Deadline for Application: May 30th, 2026 (Depends on Seats)'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'hbust',
    name: 'Hebei University of Science and Technology (HBUST)',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/8/81/HebeikedaLOGO.jpg',
    location: 'Shijiazhuang, Hebei Province, China',
    country: 'China',
    city: 'Shijiazhuang',
    intake: ['Fall 2026'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {},
    badges: [
      'U.S.News Rank: 2130',
      'Bachelor Degree',
      'English Medium'
    ],
    details: {
      majors: [
        'Computer Science and Technology',
        'Civil Engineering',
        'Mechanical Engineering',
        'International Trade and Economics',
        'Electrical Engineering and Automation',
        'Environmental Engineering',
        'Water Supply and Drainage'
      ],
      tuition: '4,900 CNY/Year'
    },
    fees: [
      { item: 'Application Fee', cost: '500 CNY/Year' },
      { item: 'Registration Fee', cost: '500 CNY/Year' },
      { item: 'Tuition Fee', cost: '4,900 CNY/Year' },
      { item: 'Hostel Fee', cost: '1,200 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '100-400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'Academic Scholarship',
        type: 'Partial',
        amount: '5,000 - 8,000 CNY',
        details: [
          'From Second Year: All Students will get scholarship of 5,000-8,000 CNY'
        ]
      }
    ],
    notes: [
      'Requirement: HSC 4.50+',
      'Age Limit: 18-25',
      'Deadline: June 30th, 2025 (Depends on Seats)',
      'High potential for very low cost from 2nd year onwards'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 30th, 2025 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'hcnu',
    name: 'Hechi University (HCNU)',
    logo: 'https://www.hcnu.edu.cn/logo/logo.png',
    location: 'Hechi City, Guangxi Province, China',
    country: 'China',
    city: 'Hechi',
    intake: ['Fall 2026'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {},
    badges: [
      'Bachelor Degree',
      'English Medium',
      'Excellence Bonus'
    ],
    details: {
      majors: [
        'Business English',
        'Computer Science & Technology',
        'Trade Economics'
      ],
      tuition: '6,500 CNY/Year'
    },
    fees: [
      { item: 'Registration Fee', cost: '400 CNY/Year' },
      { item: 'Tuition Fee', cost: '6,500 CNY/Year' },
      { item: 'Accommodation Fee', cost: '2,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'Standard Scholarship',
        type: 'Partial',
        amount: 'Tuition & Hostel Discount',
        details: [
          'Tuition Fee: 6,500 CNY/Year (Discounted)',
          'Hostel Fee: 2,000 CNY/Year (Discounted)'
        ]
      },
      {
        title: 'Excellence Scholarship',
        type: 'Incentive',
        amount: '4,000 CNY/Year',
        details: [
          'Excellent results holder will get extra scholarship 4,000 CNY/Year'
        ]
      }
    ],
    notes: [
      'Requirement: HSC 3.50+',
      'Age Limit: 18-22',
      'Deadline: June 30th, 2025 (Depends on Seats)',
      'Excellent students can reduce their net cost significantly'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 30th, 2025 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'hafa',
    name: 'Hebei Academy of Fine Arts (HAFA)',
    logo: 'https://en.hbafa.com/img/logo.png',
    location: 'Shijiazhuang, Hebei Province, China',
    country: 'China',
    city: 'Shijiazhuang',
    intake: ['Fall 2026'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {},
    badges: [
      'Bachelor Degree',
      'English Medium',
      'Art & Design Specialty',
      'Harry Potter School'
    ],
    details: {
      majors: [
        'Architecture',
        'Animation',
        'Film & TV Photography & Production',
        'Drawing Painting',
        'Art Education',
        'Product Design',
        'Digital Media Art',
        'Apparel & Accessories Design',
        'Jewelry and Accessory Design'
      ],
      tuition: '7,500 CNY/Year (After 75% Scholarship)'
    },
    fees: [
      { item: 'Application Fee', cost: '500 CNY/Year' },
      { item: 'Tuition Fee', cost: '7,500 CNY/Year' },
      { item: 'Hostel Fee', cost: '2,000 - 3,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '100-400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'Hebei Provincial / Academy Scholarship',
        type: 'Partial',
        amount: '75% OFF',
        details: [
          'Tuition Fee Reduced to 7,500 CNY/Year',
          'Renewal: Just Pass on the Exam & Regular Attendance'
        ]
      }
    ],
    notes: [
      'Requirement: HSC 3.50+',
      'Age Limit: 18-24',
      'Nickname: "Harry Potter School in China"',
      'Unique Campus architecture',
      'Scholarship covers 2nd to 4th year automatically with basic attendance/passing grades'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'hut',
    name: 'Hubei University of Technology (HUT)',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/1/1b/Hebei_University_of_Technology_Badge.svg/500px-Hebei_University_of_Technology_Badge.svg.png',
    location: 'Wuhan City, Hubei Province, China',
    country: 'China',
    city: 'Wuhan',
    intake: ['Fall 2026'],
    degree: ['Bachelor'],
    taught: ['English'],
    rankings: {},
    badges: [
      'U.S.News Rank: 1271',
      'Bachelor Degree',
      'English Medium',
      'Wuhan Location'
    ],
    details: {
      majors: [
        'Computer Science and Technology',
        'Software Engineering',
        'Civil Engineering',
        'Mechanical Engineering and Automation',
        'Electrical Engineering and Automation',
        'International Trade and Economics',
        'Pharmaceutical Engineering'
      ],
      tuition: '7,000 CNY/Year'
    },
    fees: [
      { item: 'Registration Fee', cost: '400 CNY/Year' },
      { item: 'Tuition Fee', cost: '7,000 CNY/Year' },
      { item: 'Accommodation Fee', cost: '1,500 / 3,000 / 6,000 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '400-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' }
    ],
    scholarships: [
      {
        title: 'Excellence Scholarship',
        type: 'Incentive',
        amount: 'Up to 15,000 CNY',
        details: [
          'Excellent results holder will get extra scholarship 3,000 / 5,000 / 10,000 / 15,000 CNY',
          'Tuition Fee: 7,000 CNY/Year (Standard)',
          'Hostel Fee: 3,000 CNY/Year (Standard)'
        ]
      }
    ],
    notes: [
      'Requirement: HSC 4.50+',
      'Age Limit: 18-25',
      'Deadline: June 30th, 2025 (Depends on Seats)',
      'Highly competitive and prestigious university in Wuhan',
      'Scholarship amount determined by academic performance'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 30th, 2025 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'zzu',
    name: 'Zhengzhou University (ZZU)',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Zhengzhou_University_logo.png/220px-Zhengzhou_University_logo.png',
    location: 'Zhengzhou City, Henan Province, China',
    country: 'China',
    city: 'Zhengzhou',
    intake: ['Fall 2026'],
    degree: ['Bachelor', 'MBBS'],
    taught: ['English'],
    rankings: {},
    badges: [
      'QS Rank: 618',
      'Times Higher Edu: 601-800',
      'U.S.News: 203',
      'Bachelor Degree (MBBS)',
      'English Medium',
      'MBBS (6 Years)'
    ],
    details: {
      majors: [
        'MBBS (6 Years)'
      ],
      tuition: '36,000 CNY/Year'
    },
    programs: {
      mbbs: {
        majors: ['MBBS (6 Years)'],
        tuition: '36,000 CNY/Year',
        fees: [
          { item: 'Application Fee', cost: '800 CNY (Non-refundable)' },
          { item: 'Tuition Fee', cost: '36,000 CNY/Year' },
          { item: 'Hostel Fee', cost: '5,000 CNY/Year' },
          { item: 'Off-campus Hostel', cost: '2,500 – 4,000 RMB/year' },
          { item: 'Insurance Fee', cost: '1,000 CNY/Year' },
          { item: 'Medical Fee', cost: '100-600 CNY (1st Year only)' },
          { item: 'Residence Permit Fee', cost: '430 CNY/Year' }
        ]
      }
    },
    fees: [
      { item: 'Application Fee', cost: '800 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '36,000 CNY/Year' },
      { item: 'Hostel Fee', cost: '5,000 CNY/Year' },
      { item: 'Off-campus Hostel', cost: '2,500 – 4,000 RMB/year' },
      { item: 'Insurance Fee', cost: '1,000 CNY/Year' },
      { item: 'Medical Fee', cost: '100-600 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '430 CNY/Year' }
    ],
    scholarships: [],
    notes: [
      'Requirements: HSC 4.50+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable',
      'Age Limit: 18-23',
      'Deadline for Application: May 30th, 2026 (Depends on Seats)'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'ntu',
    name: 'Nantong University (NTU)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Nantong_University_name.svg/500px-Nantong_University_name.svg.png',
    location: 'Nantong City, Jiangsu Province, China',
    country: 'China',
    city: 'Nantong',
    intake: ['Fall 2026'],
    degree: ['Bachelor', 'MBBS', 'Masters'],
    taught: ['English'],
    rankings: {},
    badges: [
      'QS Rank: 851-900',
      'CWUR: 770',
      'Bachelor Degree (MBBS/BDS)',
      'English Medium',
      '6 Years MBBS / 5 Years BDS'
    ],
    details: {
      majors: [
        'Clinical Medicine-MBBS (6 years)',
        'Dental Surgery-BDS (5 years)'
      ],
      tuition: '26,000 CNY/Year'
    },
    programs: {
      mbbs: {
        majors: ['Clinical Medicine-MBBS (6 years)', 'Dental Surgery-BDS (5 years)'],
        tuition: '26,000 CNY/Year',
        fees: [
          { item: 'Application Fee', cost: '600 CNY (Non-refundable)' },
          { item: 'Tuition Fee', cost: '26,000 CNY/Year' },
          { item: 'Accommodation Fee', cost: '2,800 - 4,000 CNY/Year (Off Campus-4 Beds Room)' },
          { item: 'Insurance Fee', cost: '800 CNY/Year' },
          { item: 'Medical Fee', cost: '100-500 CNY (1st Year only)' },
          { item: 'Residence Permit Fee', cost: '800 CNY/Year' },
          { item: 'Textbook Fee', cost: '1200 CNY/Year' },
          { item: 'JW202 Deposit', cost: '2,600 CNY (Mandatory)' }
        ]
      },
      masters: {
        majors: [
          'International Business',
          'Biological Medicine Engineering',
          'Land Resource Management',
          'Public Health and Preventive Medicine',
          'Applied Economics',
          'Sports Pedagogy and Training',
          'Administrative Management',
          'Biology',
          'English Language and Literature',
          'Medical Informatics',
          'Botany',
          'Fine Arts',
          'Mechanical Engineering',
          'Information and Communication Engineering',
          'Rehabilitation Therapeutics',
          'Clothing Design and Engineering',
          'Textile Engineering',
          'Control Science and Engineering'
        ],
        tuition: '26,000 CNY/Year',
        fees: [
          { item: 'Application Fee', cost: '600 CNY (Non-refundable)' },
          { item: 'Tuition Fee', cost: '26,000 CNY/Year' },
          { item: 'Accommodation Fee', cost: '2,800 CNY/Year (Off Campus-4 Beds Room)' },
          { item: 'Insurance Fee', cost: '800 CNY/Year' },
          { item: 'Medical Fee', cost: '100-500 CNY (1st Year only)' },
          { item: 'Residence Permit Fee', cost: '800 CNY/Year' },
          { item: 'Enrollment Deposit', cost: '2,600 CNY (Refundable)' }
        ],
        scholarships: [
          {
            title: 'NTU University Scholarship (Type A)',
            amount: 'Full Coverage + Stipend',
            details: [
              'Tuition Fee: 100% Free',
              'Hostel Fee: 100% Free',
              'Stipend: 500 CNY/Month'
            ]
          },
          {
            title: 'NTU University Scholarship (Type B)',
            amount: 'Full Coverage',
            details: [
              'Tuition Fee: 100% Free',
              'Hostel Fee: 100% Free'
            ]
          }
        ]
      }
    },
    fees: [
      { item: 'Application Fee', cost: '600 CNY (Non-refundable)' },
      { item: 'Tuition Fee', cost: '26,000 CNY/Year' },
      { item: 'Accommodation Fee', cost: '2,800 - 4,000 CNY/Year (Off Campus-4 Beds Room)' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '100-500 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '800 CNY/Year' },
      { item: 'Textbook Fee', cost: '1200 CNY/Year' },
      { item: 'JW202 Deposit', cost: '2,600 CNY (Mandatory)' }
    ],
    scholarships: [],
    notes: [
      'Requirements: HSC 4.50+',
      'IELTS: 5.5 or DET: 95',
      'CSCA Required',
      'EFSET or MOI Acceptable',
      'Age Limit: 18-24',
      '[ Student have to deposit 2,600 CNY for getting JW202 ]',
      'Deadline for Application: May 30th, 2026 (Depends on Seats)'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'May 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  },
  {
    id: 'xzmu',
    name: 'Xuzhou Medical University (XZMU)',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/3/37/Xuzhou_Medical_University_logo.jpg',
    location: 'Xuzhou City, Jiangsu Province, China',
    country: 'China',
    city: 'Xuzhou',
    intake: ['Fall 2026'],
    degree: ['MBBS'],
    taught: ['English'],
    rankings: {
      world: 1463
    },
    badges: [
      'Times Rank: 1201-1500',
      'U.S.News: 1463',
      'Medicine (MBBS/BDS)',
      'English Medium',
      'MBBS (6 Years)'
    ],
    details: {
      majors: [
        'MBBS (6 Years)',
        'Nursing (4 Years)',
        'Dental Surgery (5 Years)'
      ],
      tuition: '28,000-33,000 CNY/Year'
    },
    programs: {
      mbbs: {
        majors: ['MBBS (6 Years)', 'Nursing (4 Years)', 'Dental Surgery (5 Years)'],
        tuition: '28,000/30,000/33,000 CNY/Year',
        fees: [
          { item: 'Application Fee', cost: '400 CNY/Year' },
          { item: 'Tuition Fee', cost: '28,000/30,000/33,000 CNY/Year' },
          { item: 'Accommodation Fee', cost: '4,800 CNY/Year' },
          { item: 'Insurance Fee', cost: '800 CNY/Year' },
          { item: 'Medical Fee', cost: '100-400 CNY (1st Year only)' },
          { item: 'Residence Permit Fee', cost: '400 CNY/Year' },
          { item: 'JW202 Deposit', cost: '5,200 CNY (Mandatory)' }
        ]
      }
    },
    fees: [
      { item: 'Application Fee', cost: '400 CNY/Year' },
      { item: 'Tuition Fee', cost: '28,000/30,000/33,000 CNY/Year' },
      { item: 'Accommodation Fee', cost: '4,800 CNY/Year' },
      { item: 'Insurance Fee', cost: '800 CNY/Year' },
      { item: 'Medical Fee', cost: '100-400 CNY (1st Year only)' },
      { item: 'Residence Permit Fee', cost: '400 CNY/Year' },
      { item: 'JW202 Deposit', cost: '5,200 CNY (Mandatory)' }
    ],
    scholarships: [],
    notes: [
      'Requirements: HSC 4.00+',
      'IELTS: 5.5 or DET: 95',
      'Age Limit: 18-25',
      '[ Student have to deposit 5,200 CNY for getting JW202 ]',
      'Deadline for Application: June 30th, 2026 (Depends on Seats)'
    ],
    documents: [
      'Passport', 'Photo', 'HSC Certificate', 'HSC Transcript', 'Medical Form', 'English Proficiency', 'Police Clearance'
    ],
    deadlines: {
      application: 'June 30th, 2026 (Depends on Seats)',
      startDate: 'September 2026'
    }
  }
];
