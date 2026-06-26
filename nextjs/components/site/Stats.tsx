"use client";

import { useRef } from "react";
import { useGsapScroll, gsap } from "@/hooks/use-gsap-scroll";
import { EditableText } from "@/components/site/EditableText";

const stats = [
  { v: "113", l: "Dishes on the menu" },
  { v: "20+", l: "Years on the coast" },
  { v: "S/R", l: "Small or regular portions" },
  { v: "7", l: "Days a week" },
];

export function Stats() {
  const root = useRef<HTMLElement>(null);
  useGsapScroll(() => {
    gsap.from(".stat-item", {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 80%" },
    });
  }, []);

  return (
    <section ref={root} className="px-6 md:px-12 py-20 md:py-28 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
        {stats.map((s, idx) => (
          <div key={s.l} className="stat-item">
            <p className="font-display text-6xl md:text-8xl text-accent leading-none">
              <EditableText contentKey={`stats.${idx}.v`}>{s.v}</EditableText>
            </p>
            <p className="mt-4 text-xs tracking-[0.25em] uppercase text-muted-foreground max-w-[14ch]">
              <EditableText contentKey={`stats.${idx}.l`}>{s.l}</EditableText>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

