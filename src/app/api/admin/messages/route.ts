import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { getRequiredString, jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

// POST - Send a message (admin or super_admin)
export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);

    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const payload = await readLimitedJson(request, 32 * 1024);
    const toUserId = getRequiredString(payload, 'toUserId', 100);
    const subject = getRequiredString(payload, 'subject', 200);
    const body = getRequiredString(payload, 'body', 5000);

    // Derive both sender and recipient details from authoritative DB records.
    const [sender, recipient] = await Promise.all([
      prisma.user.findUnique({ where: { id: decoded.userId }, select: { name: true } }),
      prisma.user.findUnique({ where: { id: toUserId }, select: { id: true, email: true, name: true } }),
    ]);

    if (!recipient) {
      return NextResponse.json({ message: 'Recipient user not found' }, { status: 404 });
    }

    const fromName = sender?.name || decoded.email;

    await prisma.message.create({
      data: {
        fromUserId: decoded.userId,
        fromName,
        toUserId: recipient.id,
        toEmail: recipient.email,
        toName: recipient.name,
        subject,
        body,
      }
    });

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Send message error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// GET - List messages (admin or super_admin)
export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);

    if (!decoded || !isAdminRole(decoded.role)) {
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
