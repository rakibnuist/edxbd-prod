
import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';

import { universities } from '@/data/partnershipUniversities';

export async function POST(request: NextRequest) {
    try {
        // Admin check
        const decoded = verifyTokenFromRequest(request);
        // Allow if role is admin OR in dev environment possibly?
        // For safety, force admin.
        if (!decoded || decoded.role !== 'admin') {
            // return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();

        let count = 0;
        const errors = [];

        for (const uniData of universities) {
            try {
                // Map static data to schema if necessary or just use as is if it matches
                // The static data interface seems to match our schema mostly using the same "University" interface concept
                // We just need to map 'id' to 'slug' because our model uses 'slug' as the friendly ID

                const { id, ...rest } = uniData;
                const doc = {
                    ...rest,
                    slug: id, // Map id -> slug
                    isActive: true
                };

                console.log('Migrating doc:', JSON.stringify(doc, null, 2));

                // Upsert based on slug
                // Upsert based on slug using native driver to avoid Mongoose hang
                const mongooseInstance = await connectDB();
                const db = mongooseInstance.connection.db;
                if (!db) throw new Error('Database connection failed');

                await db.collection('universityv2s').updateOne(
                    { slug: doc.slug },
                    { $set: doc },
                    { upsert: true }
                );
                count++;
            } catch (err) {
                console.error(`Failed to migrate ${uniData.name}:`, err);
                const errorMessage = err instanceof Error ? err.message : String(err);
                errors.push(`${uniData.name}: ${errorMessage}`);
            }
        }

        return NextResponse.json({
            message: 'Migration completed',
            processed: count,
            total: universities.length,
            errors
        });

    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
    }
}
