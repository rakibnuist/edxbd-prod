import Link from 'next/link';
import StoryCard, { type StoryCardData } from './StoryCard';

/**
 * Single-line infinite loop carousel of real student stories.
 * Pure CSS transform animation: pauses on hover or keyboard focus, and
 * becomes a normal swipeable row when the visitor prefers reduced motion.
 */
export default function StoryMarquee({
  stories,
  asElement = 'article',
}: {
  stories: StoryCardData[];
  asElement?: 'article' | 'div';
}) {
  if (stories.length === 0) return null;

  // Ensure the track is wide enough to loop seamlessly on ultra-wide viewports.
  const fill = (list: StoryCardData[]) => {
    const out = [...list];
    while (out.length < 7) out.push(...list);
    return out;
  };
  const row = fill(stories);

  return (
    <div role="region" aria-label="Student stories">
      <div className="story-marquee">
        <div
          className="story-marquee-track"
          style={{ ['--marquee-duration' as string]: `${row.length * 7}s` }}
        >
          {[0, 1].map(copy => (
            <ul
              key={copy}
              className="flex shrink-0 items-stretch gap-5 pr-5"
              aria-hidden={copy === 1 ? true : undefined}
              inert={copy === 1 ? true : undefined}
            >
              {row.map((story, index) => (
                <li key={`${story.id}-${index}`} className="w-[300px] shrink-0 sm:w-[340px]">
                  <Link
                    href={`/success-stories#story-${story.id}`}
                    className="block h-full rounded-3xl transition duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 motion-reduce:transition-none"
                  >
                    <StoryCard story={story} compact asElement={asElement} />
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
