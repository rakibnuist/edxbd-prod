import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import type { Prisma } from '@prisma/client';
import { ALLOWED_USER_ROLES, isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import prisma from '@/lib/prisma';

const ALLOWED_ROLES = ALLOWED_USER_ROLES;
const MIN_PASSWORD_LENGTH = 12;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// GET - Fetch single user (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyLiveAdminUser(request);

    if (!decoded || !isAdminRole(decoded.role)) {
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
    const decoded = await verifyLiveAdminUser(request);

    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, role, password, employeeId } = body ?? {};
    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.id !== decoded.userId && isAdminRole(user.role) && decoded.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'Only a super admin can update another administrator account' },
        { status: 403 }
      );
    }

    if (role && !ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ message: 'Invalid user role' }, { status: 400 });
    }

    if (role && isAdminRole(role) && role !== user.role && decoded.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'Only a super admin can grant an administrator role' },
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
    if (typeof name === 'string' && name.trim()) updateData.name = name.trim();
    if (typeof email === 'string' && email.trim()) {
      const normalizedEmail = email.toLowerCase().trim();
      if (!EMAIL_REGEX.test(normalizedEmail)) {
        return NextResponse.json(
          { message: 'Please enter a valid email address' },
          { status: 400 }
        );
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: { email: normalizedEmail, id: { not: id } }
      });
      if (existingUser) {
        return NextResponse.json(
          { message: 'Email is already taken by another user' },
          { status: 409 }
        );
      }

      updateData.email = normalizedEmail;
    }
    if (role) {
      updateData.role = role;
      if (role !== user.role) updateData.tokenVersion = { increment: 1 };
    }

    if (typeof password === 'string' && password.length > 0) {
      if (password.length < MIN_PASSWORD_LENGTH) {
        return NextResponse.json(
          { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` },
          { status: 400 }
        );
      }
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(password, saltRounds);
      updateData.tokenVersion = { increment: 1 };
    }

    if (updateData.email && updateData.email !== user.email) {
      updateData.tokenVersion = { increment: 1 };
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
    });

    if (employeeId !== undefined) {
      await prisma.employee.updateMany({ where: { userId: id }, data: { userId: null } });
      if (typeof employeeId === 'string' && employeeId.trim()) {
        await prisma.employee.update({
          where: { id: employeeId.trim() },
          data: { userId: id },
        }).catch(() => {});
      }
    }

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
    const decoded = await verifyLiveAdminUser(request);

    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (isAdminRole(user.role) && decoded.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'Only a super admin can delete an administrator account' },
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

    await prisma.employee.updateMany({ where: { userId: id }, data: { userId: null } });
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
