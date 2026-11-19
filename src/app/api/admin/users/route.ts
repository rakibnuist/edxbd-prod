import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import prisma from '@/lib/prisma';

const ALLOWED_ROLES = ['user', 'counselor', 'admin', 'super_admin'] as const;
const MIN_PASSWORD_LENGTH = 12;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// GET - Fetch all users + employee link roster (Admin only)
export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);

    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const [users, employees] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.employee.findMany({
        where: { active: true },
        orderBy: { empId: 'asc' },
        select: {
          id: true,
          empId: true,
          name: true,
          email: true,
          phone: true,
          team: true,
          role: true,
          userId: true,
        },
      }),
    ]);

    const empByUserId = new Map(employees.filter((e) => e.userId).map((e) => [e.userId!, e]));
    const empByEmail = new Map(
      employees.filter((e) => e.email).map((e) => [e.email!.trim().toLowerCase(), e]),
    );

    const enrichedUsers = users.map((u) => {
      const emp = empByUserId.get(u.id) || empByEmail.get(u.email.trim().toLowerCase()) || null;
      return {
        ...u,
        employee: emp
          ? { id: emp.id, empId: emp.empId, name: emp.name, team: emp.team, phone: emp.phone }
          : null,
      };
    });

    return NextResponse.json({ users: enrichedUsers, employees }, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);

    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role = 'counselor', employeeId } = body ?? {};

    // Validate required fields and primitive types
    if (
      typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof password !== 'string' || !password
    ) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ message: 'Invalid user role' }, { status: 400 });
    }

    if (isAdminRole(role) && decoded.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'Only a super admin can create administrator accounts' },
        { status: 403 }
      );
    }

    // Normalize before format & uniqueness checks
    const normalizedEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` },
        { status: 400 }
      );
    }

    // Check if user already exists using normalized email
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role
      }
    });

    // Link employee profile if provided explicitly or matched by email
    let linkedEmployee: { id: string; empId: string; name: string; team: string; phone: string | null } | null = null;
    if (typeof employeeId === 'string' && employeeId.trim()) {
      const targetEmp = await prisma.employee.findUnique({ where: { id: employeeId.trim() } });
      if (targetEmp) {
        linkedEmployee = await prisma.employee.update({
          where: { id: targetEmp.id },
          data: {
            userId: user.id,
            ...(!targetEmp.email ? { email: normalizedEmail } : {}),
          },
          select: { id: true, empId: true, name: true, team: true, phone: true },
        });
      }
    } else {
      const matchedEmp = await prisma.employee.findFirst({
        where: { email: normalizedEmail, userId: null },
      });
      if (matchedEmp) {
        linkedEmployee = await prisma.employee.update({
          where: { id: matchedEmp.id },
          data: { userId: user.id },
          select: { id: true, empId: true, name: true, team: true, phone: true },
        });
      }
    }

    // Return user without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      employee: linkedEmployee,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
