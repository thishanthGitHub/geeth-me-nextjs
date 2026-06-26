import { useRef } from "react";
import { motion } from "framer-motion";
import { useGsapScroll, gsap } from "@/hooks/use-gsap-scroll";
import g1 from "@/assets/gallery-crab.jpg";
import g2 from "@/assets/gallery-dosa.jpg";
import g3 from "@/assets/gallery-coconut.jpg";

const items = [
  { src: g1, alt: "Trinco lagoon crab curry in a clay pot", label: "Trinco Lagoon Crab" },
  { src: g2, alt: "Crispy egg dosa with three chutneys", label: "Egg Dosa" },
  { src: g3, alt: "King coconut cooler with lime and mint", label: "King Coconut Cooler" },
];

export function Gallery() {
  const root = useRef<HTMLDivElement>(null);

  useGsapScroll(() => {
    gsap.fromTo(
      ".gallery-card",
      { y: 80, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: "top 90%", once: true, toggleActions: "play none none none" },
      }
    );
  }, []);


  return (
    <section ref={root} id="gallery" className="grid grid-cols-1 md:grid-cols-3 gap-1">
      {items.map((it, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 0.99 }}
          className="gallery-card relative aspect-[4/5] overflow-hidden group"
        >
          <img
            src={it.src}
            alt={it.alt}
            width={1200}
            height={1500}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <p className="absolute bottom-6 left-6 font-display italic text-2xl md:text-3xl text-accent">
            {it.label}
          </p>
        </motion.div>
      ))}
    </section>
  );
}
