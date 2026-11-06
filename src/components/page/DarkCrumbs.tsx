import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JsonLd } from '@/components/page/PageKit';
import { breadcrumbJsonLd, type Crumb } from '@/lib/json-ld';

/** Breadcrumb trail for navy heroes, with the same BreadcrumbList data as PageCrumbs. */
export default function DarkCrumbs({ trail, path }: { trail: Crumb[]; path: string }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail, path)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold text-white/70">
          <li><Link href="/" className="hover:text-white hover:underline">Home</Link></li>
          {trail.map((item, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
                <ChevronRight size={14} className="text-white/40" aria-hidden="true" />
                {item.path && !last ? (
                  <Link href={item.path} className="hover:text-white hover:underline">{item.name}</Link>
                ) : (
                  <span aria-current={last ? 'page' : undefined} className="text-white">{item.name}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
