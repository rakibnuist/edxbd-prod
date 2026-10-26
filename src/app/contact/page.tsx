import type { Metadata } from 'next';
import ContactClient from './ContactClient';
import { getPublicTrustRecords } from '@/lib/trust-records';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact EduExpress International for an Education Fit Assessment, university comparison or a parent conversation at our Dhanmondi office.',
  openGraph: {
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — Better Education. Clear Costs. Written Proof.' }],
    title: 'Contact Us - Free Study Abroad Consultation',
    description: 'Get expert study abroad guidance from our experienced consultants. Free consultation available. Located in Dhanmondi, Dhaka.',
    type: 'website',
  },
  twitter: {
    title: 'Contact Us - Free Study Abroad Consultation',
    description: 'Get expert study abroad guidance from our experienced consultants. Free consultation available. Located in Dhanmondi, Dhaka.',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default async function Contact() {
  const { offices } = await getPublicTrustRecords();
  const office = offices[0];
  return <ContactClient office={office ? { name: office.name, address: office.address, phonePrimary: office.phonePrimary, phoneSecondary: office.phoneSecondary, email: office.email, hours: office.hours, mapUrl: office.mapUrl } : undefined} />;
}
