export const standaloneCampaignRoutes = ['/china-march-2027-intake'] as const;

export function isStandaloneCampaignRoute(pathname: string): boolean {
  return standaloneCampaignRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
}
