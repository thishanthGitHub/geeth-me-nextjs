"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGsapScroll, gsap } from "@/hooks/use-gsap-scroll";
import Link from "next/link";

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGsapScroll(() => {
    // Parallax: image scrolls slower than the viewport
    gsap.to(".hero-img", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    // Overlay darkens as you scroll down
    gsap.to(".hero-overlay", {
      opacity: 0.7,
      ease: "none",
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.3 + i * 0.13, duration: 1, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <section ref={root} className="relative h-screen min-h-[720px] w-full overflow-hidden">
      {/* Background image with parallax */}
      <div className="hero-img absolute inset-0 will-change-transform scale-110">
        <img
          src="/assets/hero-geethme.jpg"
          alt="Geeth Me restaurant — Trincomalee seafood"
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background" />
      </div>

      {/* Text content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <motion.p
            variants={fadeUp} custom={0} initial="hidden" animate="show"
            className="text-xs md:text-sm tracking-[0.35em] uppercase text-accent mb-8"
          >
            Trincomalee · Since 2004
          </motion.p>

          <motion.h1
            variants={fadeUp} custom={1} initial="hidden" animate="show"
            className="font-display text-fluid-display tracking-tight max-w-5xl"
          >
            Sea, spice<br />
            and <span className="italic text-accent">twenty years</span><br />
            of fire.
          </motion.h1>

          <div className="mt-12 grid md:grid-cols-2 gap-10 items-end">
            <motion.p
              variants={fadeUp} custom={2} initial="hidden" animate="show"
              className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-md"
            >
              Devilled prawns. Cheese koththu. Sri Lankan crab curry. 113 dishes from the Geeth Me kitchen — pulled straight from the Trincomalee coast.
            </motion.p>

            <motion.div
              variants={fadeUp} custom={3} initial="hidden" animate="show"
              className="flex flex-col sm:flex-row items-start md:items-center md:justify-end gap-4 sm:gap-6"
            >
              <motion.a
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                href="tel:+94771505771"
                className="border border-foreground/80 px-7 py-3 text-xs tracking-[0.25em] uppercase hover:bg-accent hover:border-accent hover:text-accent-foreground transition-colors"
              >
                Reserve a table
              </motion.a>
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase"
              >
                See the menu
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
