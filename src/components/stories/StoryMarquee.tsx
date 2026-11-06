import Link from 'next/link';
import StoryCard, { type StoryCardData } from './StoryCard';

/**
 * Endless, self-moving rows of student stories (two rows on wide screens, moving
 * in opposite directions). Pure CSS transform animation: it pauses on hover or
 * keyboard focus, and becomes a normal swipeable row when the visitor prefers
 * reduced motion. The second copy of each row is hidden from assistive tech.
 */
export default function StoryMarquee({ stories }: { stories: StoryCardData[] }) {
  if (stories.length === 0) return null;

  // Each row needs enough cards to be wider than the screen before it repeats.
  const fill = (list: StoryCardData[]) => {
    const out = [...list];
    while (out.length < 7) out.push(...list);
    return out;
  };
  const twoRows = stories.length >= 6;
  const half = Math.ceil(stories.length / 2);
  const rows = twoRows ? [fill(stories.slice(0, half)), fill(stories.slice(half))] : [fill(stories)];

  return (
    <div className="grid gap-5" role="region" aria-label="Student stories">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="story-marquee">
          <div
            className="story-marquee-track"
            data-reverse={rowIndex === 1 ? '' : undefined}
            style={{ ['--marquee-duration' as string]: `${row.length * 9}s` }}
          >
            {[0, 1].map(copy => (
              <ul
                key={copy}
                className="flex shrink-0 items-stretch gap-5 pr-5"
                aria-hidden={copy === 1 ? true : undefined}
                inert={copy === 1 ? true : undefined}
              >
                {row.map((story, index) => (
                  <li key={`${story.id}-${index}`} className="w-[290px] shrink-0 sm:w-[340px]">
                    <Link
                      href={`/success-stories#story-${story.id}`}
                      className="block h-full rounded-3xl transition duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 motion-reduce:transition-none"
                    >
                      <StoryCard story={story} compact />
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
