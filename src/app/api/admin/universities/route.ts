
import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { serializeUniversity, universityAdminInclude, universityWriteData } from '@/lib/university-admin';
import { universityIndexingErrors, universityIsIndexable, universityVerificationErrors } from '@/lib/university-governance';
import { revalidateUniversityPages } from '@/lib/university-cache';

const isAdmin = (role?: string) => role === 'admin' || role === 'super_admin';

export async function GET(request: NextRequest) {
    try {
        const decoded = verifyTokenFromRequest(request);

        if (!decoded || !isAdmin(decoded.role)) {
            return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const country = searchParams.get('country');
        const degree = searchParams.get('degree');
        const search = searchParams.get('search');
        const verification = searchParams.get('verification');

        // Pagination params
        const requestedPage = Number.parseInt(searchParams.get('page') || '1', 10);
        const requestedLimit = Number.parseInt(searchParams.get('limit') || '10', 10);
        const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;
        const limit = Number.isFinite(requestedLimit) ? Math.min(50, Math.max(1, requestedLimit)) : 10;
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
        if (verification && verification !== 'all') query.verificationStatus = verification;

        const [total, universities, filterRecords, governanceRecords] = await Promise.all([
            prisma.university.count({ where: query }),
            prisma.university.findMany({
                where: query,
                orderBy: { name: 'asc' },
                skip,
                take: limit,
                include: universityAdminInclude,
            }),
            prisma.university.findMany({ select: { country: true, degree: true } }),
            prisma.university.findMany({ include: universityAdminInclude }),
        ]);

        const countries = Array.from(new Set(filterRecords.map(record => record.country.trim()).filter(Boolean))).sort();
        const degrees = Array.from(new Set(filterRecords.flatMap(record => record.degree.split(',').map(item => item.trim()).filter(Boolean)))).sort();

        const serialized = universities.map(serializeUniversity);
        const governed = governanceRecords.map(serializeUniversity);
        const readiness = {
            total: governed.length,
            indexable: governed.filter(university => universityIsIndexable(university) && universityIndexingErrors(university).length === 0).length,
            underVerification: governed.filter(university => university.verificationStatus === 'under_verification').length,
            expired: governed.filter(university => university.verificationStatus === 'expired' || (university.verificationExpiresAt && new Date(university.verificationExpiresAt) < new Date())).length,
        };

        return NextResponse.json({
            universities: serialized.map(university => {
                const verificationIssues = universityIndexingErrors(university);
                return {
                    ...university,
                    verificationIssues,
                    sitemapEligible: universityIsIndexable(university) && verificationIssues.length === 0,
                };
            }),
            filters: { countries, degrees },
            readiness,
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

        if (!decoded || !isAdmin(decoded.role)) {
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

        revalidateUniversityPages(university.slug);

        return NextResponse.json(serializeUniversity(university), { status: 201 });
    } catch (error) {
        console.error('Error creating university:', error);
        return NextResponse.json(
            { error: 'Failed to create university' },
            { status: 500 }
        );
    }
}
