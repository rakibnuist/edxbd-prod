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

        // Data for XZMU
        const xzmuDoc = {
            slug: 'xzmu',
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
            isActive: true
        };

        await collection.updateOne({ slug: 'xzmu' }, { $set: xzmuDoc }, { upsert: true });
        console.log('XZMU updated successfully!');

    } finally {
        await client.close();
    }
}

run().catch(console.error);
