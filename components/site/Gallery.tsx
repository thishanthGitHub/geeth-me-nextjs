"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGsapScroll, gsap } from "@/hooks/use-gsap-scroll";

// Each image mapped to exactly what it shows
const items = [
  { src: "/assets/gallery-crab.jpg",    alt: "Trinco lagoon crab",              label: "Lagoon Crab",     tall: true  },
  { src: "/assets/food/devilled.jpg",   alt: "Devilled seafood platter",        label: "Devilled Mix",    tall: false },
  { src: "/assets/cheese-kothu.jpg",    alt: "Cheese koththu on the griddle",   label: "Cheese Koththu", tall: false },
  { src: "/assets/gallery-coconut.jpg", alt: "King coconut cooler",             label: "King Coconut",    tall: false },
  { src: "/assets/egg-dosa.webp",       alt: "Crispy egg dosa",                 label: "Egg Dosa",        tall: true  },
  { src: "/assets/food/rice-curry.jpg", alt: "Sri Lankan rice and curry plate", label: "Rice & Curry",   tall: false },
];

export function Gallery() {
  const root = useRef<HTMLDivElement>(null);

  useGsapScroll(() => {
    gsap.fromTo(
      ".gallery-card",
      { y: 60, autoAlpha: 0 },
      {
        y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
      }
    );
  }, []);

  return (
    <section ref={root} id="gallery" className="px-6 md:px-12 py-24 md:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-fluid-eyebrow uppercase text-muted-foreground mb-3">— The kitchen &amp; coast</p>
            <h2 className="font-display text-fluid-h2 tracking-tight">
              A table <span className="italic text-accent">worth photographing.</span>
            </h2>
          </div>
        </div>

        {/* masonry-style: col 0 and col 4 (index 0,4) are tall cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {items.map((it, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 0.985 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`gallery-card relative overflow-hidden group rounded-xl ${
                it.tall ? "row-span-2 aspect-[3/4]" : "aspect-square"
              }`}
            >
              <img
                src={it.src}
                alt={it.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 font-display italic text-xl md:text-2xl text-accent drop-shadow">
                {it.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
