
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
    const uni = await University.findOne({ slug: params.id }, 'name location city country badges degree logo taught').lean();

    if (!uni) {
        return { title: 'University Not Found - EduExpress International' };
    }

    const isMBBS = uni.degree?.some(d => d.toLowerCase().includes('mbbs') || d.toLowerCase().includes('medicine')) || uni.badges?.some(b => b.toLowerCase().includes('mbbs'));
    const isMaster = uni.degree?.some(d => d.toLowerCase().includes('master')) || uni.badges?.some(b => b.toLowerCase().includes('master'));
    const isBachelor = uni.degree?.some(d => d.toLowerCase().includes('bachelor'));

    const programs = [
        isBachelor && 'Bachelor',
        isMBBS && 'MBBS',
        isMaster && "Master's"
    ].filter(Boolean).join(', ');

    const title = `Study at ${uni.name} | ${programs || 'Degree Programs'} | EduExpress International`;
    const description = `Apply to ${uni.name} in ${uni.city || uni.location}, ${uni.country} through EduExpress International. Explore ${programs || 'degree'} programs, tuition fees, scholarships & admission requirements for international students. Free counseling available.`;

    const canonicalUrl = `https://www.eduexpressint.com/universities/${params.id}`;
    const ogImage = uni.logo || 'https://www.eduexpressint.com/og-default.jpg';

    return {
        title,
        description,
        keywords: [
            uni.name,
            `Study in ${uni.country}`,
            `${uni.name} tuition fees`,
            `${uni.name} scholarships`,
            `${uni.name} international students`,
            `${uni.name} admission requirements`,
            isMBBS ? `MBBS in ${uni.country}` : '',
            isMBBS ? `Medical school ${uni.country}` : '',
            isMaster ? `Masters in ${uni.country}` : '',
            isBachelor ? `Bachelor degree ${uni.country}` : '',
            `Study abroad ${uni.country}`,
            `EduExpress ${uni.country}`,
            uni.taught?.map(l => `${l} medium university`).join(', ') || '',
        ].filter(Boolean).join(', '),
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: 'website',
            images: [{ url: ogImage, width: 1200, height: 630, alt: `${uni.name} - EduExpress International` }],
            siteName: 'EduExpress International',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
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
