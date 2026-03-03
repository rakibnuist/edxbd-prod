
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
    const uni = await University.findOne({ slug: params.id }, 'name location country badges degree').lean();

    if (!uni) {
        return {
            title: 'University Not Found - Partnership'
        };
    }

    const isMBBS = uni.degree?.some(d => d.toLowerCase().includes('mbbs') || d.toLowerCase().includes('medicine')) || uni.badges?.some(b => b.toLowerCase().includes('mbbs'));
    const isMaster = uni.degree?.some(d => d.toLowerCase().includes('master')) || uni.badges?.some(b => b.toLowerCase().includes('master'));

    let degreeText = "Degree Programs";
    if (isMBBS) degreeText = "MBBS & Clinical Medicine Programs";
    else if (isMaster) degreeText = "Master's & Bachelor's Programs";

    return {
        title: `Study at ${uni.name}, ${uni.country} | EduExpress International`,
        description: `Apply to ${uni.name} in ${uni.location || uni.country} with EduExpress. Explore tuition fees, ${degreeText}, and FREE scholarship opportunities for international students.`,
        keywords: [
            uni.name,
            `Study in ${uni.country}`,
            `${uni.name} Scholarships`,
            `${uni.name} Admissions`,
            `EduExpress International ${uni.country}`,
            isMBBS ? `MBBS in ${uni.country}` : '',
            isMaster ? `Masters in ${uni.country}` : ''
        ].filter(Boolean).join(', ')
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
