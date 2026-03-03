const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

async function run() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db();
        const collection = db.collection('universityv2s');

        // Data for NJIT
        const njitDoc = {
            slug: 'njit',
            name: 'Nanjing Institute of Technology (NJIT)',
            logo: 'https://www.njit.edu.cn/images/logo.png',
            country: 'China',
            city: 'Nanjing',
            location: 'Nanjing City, Jiangsu Province, China',
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
            },
            isActive: true
        };

        // Replace entire document, ensuring old bachelor data and its structure is completely overwritten
        await collection.findOneAndReplace(
            { slug: 'njit' },
            njitDoc,
            { upsert: true }
        );
        console.log('NJIT updated successfully to Masters only!');

    } finally {
        await client.close();
    }
}

run().catch(console.error);
