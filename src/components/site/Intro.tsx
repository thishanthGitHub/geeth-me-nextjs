import { useRef } from "react";
import { useGsapScroll, gsap, ScrollTrigger } from "@/hooks/use-gsap-scroll";
import { EditableText } from "@/components/site/EditableText";
import koththu from "@/assets/koththu.jpg";

export function Intro() {
  const root = useRef<HTMLDivElement>(null);

  useGsapScroll(() => {
    const words = root.current?.querySelectorAll(".reveal-word");
    if (words?.length) {
      gsap.from(words, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.04,
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1] as unknown as string,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }
    gsap.from(".intro-img", {
      scale: 1.2,
      duration: 1.4,
      ease: "power3.out",
      scrollTrigger: { trigger: ".intro-img", start: "top 85%" },
    });
    gsap.utils.toArray<HTMLElement>(".intro-para").forEach((p) => {
      gsap.from(p, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: { trigger: p, start: "top 85%" },
      });
    });
    return () => ScrollTrigger.refresh();
  }, []);

  const headline = "Cheese Koththu — the dish that put us on the map.";

  return (
    <section ref={root} id="about" className="px-6 md:px-12 py-24 md:py-36 max-w-7xl mx-auto">
      <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-12">
        <EditableText contentKey="intro.eyebrow">— Geeth Me Special</EditableText>
      </p>
      <div className="grid md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <h2 className="font-display text-accent text-fluid-h2 tracking-tight overflow-hidden">
            {headline.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-bottom">
                <span className="reveal-word inline-block">{w}</span>
              </span>
            ))}
          </h2>

          <div className="mt-12 overflow-hidden rounded-sm">
            <img
              src={koththu}
              alt="Cheese koththu being chopped on a hot griddle"
              width={1400}
              height={1400}
              loading="lazy"
              className="intro-img w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="md:pt-24 space-y-6 text-sm md:text-base leading-relaxed max-w-md">
          <p className="intro-para">
            <EditableText contentKey="intro.para1" multiline>
              Chopped godhamba roti tangled with melted cheese, fresh seafood, spice and our smoky house masala. Eight variations on the menu — start with the Mixed and you'll be back for the Sea Food.
            </EditableText>
          </p>
          <p className="intro-para text-muted-foreground">
            <EditableText contentKey="intro.para2" multiline>
              The cleaver's rhythm on the iron griddle is the heartbeat of Geeth Me. You hear it before you see the kitchen.
            </EditableText>
          </p>
          <a
            href="#menu"
            className="intro-para inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            <EditableText contentKey="intro.cta">See all 8 koththus →</EditableText>
          </a>
        </div>
      </div>
    </section>
  );
}
