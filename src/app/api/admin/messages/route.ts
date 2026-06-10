import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose, { Schema } from 'mongoose';
import User from '@/models/User';

// Inline Message model to avoid extra file dependencies
const MessageSchema = new Schema({
  fromUserId: { type: String, required: true },
  fromName: { type: String, required: true },
  toUserId: { type: String, required: true },
  toEmail: { type: String, required: true },
  toName: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  readAt: { type: Date, default: null },
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

// POST - Send a message (admin or super_admin)
export async function POST(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request);

    if (!decoded || (decoded.role !== 'super_admin' && decoded.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    await connectDB();

    const { toUserId, toEmail, toName, subject, body } = await request.json();

    if (!toUserId || !toEmail || !subject || !body) {
      return NextResponse.json({ message: 'toUserId, toEmail, subject, and body are required' }, { status: 400 });
    }

    // Retrieve sender's display name from User database
    const sender = await User.findById(decoded.userId);
    const fromName = sender ? sender.name : (decoded.email || 'Admin');

    const message = new Message({
      fromUserId: decoded.userId,
      fromName,
      toUserId,
      toEmail,
      toName,
      subject,
      body,
    });

    await message.save();

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// GET - List messages (admin or super_admin)
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request);

    if (!decoded || (decoded.role !== 'super_admin' && decoded.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    await connectDB();

    const messages = await Message.find({ fromUserId: decoded.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
