
import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { serializeUniversity, universityAdminInclude, universityWriteData } from '@/lib/university-admin';
import { universityVerificationErrors } from '@/lib/university-governance';
import { revalidateUniversityPages } from '@/lib/university-cache';

const isAdmin = (role?: string) => role === 'admin' || role === 'super_admin';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const decoded = verifyTokenFromRequest(request);
        if (!decoded || !isAdmin(decoded.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        const university = await prisma.university.findFirst({
            where: { OR: [{ id: params.id }, { slug: params.id }] },
            include: universityAdminInclude,
        });

        if (!university) {
            return NextResponse.json({ error: 'University not found' }, { status: 404 });
        }

        return NextResponse.json(serializeUniversity(university));
    } catch (error) {
        console.error('Fetch University Error:', error);
        return NextResponse.json({ error: 'Failed to fetch university' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const decoded = verifyTokenFromRequest(request);
        if (!decoded || !isAdmin(decoded.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const verificationErrors = universityVerificationErrors(body);
        if (verificationErrors.length) {
            return NextResponse.json({ error: `Complete the evidence checks before publishing: ${verificationErrors.join(' ')}` }, { status: 400 });
        }
        const existing = await prisma.university.findFirst({ where: { OR: [{ id: params.id }, { slug: params.id }] } });
        if (!existing) return NextResponse.json({ error: 'University not found' }, { status: 404 });
        const university = await prisma.university.update({
            where: { id: existing.id },
            data: universityWriteData(body),
            include: universityAdminInclude,
        });

        if (!university) {
            return NextResponse.json({ error: 'University not found' }, { status: 404 });
        }

        revalidateUniversityPages(university.slug);

        return NextResponse.json(serializeUniversity(university));
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Failed to update university' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const decoded = verifyTokenFromRequest(request);
        if (!decoded || !isAdmin(decoded.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const existing = await prisma.university.findFirst({ where: { OR: [{ id: params.id }, { slug: params.id }] } });
        const university = existing ? await prisma.university.delete({ where: { id: existing.id } }).catch(() => null) : null;

        if (!university) {
            return NextResponse.json({ error: 'University not found' }, { status: 404 });
        }

        revalidateUniversityPages(university.slug);

        return NextResponse.json({ message: 'University deleted successfully' });
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to delete university' }, { status: 500 });
    }
}
