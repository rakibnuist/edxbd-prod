import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin user already exists',
        email: existingAdmin.email,
        id: existingAdmin._id
      });
    }

    // Create admin user
    const adminEmail = 'admin@eduexpressint.com';
    const adminPassword = 'admin123';
    const adminName = 'Admin User';

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();

    return NextResponse.json({
      message: 'Admin user created successfully',
      email: adminEmail,
      id: adminUser._id
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}
