"use client";

import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

// With an API key → precise place embed (recommended for production)
// Without key    → address search embed (works but less precise)
// Set NEXT_PUBLIC_GOOGLE_MAPS_KEY in .env.local to unlock the keyed embed.
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
const PLACE_ID = "ChIJAVL8ur68-zoR1vDmfjNscU0";
const ADDRESS = "Geeth+Me+Sea+Food+Restaurant,+Dockyard+Road,+Trincomalee,+Sri+Lanka";

function getEmbedSrc() {
  if (API_KEY) {
    // Maps Embed API — place mode (most accurate)
    return `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=place_id:${PLACE_ID}&zoom=16`;
  }
  // Fallback: address search embed — no key needed
  return `https://maps.google.com/maps?q=${ADDRESS}&z=16&output=embed&hl=en`;
}

export function ContactMap() {
  const embedSrc = getEmbedSrc();

  return (
    <section id="contact" className="relative px-6 md:px-12 py-24 md:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* heading */}
        <div className="mb-12">
          <p className="text-fluid-eyebrow uppercase text-muted-foreground mb-4">Find us</p>
          <h2 className="font-display text-fluid-h2 tracking-tight">
            Visit <span className="italic text-accent">Geeth Me</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* ── Map ── */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden border border-border bg-card aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
            <iframe
              title="Geeth Me Sea Food Restaurant on Google Maps"
              src={embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>

          {/* ── Info ── */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card/60 p-6 md:p-8 flex flex-col gap-6">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Geeth Me Sea Food Restaurant</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Dockyard Road<br />
                  Trincomalee 31000<br />
                  Sri Lanka
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="text-accent shrink-0 mt-0.5" />
              <a href="tel:+94771505771" className="text-sm hover:text-accent transition-colors">
                +94 77 150 57 71
              </a>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={18} className="text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground leading-relaxed">
                Open daily<br />
                <span className="text-foreground font-medium">11:00 – 23:00</span>
              </div>
            </div>

            <div className="mt-auto pt-2 flex flex-col gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=place_id:${PLACE_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-5 py-3 text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity rounded-sm"
              >
                <ExternalLink size={13} /> Get directions
              </a>
              <a
                href={`https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-border px-5 py-3 text-xs tracking-[0.2em] uppercase hover:border-accent hover:text-accent transition-colors rounded-sm"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
