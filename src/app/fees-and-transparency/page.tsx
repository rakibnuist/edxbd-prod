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
};

export default function FeesAndTransparencyPage() {
  return <FeesAndTransparencyClient />;
}
