
import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import University from '@/models/University';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        let university;
        if (mongoose.Types.ObjectId.isValid(params.id)) {
            university = await University.findById(params.id);
        }
        if (!university) {
            university = await University.findOne({ slug: params.id });
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

        await connectDB();
        const body = await request.json();

        const university = await University.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });

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

        await connectDB();
        const university = await University.findByIdAndDelete(params.id);

        if (!university) {
            return NextResponse.json({ error: 'University not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'University deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete university' }, { status: 500 });
    }
}
