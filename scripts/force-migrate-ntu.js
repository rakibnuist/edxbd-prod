
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

// We can't easily import TS files from JS script without setup, 
// so we'll read the TS file and extract the data or just use a simplified version for this specific update if needed.
// However, since I can see the content of partnershipUniversities.ts, I can just copy the relevant part for NTU and ZZU or the whole thing.
// Better: I'll use a hacky way to get the data or just use the API logic if I can.

// Actually, I'll just create a script that uses the existing migration logic but skips auth.
// I'll use ts-node or just node if I transpiled it.
// Since I want to be safe and fast, I'll just write a script that updates NTU specifically since that's what's needed.

async function run() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db();
        const collection = db.collection('universityv2s');

        // Data for NTU from my previous updates
        const ntuDoc = {
            slug: 'ntu',
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
            notes: [
                'Requirements: HSC 4.50+ / Bachelor Degree for Masters',
                'IELTS: 5.5 or DET: 95',
                'CSCA Required',
                'EFSET or MOI Acceptable',
                'Age Limit: 18-35 (Masters)',
                '[ Enrollment Deposit: 2,600 CNY per person (Refundable) ]',
                'Deadline for Application: May 30th, 2026 (Depends on Seats)'
            ],
            isActive: true
        };

        await collection.updateOne({ slug: 'ntu' }, { $set: ntuDoc }, { upsert: true });
        console.log('NTU updated successfully!');

    } finally {
        await client.close();
    }
}

run().catch(console.error);
