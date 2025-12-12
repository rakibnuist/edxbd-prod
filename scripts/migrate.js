const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Hardcoded URI or read from .env.local if possible, but reading .env in pure Node script requires dotenv
// I'll grab it from process.env if available, or ask user?
// I will try to read .env.local manually to find the URI.

const envPath = path.resolve(__dirname, '../.env.local');
let uri = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match && match[1]) {
        uri = match[1].replace(/"/g, '').trim();
    }
} catch (e) {
    console.error('Could not read .env.local');
}

if (!uri) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

const universities = [
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
    }
];

async function run() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to DB");
        const db = client.db();
        // Use 'universityv2s' collection
        const col = db.collection('universityv2s');

        for (const uniData of universities) {
            const doc = {
                ...uniData,
                slug: uniData.id,
                isActive: true
            };
            delete doc.id;

            await col.updateOne(
                { slug: doc.slug },
                { $set: doc },
                { upsert: true }
            );
            console.log(`Migrated ${doc.name}`);
        }
        console.log("Done");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

run();
