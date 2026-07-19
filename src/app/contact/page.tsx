import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us - EduExpress International',
  description: 'Get in touch with EduExpress International for a free Education Fit Assessment. Call 01983 333566 or visit Evergreen Latif in Dhanmondi, Dhaka.',
  keywords: [
    'contact eduexpress international',
    'study abroad consultation bangladesh',
    'education consultant contact',
    'free consultation dhaka',
    'study abroad office bangladesh',
    'international education contact',
    'overseas education consultation'
  ],
  openGraph: {
    title: 'Contact EduExpress International - Free Study Abroad Consultation',
    description: 'Get expert study abroad guidance from our experienced consultants. Free consultation available. Located in Dhanmondi, Dhaka.',
    type: 'website',
  },
  twitter: {
    title: 'Contact EduExpress International - Free Study Abroad Consultation',
    description: 'Get expert study abroad guidance from our experienced consultants. Free consultation available. Located in Dhanmondi, Dhaka.',
  },
};

export default function Contact() {
  return <ContactClient />;
}
