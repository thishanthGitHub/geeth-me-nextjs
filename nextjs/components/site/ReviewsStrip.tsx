"use client";

import { Star } from "lucide-react";

// Static reviews — will be connected to Google Places API later
const STATIC_REVIEWS = [
  {
    author: "Arjuna K.",
    rating: 5,
    time: "2 months ago",
    text: "The crab curry here is absolutely unreal. Fresh lagoon crab, perfectly spiced. Been coming here for years and it never disappoints.",
  },
  {
    author: "Sarah M.",
    rating: 5,
    time: "3 months ago",
    text: "Best cheese kottu we've had in Sri Lanka. The atmosphere is great and the staff are so friendly. Must visit in Trinco!",
  },
  {
    author: "Nimal P.",
    rating: 4,
    time: "1 month ago",
    text: "Devilled prawns were fresh and perfectly cooked. Portions are generous and the rice and curry is authentic home-style cooking.",
  },
];

const MAPS_URL = `https://www.google.com/maps/place/?q=place_id:ChIJAVL8ur68-zoR1vDmfjNscU0`;

function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < value ? "fill-accent text-accent" : "text-muted-foreground/40"
          }
        />
      ))}
    </span>
  );
}

export function ReviewsStrip() {
  return (
    <section
      aria-label="Guest reviews"
      className="relative px-6 md:px-12 py-12 md:py-16 border-y border-border bg-card/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-3 text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-background border border-border px-4 py-1.5">
            <span className="font-display text-lg text-accent tabular-nums">4.6</span>
            <Stars value={5} size={13} />
          </span>
          <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
            280+ Google reviews
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATIC_REVIEWS.map((r, i) => (
            <a
              key={i}
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-border bg-background/60 p-5 flex flex-col gap-2.5 hover:border-accent/60 transition-colors"
            >
              <div className="flex items-center justify-between">
                <Stars value={r.rating} />
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  {r.time}
                </span>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed line-clamp-3 italic">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="text-xs text-muted-foreground mt-auto pt-1 group-hover:text-accent transition-colors">
                — {r.author}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
