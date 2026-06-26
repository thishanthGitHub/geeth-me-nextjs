import { useRef } from "react";
import { useGsapScroll, gsap } from "@/hooks/use-gsap-scroll";
import { motion } from "framer-motion";

const categories = [
  { name: "Seafood", desc: "Crab, prawns & lagoon fish" },
  { name: "Devilled", desc: "House-fired & smoky" },
  { name: "Koththu", desc: "8 chopped roti classics" },
  { name: "Curries", desc: "Slow-cooked, coconut-rich" },
  { name: "Rice & Roti", desc: "Fried rice, dosa & more" },
  { name: "Veg & Salads", desc: "Garden-fresh sides" },
  { name: "Hot Drinks", desc: "Tea, coffee & spiced milk" },
  { name: "Coolers", desc: "Juices, shakes & sodas" },
];

export function Categories() {
  const root = useRef<HTMLElement>(null);
  useGsapScroll(() => {
    gsap.fromTo(
      ".cat-card",
      { y: 40, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.05,
        duration: 0.7,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true, toggleActions: "play none none none" },
      }
    );
  }, []);


  const headline = "What are you in the mood for?";

  return (
    <section ref={root} className="px-6 md:px-12 py-24 md:py-32 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-fluid-eyebrow uppercase text-muted-foreground mb-6">
              — Browse by craving
            </p>
            <h2 className="font-display text-fluid-display tracking-tight max-w-3xl">
              {headline.split(" ").map((w, i) => (
                <span
                  key={i}
                  className={
                    "inline-block mr-[0.25em] " +
                    (i === 4 ? "italic text-accent pr-[0.08em]" : "")
                  }
                >
                  {w}
                </span>
              ))}
            </h2>
          </div>

          <a
            href="#menu"
            className="text-xs tracking-[0.25em] uppercase hover:text-accent transition-colors whitespace-nowrap"
          >
            Full menu →
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {categories.map((c, i) => (
            <motion.a
              key={c.name}
              href="#menu"
              whileHover={{ y: -4 }}
              className="cat-card bg-background p-6 md:p-8 group cursor-pointer"
            >
              <p className="text-xs tracking-[0.25em] text-muted-foreground mb-4">
                0{i + 1}
              </p>
              <p className="font-display text-2xl md:text-3xl group-hover:text-accent transition-colors">
                {c.name}
              </p>
              <p className="text-xs text-muted-foreground mt-2">{c.desc}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
