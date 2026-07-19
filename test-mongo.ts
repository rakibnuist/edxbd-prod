// @ts-nocheck
import mongoose from 'mongoose';
import 'dotenv/config';

async function testConnection() {
  try {
    const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
    if (!uri) throw new Error("No URI");
    console.log("Connecting to:", uri);
    await mongoose.connect(uri);
    console.log("Connected successfully");
    
    // Check universities
    const { default: University } = await import('./src/models/University.ts');
    const count = await University.countDocuments();
    console.log("Universities count:", count);
    
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
}

testConnection();
