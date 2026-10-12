import { revalidatePath } from 'next/cache';

export function revalidateUniversityPages(slug: string) {
  revalidatePath(`/universities/${slug}`);
  revalidatePath('/universities');
  revalidatePath('/china-universities');
  revalidatePath('/sitemaps/universities.xml');
}
