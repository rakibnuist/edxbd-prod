const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load env vars
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const UniversitySchema = new mongoose.Schema({}, { strict: false, collection: 'universityv2s' });
const University = mongoose.model('UniversityV2', UniversitySchema);

const sampleUniversities = [
    {
        name: "Zhejiang University",
        slug: "zhejiang-university",
        location: "Hangzhou, China",
        country: "China",
        city: "Hangzhou",
        intake: ["September"],
        degree: ["Bachelor", "Masters", "PhD"],
        taught: ["English", "Chinese"],
        rankings: {
            world: 42,
            national: 3
        },
        details: {
            majors: ["Computer Science", "Clinical Medicine", "Civil Engineering", "International Business"],
            tuition: "$4,500 - $6,500 / year",
            tuitionDetails: ["Tuition: 30,000 RMB/year", "Accommodation: 8,000 RMB/year"]
        },
        isActive: true,
        image: "/images/universities/zju.jpg"
    },
    {
        name: "Korea University",
        slug: "korea-university",
        location: "Seoul, South Korea",
        country: "South Korea",
        city: "Seoul",
        intake: ["March", "September"],
        degree: ["Bachelor", "Masters"],
        taught: ["English", "Korean"],
        rankings: {
            world: 74,
            national: 2
        },
        details: {
            majors: ["Business Administration", "Media & Communication", "Engineering", "Korean Language"],
            tuition: "$3,000 - $5,000 / semester",
            tuitionDetails: ["Tuition: 4,000,000 KRW/semester"]
        },
        isActive: true,
        image: "/images/universities/ku.jpg"
    },
    {
        name: "University of Debrecen",
        slug: "university-of-debrecen",
        location: "Debrecen, Hungary",
        country: "Hungary",
        city: "Debrecen",
        intake: ["September"],
        degree: ["Bachelor", "Masters", "PhD", "Foundation"],
        taught: ["English"],
        rankings: {
            world: 500,
            national: 2
        },
        details: {
            majors: ["General Medicine", "Dentistry", "Pharmacy", "Computer Science"],
            tuition: "$6,000 - $16,900 / year",
            tuitionDetails: ["Medicine: $16,900/year", "Engineering: $7,000/year"]
        },
        isActive: true,
        image: "/images/universities/debrecen.jpg"
    }
];

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data (optional, but good for idempotent seeding)
        // await University.deleteMany({}); 
        // console.log('Cleared existing universities');

        const count = await University.countDocuments();
        if (count > 0) {
            console.log(`Database already has ${count} universities. Skipping seed.`);
        } else {
            await University.insertMany(sampleUniversities);
            console.log('Successfully seeded universities!');
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    }

    process.exit(0);
};

seedData();
