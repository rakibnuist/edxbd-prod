const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
}

const inspectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
        console.log('Database name:', mongoose.connection.db.databaseName);

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:');
        collections.forEach(c => console.log(' -', c.name));

        const collectionName = 'universityv2s';
        const count = await mongoose.connection.db.collection(collectionName).countDocuments();
        console.log(`\nCount in '${collectionName}': ${count}`);

        if (count > 0) {
            const doc = await mongoose.connection.db.collection(collectionName).findOne({});
            console.log('Sample document:', JSON.stringify(doc, null, 2));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // mongoose.disconnect();
        process.exit(0);
    }
};

inspectDB();
