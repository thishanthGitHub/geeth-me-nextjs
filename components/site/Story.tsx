"use client";

import { useRef } from "react";
import { useGsapScroll, gsap } from "@/hooks/use-gsap-scroll";
import { EditableText } from "@/components/site/EditableText";

const milestones = [
  {
    year: "2004",
    title: "A small kitchen by the harbour",
    body: "Geeth Me opens on Dockyard Road with three tables, one charcoal grill and a handful of regulars.",
  },
  {
    year: "2011",
    title: "Cheese Koththu is born",
    body: "A late-night experiment with godhamba roti and melted cheese turns into our signature dish.",
  },
  {
    year: "2018",
    title: "113 dishes on one menu",
    body: "Crab curries, devilled platters, dosas, coolers — the menu grows to cover the whole coast.",
  },
  {
    year: "2024",
    title: "Twenty years of fire",
    body: "Same family. Same recipes. New generations of diners coming back for the same first bite.",
  },
];

export function Story() {
  const root = useRef<HTMLElement>(null);
  useGsapScroll(() => {
    gsap.from(".milestone", {
      y: 50,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
  }, []);

  return (
    <section ref={root} className="px-6 md:px-12 py-24 md:py-36 max-w-7xl mx-auto">
      <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
        <EditableText contentKey="story.eyebrow">— Our story</EditableText>
      </p>
      <h3 className="font-display text-fluid-h1 tracking-tight max-w-4xl">
        <EditableText contentKey="story.title.a">Twenty years on the </EditableText>
        <EditableText contentKey="story.title.b" className="italic text-accent">Trincomalee</EditableText>
        <EditableText contentKey="story.title.c"> coast.</EditableText>
      </h3>
      <p className="mt-8 text-sm md:text-base text-muted-foreground max-w-xl">
        <EditableText contentKey="story.body" multiline>
          From three tables to a 113-dish menu — every milestone still smells of charcoal, curry leaves and the sea breeze.
        </EditableText>
      </p>

      <div className="mt-20 grid md:grid-cols-4 gap-px bg-border border border-border">
        {milestones.map((m, idx) => (
          <div key={m.year} className="milestone bg-background p-8 md:p-10">
            <p className="font-display text-5xl md:text-6xl text-accent">
              <EditableText contentKey={`story.m${idx}.year`}>{m.year}</EditableText>
            </p>
            <p className="mt-6 font-display text-xl md:text-2xl leading-snug">
              <EditableText contentKey={`story.m${idx}.title`}>{m.title}</EditableText>
            </p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              <EditableText contentKey={`story.m${idx}.body`} multiline>{m.body}</EditableText>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

