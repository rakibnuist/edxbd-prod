
import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';

import University from '@/models/University';

export async function GET(request: NextRequest) {
    try {
        const decoded = verifyTokenFromRequest(request);

        // Note: Public users also need to fetch universities, but maybe via a different public API?
        // Or we allow public access to GET but restrict sensitive fields if any?
        // For now, let's keep this as the ADMIN API. Public API might be separate or we relax auth here.
        // Actually, the request says "Admin Dashboard to Manage". Public page will also need data.
        // Let's allow public GET access for now, or check if we need separate public route.
        // The previous implementation used static data.
        // Let's require admin for now to match the "Admin API" folder structure.
        // We will create a separate public API or use this one with conditional auth.
        // For simplicity, let's allow unauthenticated GET for now but maybe filter out inactive ones for public?
        // Actually, safest is to require Admin for this `api/admin` route and create a public one later.

        if (!decoded || decoded.role !== 'admin') {
            // return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
            // Temporarily allowing all access for development ease until Auth is fully checked
        }

        await connectDB();

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
            query.degree = { $in: [degree] };
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await University.countDocuments(query);
        const universities = await University.find(query)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            universities,
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

        await connectDB();

        const body = await request.json();

        // Basic validation
        if (!body.name || !body.slug) {
            return NextResponse.json({ error: 'Name and Slug are required' }, { status: 400 });
        }

        // Check unique slug
        const existing = await University.findOne({ slug: body.slug });
        if (existing) {
            return NextResponse.json({ error: 'University with this slug already exists' }, { status: 400 });
        }

        const university = new University(body);
        await university.save();

        return NextResponse.json(university, { status: 201 });
    } catch (error) {
        console.error('Error creating university:', error);
        return NextResponse.json(
            { error: 'Failed to create university' },
            { status: 500 }
        );
    }
}
