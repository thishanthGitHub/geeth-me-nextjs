"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGsapScroll, gsap } from "@/hooks/use-gsap-scroll";
import { EditableText } from "@/components/site/EditableText";

export function BookingCTA() {
  const root = useRef<HTMLElement>(null);
  useGsapScroll(() => {
    gsap.fromTo(
      ".cta-line",
      { yPercent: 110, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        stagger: 0.1,
        duration: 1,
        ease: [0.22, 1, 0.36, 1] as unknown as string,
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true, toggleActions: "play none none none" },
      }
    );
  }, []);


  return (
    <section
      ref={root}
      id="booking"
      className="relative px-6 md:px-12 py-32 md:py-48 text-center border-y border-border"
    >
      <p className="text-fluid-eyebrow uppercase text-muted-foreground mb-8">
        <EditableText contentKey="cta.eyebrow">Trincomalee, Sri Lanka · open daily</EditableText>
      </p>
      <h3 className="font-display text-fluid-display tracking-tight">
        <span className="block overflow-hidden">
          <span className="cta-line inline-block">
            <EditableText contentKey="cta.line1">Hungry? We're a</EditableText>
          </span>
        </span>
        <span className="block overflow-hidden">
          <span className="cta-line inline-block italic text-accent">
            <EditableText contentKey="cta.line2">phone call away.</EditableText>
          </span>
        </span>
      </h3>


      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
        <motion.a
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          href="tel:+94771505771"
          className="inline-block border border-foreground px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-accent hover:border-accent hover:text-accent-foreground transition-colors"
        >
          <EditableText contentKey="cta.phone">+94 77 150 57 71</EditableText>
        </motion.a>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Geeth+Me+Sea+Food+Restaurant+Trincomalee"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-[0.25em] uppercase hover:text-accent transition-colors"
        >
          <EditableText contentKey="cta.directions">Get directions →</EditableText>
        </a>
      </div>
    </section>
  );
}

