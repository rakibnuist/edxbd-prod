import { Metadata } from 'next';
import FeesAndTransparencyClient from './FeesAndTransparencyClient';

export const metadata: Metadata = {
  title: 'Fees & Written Transparency | ClearCost Calculator & Proof Assets | EduExpress',
  description: 'Calculate your total study abroad cost and inspect EduExpress International\'s 4 written trust assets: EduFit Report, ClearCost Schedule, Application Proof Pack, and China Visa-First Policy.',
  openGraph: {
    title: 'Fees & Written Transparency | EduExpress International',
    description: 'Calculate itemized study abroad costs and inspect written evidence specs with zero hidden charges.',
    url: 'https://eduexpressint.com/fees-and-transparency',
  },
  alternates: { canonical: 'https://eduexpressint.com/fees-and-transparency' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://eduexpressint.com/fees-and-transparency#webpage',
      url: 'https://eduexpressint.com/fees-and-transparency',
      name: 'Fees and Transparency',
      description: 'How EduExpress separates its service charges from university, embassy and other third-party costs, with four written trust assets.',
      inLanguage: 'en-BD',
      dateModified: '2026-07-19',
      reviewedBy: { '@id': 'https://eduexpressint.com/#organization' },
      isPartOf: { '@id': 'https://eduexpressint.com/#organization' },
      breadcrumb: { '@id': 'https://eduexpressint.com/fees-and-transparency#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://eduexpressint.com/fees-and-transparency#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' },
        { '@type': 'ListItem', position: 2, name: 'Fees and Transparency', item: 'https://eduexpressint.com/fees-and-transparency' },
      ],
    },
  ],
};

export default function FeesAndTransparencyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <FeesAndTransparencyClient />
    </>
  );
}
