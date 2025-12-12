const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const universitySchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        location: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        intake: [String],
        degree: [String],
        taught: [String],
        rankings: {
            country: Number,
            world: Number,
            national: Number,
        },
        details: {
            majors: [String],
            tuition: String,
            tuitionDetails: [String],
        },
        fees: [{
            item: String,
            cost: String,
            notes: String,
        }],
        scholarships: [{
            title: String,
            category: String, // Renamed from 'type' to avoid keyword conflict
            details: [String],
            amount: String,
            condition: String,
        }],
        documents: [String],
        deadlines: {
            application: String,
            startDate: String,
        },
        notes: [String],
        badges: [String],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true, collection: 'universityv2s' }
);

const University = mongoose.models.UniversityV2 || mongoose.model('UniversityV2', universitySchema);

const newUniversities = [
    {
        name: "Nanjing University of Information Science and Technology",
        slug: "nanjing-university-of-information-science-and-technology",
        location: "Nanjing City",
        country: "China",
        city: "Nanjing",
        intake: ["September"],
        degree: ["Bachelor"],
        taught: ["English"],
        rankings: {},
        details: {
            majors: ["Computer Science And Technology", "Artificial Intelligence", "International Economics And Trade", "Electronic Information Engineering"],
            tuition: "15000 CNY/Year (Original)",
            tuitionDetails: []
        },
        fees: [
            { item: "Tuition Fees", cost: "15000 CNY/Year", notes: "Original" },
            { item: "Accommodation Fees", cost: "1500 CNY/Year", notes: "Four person in a room" },
            { item: "Medical Check Up", cost: "400 CNY/Year" },
            { item: "Medical Insurance", cost: "800 CNY/Year" },
            { item: "Visa", cost: "400 CNY/Year" }
        ],
        scholarships: [
            { title: "Type A (1st Year)", category: "Full", details: ["Full Tuition Fees Free"] },
            { title: "Type B (1st Year)", category: "Partial", details: ["50% Tuition Fees Free (Pay 7500 CNY/Year)"] }
        ],
        documents: [
            "Passport", "Picture", "Higher Secondary School Certificate and Transcript", "Health Check Up",
            "English Proficiency Certificate", "Non Criminal Record", "Bank Statement", "Application Form",
            "China Scholastic Competency Assessment (CSCA) Exam Score Report"
        ],
        deadlines: { application: "30th June 2026", startDate: "September 2026" },
        notes: [
            "From 2nd Year: Top 40% get 1st class scholarship, 41%-85% get 2nd class, Last 15% self-sponsored.",
            "Must pass all subjects, no violations, attend classes regularly."
        ]
    },
    {
        name: "Henan University of Technology",
        slug: "henan-university-of-technology",
        location: "Zhengzhou City",
        country: "China",
        city: "Zhengzhou",
        intake: ["September"],
        degree: ["Bachelor"],
        taught: ["English"],
        rankings: { country: 241, world: 1699 },
        details: {
            majors: ["International Economics and Trade", "Computer Science and Technology", "Bioengineering", "Pharmaceutical Engineering", "Vehicle Engineering", "Mechanical Engineering", "Intelligent Manufacturing Engineering", "Civil Engineering", "Chinese Language (1 Year)"],
            tuition: "Depends on major (16000-18000 CNY/Year Original)",
            tuitionDetails: [
                "Liberal Arts: 16000 CNY/Year",
                "Science and Engineering: 18000 CNY/Year"
            ]
        },
        fees: [
            { item: "Tuition & Accom (After Scholarship)", cost: "10000 CNY/Year", notes: "Quadruple room package" },
            { item: "Accommodation Fees (Original)", cost: "3600 - 12000 CNY/Year", notes: "Quad 3600, Double 7200, Single 12000" },
            { item: "Registration Fee", cost: "400 CNY", notes: "First year" },
            { item: "Resident Permit", cost: "800 CNY/Year" },
            { item: "Medical Check Up", cost: "450 CNY" }
        ],
        scholarships: [
            { title: "Scholarship Package", category: "Big Discount", details: ["Tuition and Accommodation Fee (Quadruple room): 10000 CNY/Year"] }
        ],
        documents: [
            "Passport", "Picture", "High School Certificate and Transcript", "Health Check Up",
            "Original Blood Test Report", "English Proficiency (TOEFL 72+ / IELTS 5.5+)", "Non-Criminal Record",
            "Bank Statement", "Study Plan", "Application Form",
            "China Scholastic Competency Assessment (CSCA) Exam Score Report"
        ],
        deadlines: { application: "30th June 2026", startDate: "September 2026" },
        notes: [
            "Deposit of 2000 CNY required within one week of pre-admission (offset against fees)."
        ]
    },
    {
        name: "Jianghan University",
        slug: "jianghan-university",
        location: "Wuhan City, Hubei Province",
        country: "China",
        city: "Wuhan",
        intake: ["September"],
        degree: ["Bachelor"],
        taught: ["English"],
        rankings: {},
        details: {
            majors: ["Business Administration", "International Economics & Trade"],
            tuition: "10,000 Yuan/Year (Reimbursed via Scholarship)",
            tuitionDetails: ["Full tuition fees must be paid upfront."]
        },
        fees: [
            { item: "Tuition Fees", cost: "10,000 CNY/Year", notes: "Paid upfront, reimbursed in 2nd semester" },
            { item: "Accommodation Fees", cost: "3400 CNY/Year", notes: "Double bed" },
            { item: "Insurance Fee", cost: "500 CNY/Year" },
            { item: "Book Fees", cost: "500 CNY" },
            { item: "Medical Fees", cost: "400 CNY", notes: "First Year only" }
        ],
        scholarships: [
            { title: "Full Scholarship (Reimbursement)", category: "Full", details: ["10,000 CNY scholarship deposited to bank account in 2nd semester"] }
        ],
        documents: [
            "Passport", "Photo", "Highest Academic Certificate and Transcript", "Health Check Up",
            "Non-Criminal Record", "Bank Statement", "Language Proficiency Certificate"
        ],
        deadlines: { application: "20th July 2026", startDate: "September 2026" },
        notes: [
            "Age Limit: 17-25",
            "To maintain scholarship: Min GPA 2.0, no violations."
        ]
    },
    {
        name: "Xuzhou Medical University",
        slug: "xuzhou-medical-university",
        location: "Xuzhou City, Jiangsu Province",
        country: "China",
        city: "Xuzhou",
        intake: ["September"],
        degree: ["Bachelor"],
        taught: ["English"],
        rankings: {},
        details: {
            majors: ["Clinical Medicine (6 years)", "Nursing (4 years)", "Dental Surgery(BDS) (5 years)"],
            tuition: "28000 - 33000 RMB/Year (Original)",
            tuitionDetails: [
                "Clinical Medicine: 33000 RMB/Year",
                "Nursing: 30000 RMB/Year",
                "Dental Surgery: 28000 RMB/Year"
            ]
        },
        fees: [
            { item: "Tuition Fee", cost: "28000-33000 RMB/Year" },
            { item: "Accommodation fees", cost: "4800 RMB/Year", notes: "Double room" },
            { item: "Registration fees", cost: "400 CNY" },
            { item: "Visa Extension fees", cost: "400 CNY/Year" },
            { item: "Health Check Up", cost: "500 CNY" },
            { item: "Insurance fees", cost: "800 CNY/Year" },
            { item: "Seat Deposit", cost: "5200 CNY", notes: "Non-refundable, used for reg + insurance" }
        ],
        scholarships: [
            { title: "Clinical Medicine Type A", category: "Full", details: ["Free tuition fees (50% of students)"] },
            { title: "Clinical Medicine Type B", category: "Big Discount", details: ["50% tuition free (Pay 16500 RMB/Year) (30% of students)"] },
            { title: "Clinical Medicine Type C", category: "Partial", details: ["25% tuition free (Pay 24750 RMB/Year) (20% of students)"] },
            { title: "Nursing Type A", category: "Full", details: ["Free tuition fees (50% Coverage)"] },
            { title: "Nursing Type B", category: "Big Discount", details: ["Pay 5000 RMB/year (30% Coverage)"] },
            { title: "Nursing Type C", category: "Partial", details: ["Pay 10000 RMB/year (20% Coverage)"] },
            { title: "Dental Type A", category: "Big Discount", details: ["Pay 10000 RMB/year (20% Coverage)"] },
            { title: "Dental Type B", category: "Partial", details: ["Pay 15000 RMB/year (30% Coverage)"] },
            { title: "Dental Type C", category: "Partial", details: ["Pay 20000 RMB/year (40% Coverage)"] }
        ],
        documents: [
            "Passport", "Picture", "Higher Secondary School Certificate and Transcript", "Health Check Up",
            "English Proficiency Certificate", "Non Criminal Record", "Bank Statement",
            "English self-introduction video", "Application Form"
        ],
        deadlines: { application: "30th June 2026", startDate: "September 2026" },
        notes: [
            "Age: 16-25",
            "Applicants under 18 need guardian letter.",
            "Must pay CNY 5,200 deposit within 2 weeks of pre-admission."
        ]
    },
    {
        name: "Taiyuan University of Technology",
        slug: "taiyuan-university-of-technology",
        location: "Taiyuan, Shanxi",
        country: "China",
        city: "Taiyuan",
        intake: ["September"],
        degree: ["Bachelor"],
        taught: ["English"],
        rankings: {},
        details: {
            majors: ["Computer Science and Technology", "International Economics and Trade", "Civil Engineering", "Chinese Language (6000 Yuan / Year)"],
            tuition: "Bachelor: Free (Scholarship)",
            tuitionDetails: ["Original Tuition: 10000 CNY/Year"]
        },
        fees: [
            { item: "Tuition Fees", cost: "10000 CNY/Year", notes: "Waived for Bachelor" },
            { item: "Accommodation Fees", cost: "350-800 CNY/Month", notes: "Double 350, Single 800" },
            { item: "Insurance Fees", cost: "800 CNY/Year" },
            { item: "Resident Permit", cost: "400 CNY/Year" },
            { item: "Medical Check Up", cost: "415 CNY", notes: "1st Year only" },
            { item: "Registration Fees", cost: "500 CNY" }
        ],
        scholarships: [
            { title: "Bachelor Scholarship", category: "Full", details: ["Full Tuition Fees Free"] }
        ],
        documents: [
            "Passport", "Photo", "Higher Secondary School Certificate & Transcript", "English Proficiency Certificate",
            "Medical Health Report", "Non-Criminal Record", "Bank Statement", "2 Recommendation Letter", "Resume",
            "China Scholastic Competency Assessment (CSCA) Exam Score Report"
        ],
        deadlines: { application: "30th May 2026", startDate: "September 2026" },
        notes: []
    }
];

async function seedUniversities() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const uni of newUniversities) {
            await University.findOneAndUpdate(
                { slug: uni.slug },
                uni,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`Upserted: ${uni.name}`);
        }

        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding universities:', error);
        process.exit(1);
    }
}

seedUniversities();
