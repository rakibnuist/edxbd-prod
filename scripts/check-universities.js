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

const UniversitySchema = new mongoose.Schema({}, { strict: false, collection: 'detaileduniversities' });
const University = mongoose.model('University', UniversitySchema);

const checkData = async () => {
    await connectDB();
    const count = await University.countDocuments();
    console.log(`detaileduniversities count: ${count}`);

    // Also check 'universities' collection just in case
    const UniversityAltSchema = new mongoose.Schema({}, { strict: false, collection: 'universities' });
    const UniversityAlt = mongoose.model('UniversityAlt', UniversityAltSchema);
    const countAlt = await UniversityAlt.countDocuments();
    console.log(`universities count: ${countAlt}`);

    process.exit(0);
};

checkData();
