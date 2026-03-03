
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

        // Data for ZZU
        const zzuDoc = {
            slug: 'zzu',
            name: 'Zhengzhou University (ZZU)',
            location: 'Zhengzhou City, Henan Province, China',
            country: 'China',
            city: 'Zhengzhou',
            intake: ['Fall 2026'],
            degree: ['Bachelor', 'MBBS'],
            taught: ['English'],
            rankings: {
                world: 618
            },
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
            isActive: true
        };

        await collection.updateOne({ slug: 'zzu' }, { $set: zzuDoc }, { upsert: true });
        console.log('ZZU updated successfully!');

    } finally {
        await client.close();
    }
}

run().catch(console.error);
