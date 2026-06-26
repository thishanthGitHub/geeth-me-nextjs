import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star } from "lucide-react";
import { getRestaurantPlace } from "@/lib/places.functions";

function Stars({ value, size = 12 }: { value: number; size?: number }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < full ? "fill-accent text-accent" : "text-muted-foreground/40"}
        />
      ))}
    </span>
  );
}

export function ReviewsStrip() {
  const fetchPlace = useServerFn(getRestaurantPlace);
  const { data } = useQuery({
    queryKey: ["place", "ChIJAVL8ur68-zoR1vDmfjNscU0"],
    queryFn: () => fetchPlace(),
    staleTime: 1000 * 60 * 30,
  });

  if (!data) return null;
  const top = data.reviews
    .filter((r) => r.rating >= 4 && r.text && r.text.length > 30)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <section
      aria-label="Guest reviews from Google"
      className="relative px-6 md:px-12 py-12 md:py-16 border-y border-border bg-card/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-3 text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-background border border-border px-4 py-1.5">
            <span className="font-display text-lg text-accent tabular-nums">{data.rating.toFixed(1)}</span>
            <Stars value={data.rating} size={13} />
          </span>
          <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
            {data.userRatingCount}+ Google reviews
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {top.map((r, i) => (
            <a
              key={`${r.authorName}-${i}`}
              href={data.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-border bg-background/60 p-5 flex flex-col gap-2.5 hover:border-accent/60 transition-colors"
            >
              <div className="flex items-center justify-between">
                <Stars value={r.rating} />
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{r.relativeTime}</span>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed line-clamp-3 italic">
                “{r.text}”
              </p>
              <div className="text-xs text-muted-foreground mt-auto pt-1 group-hover:text-accent transition-colors">
                — {r.authorName}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
