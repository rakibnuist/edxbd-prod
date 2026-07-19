
import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const decoded = verifyTokenFromRequest(request);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        let university;
        if (params.id.match(/^[0-9a-fA-F]{24}$/)) {
            university = await prisma.university.findUnique({ where: { id: params.id } });
        }
        if (!university) {
            university = await prisma.university.findUnique({ where: { slug: params.id } });
        }

        if (!university) {
            return NextResponse.json({ error: 'University not found' }, { status: 404 });
        }

        return NextResponse.json(university);
    } catch (error) {
        console.error('Fetch University Error:', error);
        return NextResponse.json({ error: 'Failed to fetch university' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const decoded = verifyTokenFromRequest(request);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const { id: _immutableId, _id: _immutableId2, __v: _version, createdAt: _createdAt, updatedAt: _updatedAt, ...update } = body;

        let university;
        if (params.id.match(/^[0-9a-fA-F]{24}$/)) {
            university = await prisma.university.update({
                where: { id: params.id },
                data: update
            }).catch(() => null);
        }
        if (!university) {
            university = await prisma.university.update({
                where: { slug: params.id },
                data: update
            }).catch(() => null);
        }

        if (!university) {
            return NextResponse.json({ error: 'University not found' }, { status: 404 });
        }

        return NextResponse.json(university);
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Failed to update university' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const decoded = verifyTokenFromRequest(request);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const university = await prisma.university.delete({ where: { id: params.id } }).catch(() => null);

        if (!university) {
            return NextResponse.json({ error: 'University not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'University deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete university' }, { status: 500 });
    }
}
