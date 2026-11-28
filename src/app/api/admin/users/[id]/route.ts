import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import type { Prisma } from '@prisma/client';
import { ALLOWED_USER_ROLES, generateToken, isAdminRole, isStaffRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
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

    return NextResponse.json({ user }, { headers: { 'Cache-Control': 'no-store, private' } });
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

    const body = await readLimitedJson(request, 16 * 1024);
    const name = body.name;
    const email = body.email;
    const role = typeof body.role === 'string' ? body.role : undefined;
    const password = body.password;
    const employeeId = body.employeeId;
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

    if (role && !ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number])) {
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

    // Validate target employee linkage before mutating to prevent hijacking another user's profile
    if (employeeId !== undefined && typeof employeeId === 'string' && employeeId.trim()) {
      const targetEmp = await prisma.employee.findUnique({
        where: { id: employeeId.trim() },
        select: { id: true, userId: true },
      });
      if (!targetEmp) {
        return NextResponse.json({ message: 'Selected staff profile was not found' }, { status: 400 });
      }
      if (targetEmp.userId && targetEmp.userId !== id) {
        return NextResponse.json(
          { message: 'That staff profile is already linked to another login account' },
          { status: 409 },
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, tokenVersion: true, createdAt: true, updatedAt: true }
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

    const { tokenVersion: nextTokenVersion, ...safeUser } = updatedUser;
    const response = NextResponse.json(
      {
        message: 'User updated successfully',
        user: safeUser,
      },
      { headers: { 'Cache-Control': 'no-store, private' } },
    );

    // If the logged-in admin changed their own email/password (bumping tokenVersion), re-issue their cookie
    if (id === decoded.userId && nextTokenVersion !== user.tokenVersion && isStaffRole(updatedUser.role)) {
      const freshToken = generateToken({
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        tokenVersion: nextTokenVersion,
      });
      response.cookies.set('admin_session', freshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 8 * 60 * 60,
      });
    }

    return response;
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
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

    return NextResponse.json({ message: 'User deleted successfully' }, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
