import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST - Send a message (admin or super_admin)
export async function POST(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request);

    if (!decoded || (decoded.role !== 'super_admin' && decoded.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { toUserId, toEmail, toName, subject, body } = await request.json();

    if (!toUserId || !toEmail || !subject || !body) {
      return NextResponse.json({ message: 'toUserId, toEmail, subject, and body are required' }, { status: 400 });
    }

    // Retrieve sender's display name from User database
    const sender = await prisma.user.findUnique({ where: { id: decoded.userId } });
    const fromName = sender ? sender.name : (decoded.email || 'Admin');

    await prisma.message.create({
      data: {
        fromUserId: decoded.userId,
        fromName,
        toUserId,
        toEmail,
        toName,
        subject,
        body,
      }
    });

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

    const messages = await prisma.message.findMany({
      where: { fromUserId: decoded.userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
