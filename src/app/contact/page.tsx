import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with EduExpress International for a free Education Fit Assessment. Call +880 1983-333566 or visit our office in Dhanmondi, Dhaka.',
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

export default function Contact() {
  return <ContactClient />;
}
