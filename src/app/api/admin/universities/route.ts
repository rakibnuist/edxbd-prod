
import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { serializeUniversity, universityAdminInclude, universityWriteData } from '@/lib/university-admin';
import { universityVerificationErrors } from '@/lib/university-governance';

export async function GET(request: NextRequest) {
    try {
        const decoded = verifyTokenFromRequest(request);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const country = searchParams.get('country');
        const degree = searchParams.get('degree');
        const search = searchParams.get('search');

        // Pagination params
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (country && country !== 'all') {
            query.country = country;
        }

        if (degree && degree !== 'all') {
            query.degree = { contains: degree };
        }

        if (search) {
            query.OR = [
                { name: { contains: search } },
                { location: { contains: search } },
                { country: { contains: search } },
                { city: { contains: search } }
            ];
        }

        const [total, universities, filterRecords] = await Promise.all([
            prisma.university.count({ where: query }),
            prisma.university.findMany({
                where: query,
                orderBy: { name: 'asc' },
                skip,
                take: limit,
                include: universityAdminInclude,
            }),
            prisma.university.findMany({ select: { country: true, degree: true } }),
        ]);

        const countries = Array.from(new Set(filterRecords.map(record => record.country.trim()).filter(Boolean))).sort();
        const degrees = Array.from(new Set(filterRecords.flatMap(record => record.degree.split(',').map(item => item.trim()).filter(Boolean)))).sort();

        return NextResponse.json({
            universities: universities.map(serializeUniversity),
            filters: { countries, degrees },
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching universities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch universities' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const decoded = verifyTokenFromRequest(request);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const body = await request.json();

        // Basic validation
        if (!body.name || !body.slug) {
            return NextResponse.json({ error: 'Name and Slug are required' }, { status: 400 });
        }

        const verificationErrors = universityVerificationErrors(body);
        if (verificationErrors.length) {
            return NextResponse.json({ error: `Complete the evidence checks before publishing: ${verificationErrors.join(' ')}` }, { status: 400 });
        }

        // Check unique slug
        const existing = await prisma.university.findUnique({ where: { slug: body.slug } });
        if (existing) {
            return NextResponse.json({ error: 'University with this slug already exists' }, { status: 400 });
        }

        const updateData = universityWriteData(body);
        if (!('programs' in updateData)) return NextResponse.json({ error: 'Invalid university data.' }, { status: 400 });
        const university = await prisma.university.create({
            data: {
                ...updateData,
                programs: { create: updateData.programs.create },
                fees: { create: updateData.fees.create },
                scholarships: { create: updateData.scholarships.create },
                costPlans: { create: updateData.costPlans.create },
            },
            include: universityAdminInclude,
        });

        return NextResponse.json(serializeUniversity(university), { status: 201 });
    } catch (error) {
        console.error('Error creating university:', error);
        return NextResponse.json(
            { error: 'Failed to create university' },
            { status: 500 }
        );
    }
}
