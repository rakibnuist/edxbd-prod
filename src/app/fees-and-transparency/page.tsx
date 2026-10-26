import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator, Download, GraduationCap, ReceiptText, Sparkles } from 'lucide-react';
import { getPublicTrustRecords } from '@/lib/trust-records';

export const metadata: Metadata = {
  title: { absolute: 'University Costs, Scholarships and ClearCost | EduExpress' },
  description: 'Choose a university and program, compare scholarship options, see itemized first year costs and download a branded ClearCost PDF.',
  alternates: { canonical: 'https://eduexpressint.com/fees-and-transparency' },
  openGraph: {
    title: 'University Costs, Scholarships and ClearCost',
    description: 'Choose a program, apply a scholarship and see the itemized first-year cost in one branded sheet.',
    url: '/fees-and-transparency',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — ClearCost breakdown' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'University Costs, Scholarships and ClearCost',
    description: 'Choose a program, apply a scholarship and see the itemized first-year cost in one branded sheet.',
    images: ['/og-image.jpg'],
  },
};

export default async function FeesAndTransparencyPage() {
  const { servicePackages } = await getPublicTrustRecords();
  const chinaPackages = servicePackages.filter(item => item.destination === 'China');
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'University Costs, Scholarships and ClearCost',
    url: 'https://eduexpressint.com/fees-and-transparency',
    description: 'How EduExpress aligns university programs, scholarships and itemized study costs.',
    inLanguage: 'en-BD',
  };

  return <main className="bg-[#f7fafc] pb-20 pt-28 text-[#08263c] lg:pt-36">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <header className="px-5 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1240px] items-end gap-8 lg:grid-cols-[1fr_360px]"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#174f7a]">ClearCost lives with the university</p><h1 className="mt-3 max-w-4xl font-heading text-5xl font-bold leading-[1.02] sm:text-7xl">Choose the program. Apply a scholarship. See the cost.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">Every university profile now keeps programs, scholarship choices, tuition and other first year costs together. You can download the selected view as an EduExpress branded PDF.</p><Link href="/universities" className="mt-7 inline-flex min-h-14 items-center gap-3 rounded-xl bg-[#08263c] px-6 text-sm font-black text-white">Choose a university <ArrowRight size={17} /></Link></div><div className="rounded-3xl bg-[#dff3fb] p-6"><ReceiptText className="text-[#174f7a]" /><strong className="mt-4 block font-heading text-2xl">One data point, one place.</strong><p className="mt-2 text-sm leading-6 text-slate-600">The university page is the main cost record. Separate cost pages redirect back to it.</p></div></div></header>

    <section className="mt-14 border-y border-[#174f7a]/15 bg-white px-5 py-14 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1240px]"><div className="grid gap-4 md:grid-cols-3">{[
      [GraduationCap, '1. Choose a program', 'Bachelor, Master, MBBS and other levels keep their own tuition and requirements.'],
      [Sparkles, '2. Select a scholarship', 'Available scholarship types change the tuition view and show their conditions.'],
      [Download, '3. Download the PDF', 'The branded ClearCost PDF carries the selected program, scholarship, recipients and subtotal.'],
    ].map(([Icon, title, text]) => <article key={String(title)} className="rounded-2xl border border-[#174f7a]/15 bg-[#f7fafc] p-6"><Icon className="text-[#174f7a]" /><h2 className="mt-5 font-heading text-2xl font-bold">{String(title)}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{String(text)}</p></article>)}</div></div></section>

    {chinaPackages.length > 0 && <section className="px-5 py-14 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1240px]"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#174f7a]">China service costs</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">The service package is separate from university costs.</h2></div><Link href="/china-visa-first-policy" className="inline-flex items-center gap-2 text-sm font-black text-[#174f7a]">Open complete package terms <ArrowRight size={15} /></Link></div><div className="mt-8 grid gap-4 lg:grid-cols-2">{chinaPackages.map(item => <article key={item.id} className="rounded-3xl bg-[#08263c] p-7 text-white"><p className="text-[10px] font-black uppercase tracking-[.15em] text-[#8ed0ee]">{item.packageType.replaceAll('_', ' ')}</p><h3 className="mt-3 font-heading text-2xl font-bold">{item.title}</h3><strong className="mt-4 block text-3xl text-[#8ed0ee]">{item.priceLabel}</strong><p className="mt-4 text-sm leading-6 text-white/65">{item.summary}</p></article>)}</div></div></section>}

    <section className="px-5 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1240px] items-center gap-6 rounded-3xl bg-[#64b5df] p-7 lg:grid-cols-[1fr_auto]"><div><div className="flex items-center gap-2"><Calculator size={20} /><p className="text-xs font-black uppercase tracking-[.15em]">China payment policy</p></div><p className="mt-4 max-w-4xl text-sm font-semibold leading-7">No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.</p></div><Link href="/china-visa-first-policy" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#08263c] px-6 text-sm font-black text-white">Read the terms <ArrowRight size={15} /></Link></div></section>
  </main>;
}
