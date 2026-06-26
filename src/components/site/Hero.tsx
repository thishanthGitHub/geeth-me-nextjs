import { motion } from "framer-motion";
import { useRef } from "react";
import { useGsapScroll, gsap } from "@/hooks/use-gsap-scroll";
import { EditableText } from "@/components/site/EditableText";
import hero from "@/assets/hero-geethme.jpg";

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGsapScroll(() => {
    gsap.to(".hero-img", {
      yPercent: 18,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero-overlay", {
      opacity: 0.55,
      scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
    });
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.35 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <section ref={root} className="relative h-screen min-h-[720px] w-full overflow-hidden">
      <div className="absolute inset-0 hero-img will-change-transform">
        <img
          src={hero}
          alt="Devilled prawns on a charcoal grill at Geeth Me, Trincomalee"
          width={1920}
          height={1280}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover scale-110"
        />
        <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/80" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <motion.p
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
            className="text-xs md:text-sm tracking-[0.35em] uppercase text-accent mb-8"
          >
            <EditableText contentKey="hero.eyebrow">Trincomalee · Since 2004</EditableText>
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="font-display text-fluid-display tracking-tight max-w-5xl"
          >
            <EditableText contentKey="hero.title.line1">Sea, spice</EditableText>
            <br />
            <EditableText contentKey="hero.title.line2a">and </EditableText>
            <EditableText contentKey="hero.title.line2b" className="italic text-accent">twenty years</EditableText>
            <br />
            <EditableText contentKey="hero.title.line3">of fire.</EditableText>
          </motion.h1>

          <div className="mt-12 grid md:grid-cols-2 gap-10 items-end">
            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
              className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-md"
            >
              <EditableText contentKey="hero.body" multiline>
                Devilled prawns. Cheese koththu. Sri Lankan crab curry. 113 dishes from the Geeth Me kitchen — pulled straight from the Trincomalee coast.
              </EditableText>
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="show"
              className="flex flex-col sm:flex-row items-start md:items-center md:justify-end gap-4 sm:gap-6"
            >
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#booking"
                className="border border-foreground/80 px-7 py-3 text-xs tracking-[0.25em] uppercase hover:bg-accent hover:border-accent hover:text-accent-foreground transition-colors"
              >
                <EditableText contentKey="hero.cta.reserve">Reserve a table</EditableText>
              </motion.a>
              <a
                href="#menu"
                className="group inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase"
              >
                <EditableText contentKey="hero.cta.menu">See the menu</EditableText>
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
