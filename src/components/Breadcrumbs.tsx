import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

type BreadcrumbItem = {
  name: string;
  href?: string;
};

export default function Breadcrumbs({ items, className = '' }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold text-ink-soft">
        <li>
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-petrol-800 hover:underline"><Home size={14} aria-hidden="true" /> Home</Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-ink-mute" aria-hidden="true" />
              {item.href && !isLast ? <Link href={item.href} className="hover:text-petrol-800 hover:underline">{item.name}</Link> : <span aria-current={isLast ? 'page' : undefined} className="text-petrol-800">{item.name}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
