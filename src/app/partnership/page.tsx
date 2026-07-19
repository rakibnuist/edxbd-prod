import PartnershipClient from './PartnershipClient';

export const metadata = {
  title: 'B2B Partnership',
  description: 'Join EduExpress International as a B2B partner. Expand your education consultancy business with our comprehensive study abroad solutions, training programs, and marketing support.',
  keywords: 'B2B partnership, education consultancy, study abroad, business partnership, education services, international education',
  openGraph: {
    title: 'B2B Partnership',
    description: 'Join EduExpress International as a B2B partner. Expand your education consultancy business with our comprehensive study abroad solutions.',
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
