
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import prisma from '@/lib/prisma';
import { serializeUniversity, universityAdminInclude, universityWriteData, validateUniversityUrls } from '@/lib/university-admin';
import { revalidateUniversityPages } from '@/lib/university-cache';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

const isAdmin = isAdminRole;

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const decoded = await verifyLiveAdminUser(request);
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
        const decoded = await verifyLiveAdminUser(request);
        if (!decoded || !isAdmin(decoded.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const body = await readLimitedJson(request, 1024 * 1024);
        const urlError = validateUniversityUrls(body);
        if (urlError) {
            return NextResponse.json({ error: urlError }, { status: 400 });
        }
        const existing = await prisma.university.findFirst({ where: { OR: [{ id: params.id }, { slug: params.id }] } });
        if (!existing) return NextResponse.json({ error: 'University not found' }, { status: 404 });

        const nextSlug = typeof body.slug === 'string' && body.slug.trim() ? body.slug.trim() : existing.slug;
        body.slug = nextSlug;
        if (nextSlug !== existing.slug) {
            const slugConflict = await prisma.university.findUnique({ where: { slug: nextSlug }, select: { id: true } });
            if (slugConflict && slugConflict.id !== existing.id) {
                return NextResponse.json({ error: 'Another university already uses this slug.' }, { status: 409 });
            }
        }

        const university = await prisma.university.update({
            where: { id: existing.id },
            data: universityWriteData(body),
            include: universityAdminInclude,
        });

        if (!university) {
            return NextResponse.json({ error: 'University not found' }, { status: 404 });
        }

        revalidateUniversityPages(university.slug);
        if (existing.slug !== university.slug) {
            revalidateUniversityPages(existing.slug);
        }

        return NextResponse.json(serializeUniversity(university));
    } catch (error) {
        const bodyErr = jsonBodyErrorResponse(error);
        if (bodyErr) return bodyErr;
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Failed to update university' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const decoded = await verifyLiveAdminUser(request);
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
