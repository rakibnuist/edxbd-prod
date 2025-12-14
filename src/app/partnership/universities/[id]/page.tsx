
import { notFound } from 'next/navigation';
import UniversityDetailClient from './UniversityDetailClient';
import connectDB from '@/lib/mongodb';
import University from '@/models/University';

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

export async function generateStaticParams() {
    await connectDB();
    const universities = await University.find({}, 'slug').lean();
    return universities.map((uni) => ({
        id: uni.slug,
    }));
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    await connectDB();
    const uni = await University.findOne({ slug: params.id }, 'name').lean();

    if (!uni) {
        return {
            title: 'University Not Found - Partnership'
        };
    }

    return {
        title: `${uni.name} - Partnership Opportunities`,
        description: `Explore scholarship and admission details for ${uni.name} available for EduExpress partners.`,
    };
}

async function getUniversity(slug: string) {
    await connectDB();
    const uni = await University.findOne({ slug }).lean();
    if (!uni) return null;
    return JSON.parse(JSON.stringify(uni));
}

export default async function UniversityDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const uni = await getUniversity(params.id);

    if (!uni) {
        notFound();
    }

    return <UniversityDetailClient initialData={uni} />;
}
