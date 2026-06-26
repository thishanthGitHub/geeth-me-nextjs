import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star, MapPin, Phone, Clock } from "lucide-react";
import { getRestaurantPlace } from "@/lib/places.functions";

const PLACE_ID = "ChIJAVL8ur68-zoR1vDmfjNscU0";

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < full ? "fill-accent text-accent" : "text-muted-foreground/40"}
        />
      ))}
    </div>
  );
}

export function ContactMap() {
  const fetchPlace = useServerFn(getRestaurantPlace);
  const { data } = useQuery({
    queryKey: ["place", PLACE_ID],
    queryFn: () => fetchPlace(),
    staleTime: 1000 * 60 * 30,
  });

  const browserKey = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
  const embedSrc = browserKey
    ? `https://www.google.com/maps/embed/v1/place?key=${browserKey}&q=place_id:${PLACE_ID}&zoom=15`
    : `https://www.google.com/maps?q=place_id:${PLACE_ID}&output=embed`;

  return (
    <section id="contact" className="relative px-6 md:px-12 py-24 md:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-fluid-eyebrow uppercase text-muted-foreground mb-4">Find us</p>
          <h2 className="font-display text-fluid-section tracking-tight">
            Visit <span className="italic text-accent">Geeth Me</span>
          </h2>
          {data && (
            <div className="mt-6 inline-flex items-center gap-3 text-sm text-muted-foreground">
              <Stars value={data.rating} />
              <span className="font-medium text-foreground tabular-nums">{data.rating.toFixed(1)}</span>
              <span>·</span>
              <span>{data.userRatingCount} Google reviews</span>
              {data.openNow !== undefined && (
                <>
                  <span>·</span>
                  <span className={data.openNow ? "text-emerald-500" : "text-rose-500"}>
                    {data.openNow ? "Open now" : "Closed"}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Map */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden border border-border bg-card aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
            <iframe
              title="Geeth Me location"
              src={embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Info */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card/60 p-6 md:p-8 flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-foreground leading-relaxed">
                {data?.address ?? "Madcove Junction, Kandy Rd, Trincomalee 31000, Sri Lanka"}
              </div>
            </div>
            {data?.phone && (
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-accent shrink-0 mt-0.5" />
                <a href={`tel:+94${data.phone.replace(/\s/g, "").replace(/^0/, "")}`} className="text-sm hover:text-accent transition-colors">
                  +94 {data.phone.replace(/^0/, "")}
                </a>
              </div>
            )}
            {data?.hours?.length ? (
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-accent shrink-0 mt-0.5" />
                <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
                  {data.hours.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              <a
                href={data?.mapsUrl || `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-accent text-accent px-5 py-2.5 text-xs tracking-[0.25em] uppercase hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Open in Google Maps →
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=place_id:${PLACE_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-border px-5 py-2.5 text-xs tracking-[0.25em] uppercase hover:border-accent hover:text-accent transition-colors"
              >
                Directions
              </a>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {data && data.reviews.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between mb-8">
              <h3 className="font-display text-2xl md:text-3xl">What guests say</h3>
              <a
                href={data.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.25em] uppercase text-muted-foreground hover:text-accent transition-colors"
              >
                See all on Google →
              </a>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.reviews.filter((r) => r.rating >= 4).slice(0, 6).map((r, i) => (
                <article
                  key={`${r.authorName}-${i}`}
                  className="rounded-2xl border border-border bg-card/60 p-5 flex flex-col gap-3 hover:border-accent/60 transition-colors"
                >
                  <header className="flex items-center gap-3">
                    {r.authorPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.authorPhoto}
                        alt={r.authorName}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-medium">
                        {r.authorName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{r.authorName}</div>
                      <div className="text-[11px] text-muted-foreground">{r.relativeTime}</div>
                    </div>
                  </header>
                  <Stars value={r.rating} />
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
                    {r.text || <span className="italic">No written review.</span>}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
