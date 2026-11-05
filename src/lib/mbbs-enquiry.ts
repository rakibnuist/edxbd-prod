export function mbbsApplyHref(university?: string) {
  const query = new URLSearchParams({ country: 'China', program: 'Clinical Medicine (MBBS)' });
  if (university) query.set('university', university);
  return `/apply?${query.toString()}`;
}
