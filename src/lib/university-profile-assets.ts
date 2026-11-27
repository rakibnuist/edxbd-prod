import 'server-only';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

/** Keep the visible logo and the university's semantic identity on the same asset. */
export function universityProfileLogo(university: { slug: string; logo?: string }) {
  const url = `/images/universities/logos/${university.slug}.webp`;
  const file = path.join(process.cwd(), 'public', url);
  if (existsSync(file)) {
    return `${url}?v=${Math.trunc(statSync(file).mtimeMs).toString(36)}`;
  }
  if (university.logo) {
    if (university.logo.startsWith('/')) {
      const explicitFile = path.join(process.cwd(), 'public', university.logo.split('?')[0]);
      if (existsSync(explicitFile)) return university.logo;
      return undefined;
    }
    return university.logo;
  }
  return undefined;
}
