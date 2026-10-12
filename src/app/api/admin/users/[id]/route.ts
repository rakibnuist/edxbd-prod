import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import type { Prisma } from '@prisma/client';
import { verifyTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';

const ALLOWED_ROLES = ['user', 'admin', 'super_admin'] as const;
const MIN_PASSWORD_LENGTH = 12;

// GET - Fetch single user (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyTokenFromRequest(request);

    if (!decoded || !['admin', 'super_admin'].includes(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Fetch user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update user (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyTokenFromRequest(request);

    if (!decoded || !['admin', 'super_admin'].includes(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { name, email, role, password } = await request.json();
    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.id !== decoded.userId && user.role !== 'user' && decoded.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'Only a super admin can update another privileged account' },
        { status: 403 }
      );
    }

    if (role && !ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ message: 'Invalid user role' }, { status: 400 });
    }

    if (role && role !== 'user' && role !== user.role && decoded.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'Only a super admin can grant a privileged role' },
        { status: 403 }
      );
    }

    if (id === decoded.userId && role && role !== user.role) {
      return NextResponse.json(
        { message: 'You cannot change your own role' },
        { status: 400 }
      );
    }

    const updateData: Prisma.UserUpdateInput = {};

    // Update fields
    if (name) updateData.name = name.trim();
    if (email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { message: 'Please enter a valid email address' },
          { status: 400 }
        );
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: { email: email.toLowerCase().trim(), id: { not: id } }
      });
      if (existingUser) {
        return NextResponse.json(
          { message: 'Email is already taken by another user' },
          { status: 409 }
        );
      }

      updateData.email = email.toLowerCase().trim();
    }
    if (role) updateData.role = role;

    if (password) {
      if (password.length < MIN_PASSWORD_LENGTH) {
        return NextResponse.json(
          { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` },
          { status: 400 }
        );
      }
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete user (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyTokenFromRequest(request);

    if (!decoded || !['admin', 'super_admin'].includes(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'user' && decoded.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'Only a super admin can delete a privileged account' },
        { status: 403 }
      );
    }

    // Prevent admin from deleting themselves
    if (user.id === decoded.userId) {
      return NextResponse.json(
        { message: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
