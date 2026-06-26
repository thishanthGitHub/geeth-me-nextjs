"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGsapScroll, gsap } from "@/hooks/use-gsap-scroll";
import Link from "next/link";

// img = actual background photo · icon = thiings PNG overlay
const categories = [
  {
    name: "Seafood",
    desc: "Crab, prawns & lagoon fish",
    img: "/assets/food/seafood.jpg",       // seafood platter photo
    icon: "/assets/thiings/crab.png",
  },
  {
    name: "Devilled",
    desc: "House-fired & smoky",
    img: "/assets/food/devilled.jpg",       // devilled dish photo
    icon: "/assets/thiings/sisig.png",
  },
  {
    name: "Koththu",
    desc: "8 chopped roti classics",
    img: "/assets/cheese-kothu.jpg",        // cheese koththu
    icon: "/assets/thiings/noodles.png",
  },
  {
    name: "Rice & Curry",
    desc: "Slow-cooked, coconut-rich",
    img: "/assets/food/rice-curry.jpg",     // rice & curry plate
    icon: "/assets/thiings/dhal.png",
  },
  {
    name: "Fried Rice",
    desc: "7 varieties, S or R",
    img: "/assets/food/fried-rice.jpg",     // fried rice
    icon: "/assets/thiings/dosa.png",
  },
  {
    name: "Noodles",
    desc: "Wok-tossed & fresh",
    img: "/assets/food/noodles.jpg",        // noodles
    icon: "/assets/thiings/noodles.png",
  },
  {
    name: "Soup",
    desc: "Cream soups & seafood",
    img: "/assets/food/soup.jpg",           // soup bowl
    icon: "/assets/thiings/lime-leaf.png",
  },
  {
    name: "Drinks",
    desc: "Juices, shakes & sodas",
    img: "/assets/food/drinks.jpg",         // drinks
    icon: "/assets/thiings/bubble-tea.png",
  },
];

export function Categories() {
  const root = useRef<HTMLElement>(null);

  useGsapScroll(() => {
    gsap.fromTo(
      ".cat-card",
      { y: 50, autoAlpha: 0 },
      {
        y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.8, ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
      }
    );
  }, []);

  return (
    <section ref={root} className="px-6 md:px-12 py-24 md:py-32 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-fluid-eyebrow uppercase text-muted-foreground mb-5">— Browse by craving</p>
            <h2 className="font-display text-fluid-h1 tracking-tight max-w-3xl">
              What are you in the <span className="italic text-accent">mood for?</span>
            </h2>
          </div>
          <Link href="/menu" className="text-xs tracking-[0.25em] uppercase hover:text-accent transition-colors whitespace-nowrap">
            Full menu →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((c, i) => (
            <motion.div
              key={c.name}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            >
              <Link
                href="/menu"
                className="cat-card group block relative rounded-2xl overflow-hidden border border-border bg-card/40 aspect-[3/4]"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                {/* icon badge */}
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/70 backdrop-blur border border-border/50 flex items-center justify-center">
                  <img src={c.icon} alt="" className="w-5 h-5 object-contain" loading="lazy" />
                </div>

                {/* label */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[10px] tracking-[0.25em] text-muted-foreground mb-1">0{i + 1}</p>
                  <p className="font-display text-xl md:text-2xl group-hover:text-accent transition-colors leading-tight">
                    {c.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
