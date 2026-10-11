import PartnershipClient from './PartnershipClient';

export const metadata = {
  title: 'Partner With Us',
  description: 'Partner with EduExpress International. Expand your education consultancy business with our comprehensive study abroad solutions, training programs, and marketing support.',
  keywords: 'education partnership, education consultancy, study abroad, business partnership, education services, international education',
  openGraph: {
    title: 'Partner With Us',
    description: 'Partner with EduExpress International. Expand your education consultancy business with our comprehensive study abroad solutions.',
    type: 'website',
    url: '/partnership',
  },
  alternates: {
    canonical: '/partnership',
  },
};

export default function PartnershipPage() {
  return <PartnershipClient />;
}
