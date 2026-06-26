"use client";

import { useRef } from "react";
import { useGsapScroll, gsap } from "@/hooks/use-gsap-scroll";

const dishes = [
  {
    n: "01",
    tag: "Catch of the day",
    name: "Trinco Lagoon Crab",
    desc: "Pulled at dawn, simmered in coconut, pandan and roasted curry powder.",
  },
  {
    n: "02",
    tag: "House devilled",
    name: "Devilled Prawns",
    desc: "Tiger prawns fired in our smoky house chilli paste — sweet, sharp, dangerous.",
  },
  {
    n: "03",
    tag: "Signature koththu",
    name: "Cheese Koththu",
    desc: "Chopped godhamba roti, melted cheese and seafood under the cleaver's rhythm.",
  },
  {
    n: "04",
    tag: "Slow & soulful",
    name: "Coastal Dhal",
    desc: "Red lentils tempered with mustard, curry leaf and a slick of coconut cream.",
  },
  {
    n: "05",
    tag: "Crispy classic",
    name: "Egg Dosa",
    desc: "Lace-thin batter, soft yolk centre, three chutneys riding shotgun.",
  },
  {
    n: "06",
    tag: "Cool down",
    name: "King Coconut Cooler",
    desc: "Local thambili over crushed ice with lime and a whisper of mint.",
  },
];

export function MenuTeaser() {
  const root = useRef<HTMLElement>(null);
  useGsapScroll(() => {
    gsap.fromTo(
      ".dish-row",
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true, toggleActions: "play none none none" },
      }
    );
  }, []);


  const headline = "Scroll the coast. Six dishes that built our name.";

  return (
    <section ref={root} id="menu" className="px-6 md:px-12 py-24 md:py-36 max-w-6xl mx-auto">
      <div className="mb-16">
        <p className="text-fluid-eyebrow uppercase text-muted-foreground mb-6">
          — The Signature Six
        </p>
        <h3 className="font-display text-fluid-h1 tracking-tight max-w-4xl">
          {headline.split(" ").map((w, i) => (
            <span
              key={i}
              className={
                "inline-block mr-[0.25em] " +
                (i >= 4 && i <= 5 ? "italic text-accent pr-[0.08em]" : "")
              }
            >
              {w}
            </span>
          ))}
        </h3>
      </div>


      <ul className="divide-y divide-border border-y border-border">
        {dishes.map((d) => (
          <li
            key={d.name}
            className="dish-row grid grid-cols-[auto_1fr] md:grid-cols-[80px_1fr_2fr] gap-6 md:gap-10 py-8 md:py-10 items-baseline"
          >
            <p className="font-display text-2xl md:text-3xl text-accent">{d.n}</p>
            <div className="col-span-1 md:col-span-1">
              <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-2">
                {d.tag}
              </p>
              <p className="font-display text-2xl md:text-4xl">{d.name}</p>
            </div>
            <p className="col-span-2 md:col-span-1 text-sm md:text-base text-muted-foreground leading-relaxed md:max-w-md">
              {d.desc}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <p className="text-sm text-muted-foreground">And 107 more waiting for you.</p>
        <a
          href="#"
          className="inline-block border border-foreground px-8 py-3 text-xs tracking-[0.3em] uppercase hover:bg-accent hover:border-accent hover:text-accent-foreground transition-colors"
        >
          Open the full menu
        </a>
      </div>
    </section>
  );
}

