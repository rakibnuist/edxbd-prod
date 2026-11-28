
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import prisma from '@/lib/prisma';
import { serializeUniversity, universityAdminInclude, universityWriteData, validateUniversityUrls } from '@/lib/university-admin';
import { revalidateUniversityPages } from '@/lib/university-cache';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import { parsePagination } from '@/lib/pagination';

const isAdmin = isAdminRole;

export async function GET(request: NextRequest) {
    try {
        const decoded = await verifyLiveAdminUser(request);

        if (!decoded || !isAdmin(decoded.role)) {
            return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const country = searchParams.get('country');
        const degree = searchParams.get('degree');
        const search = searchParams.get('search');
        const verification = searchParams.get('verification');

        // Pagination params
        const { page, limit, skip } = parsePagination(
            searchParams.get('page'),
            searchParams.get('limit'),
            { defaultLimit: 10, maxLimit: 50 },
        );

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
        if (verification && verification !== 'all') {
            if (verification === 'expired') {
                query.AND = [
                    ...(Array.isArray(query.AND) ? query.AND : []),
                    {
                        OR: [
                            { verificationStatus: 'expired' },
                            { verificationExpiresAt: { lt: new Date() } },
                        ],
                    },
                ];
            } else {
                query.verificationStatus = verification;
            }
        }

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
            indexable: governed.filter(university => university.isActive !== false).length,
            underVerification: governed.filter(university => university.verificationStatus === 'under_verification').length,
            expired: governed.filter(university => university.verificationStatus === 'expired' || (university.verificationExpiresAt && new Date(university.verificationExpiresAt) < new Date())).length,
        };

        return NextResponse.json({
            universities: serialized.map(university => {
                return {
                    ...university,
                    verificationIssues: [] as string[],
                    sitemapEligible: university.isActive !== false,
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
        const decoded = await verifyLiveAdminUser(request);

        if (!decoded || !isAdmin(decoded.role)) {
            return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const body = await readLimitedJson(request, 1024 * 1024);

        // Basic validation
        if (typeof body.name !== 'string' || !body.name.trim() || typeof body.slug !== 'string' || !body.slug.trim()) {
            return NextResponse.json({ error: 'Name and Slug are required' }, { status: 400 });
        }

        const urlError = validateUniversityUrls(body);
        if (urlError) {
            return NextResponse.json({ error: urlError }, { status: 400 });
        }

        // Check unique slug
        const normalizedSlug = body.slug.trim();
        body.slug = normalizedSlug;
        const existing = await prisma.university.findUnique({ where: { slug: normalizedSlug } });
        if (existing) {
            return NextResponse.json({ error: 'University with this slug already exists' }, { status: 409 });
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
        const bodyErr = jsonBodyErrorResponse(error);
        if (bodyErr) return bodyErr;
        console.error('Error creating university:', error);
        return NextResponse.json(
            { error: 'Failed to create university' },
            { status: 500 }
        );
    }
}
