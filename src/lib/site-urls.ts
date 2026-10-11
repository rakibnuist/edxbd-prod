export const SITE_URL = 'https://eduexpressint.com';

export function destinationPath(slug: string) {
  return slug === 'china'
    ? '/study-in-china-from-bangladesh'
    : `/study-in-${slug}-from-bangladesh`;
}

export function absoluteUrl(path = '/') {
  return `${SITE_URL}${path === '/' ? '' : path}`;
}
