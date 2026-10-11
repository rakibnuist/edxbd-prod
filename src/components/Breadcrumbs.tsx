import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

type BreadcrumbItem = {
  name: string;
  href?: string;
};

export default function Breadcrumbs({ items, className = '' }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#174f7a]">
        <li>
          <Link href="/" aria-label="Home" className="inline-flex items-center gap-1.5 hover:text-[#08263c]"><Home size={13} /> Home</Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              <ChevronRight size={13} className="text-[#174f7a]/45" />
              {item.href && !isLast ? <Link href={item.href} className="hover:text-[#08263c]">{item.name}</Link> : <span aria-current={isLast ? 'page' : undefined} className="text-slate-600">{item.name}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
