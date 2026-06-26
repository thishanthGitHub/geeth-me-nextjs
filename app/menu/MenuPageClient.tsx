"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, X, Flame, Sparkles, Plus, Minus, Trash2, QrCode, ArrowLeft,
} from "lucide-react";
import { useOrder } from "@/lib/order";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { OrderBar } from "@/components/site/OrderBar";
import type { MenuItem, MenuSection } from "@/lib/menu-types";

// ─── section images (from public/assets/food/) ───────────────────────────────
const FOOD = (name: string) => `/assets/food/${name}`;
const SECTION_IMG: Record<string, string> = {
  drinks:         FOOD("drinks.jpg"),
  soup:           FOOD("soup.jpg"),
  "rice-curry":   FOOD("rice-curry.jpg"),
  sunday:         FOOD("sunday.jpg"),
  "fried-rice":   FOOD("fried-rice.jpg"),
  noodles:        FOOD("noodles.jpg"),
  meegoreng:      FOOD("noodles.jpg"),
  nasi:           FOOD("fried-rice.jpg"),
  "spicy-rice":   FOOD("fried-rice.jpg"),
  koththu:        FOOD("koththu-plain.jpg"),
  "cheese-koththu": FOOD("koththu.jpg"),
  prawns:         FOOD("devilled.jpg"),
  crab:           FOOD("seafood.jpg"),
  chicken:        FOOD("sunday.jpg"),
  beef:           FOOD("devilled.jpg"),
  deviled:        FOOD("devilled.jpg"),
  omelet:         FOOD("sides.jpg"),
  sides:          FOOD("sides.jpg"),
  desserts:       FOOD("desserts.jpg"),
};

function imageFor(id: string, title: string): string {
  if (SECTION_IMG[id]) return SECTION_IMG[id];
  const s = `${id} ${title}`.toLowerCase();
  if (/(koththu|kottu)/.test(s))                    return FOOD("koththu.jpg");
  if (/(noodle|mee|pasta)/.test(s))                 return FOOD("noodles.jpg");
  if (/(crab|lagoon)/.test(s))                      return FOOD("seafood.jpg");
  if (/(prawn|devil|chilli|spicy)/.test(s))         return FOOD("devilled.jpg");
  if (/(fried rice|nasi|grill)/.test(s))            return FOOD("fried-rice.jpg");
  if (/(rice|curry|dhal|stew)/.test(s))             return FOOD("rice-curry.jpg");
  if (/(soup)/.test(s))                             return FOOD("soup.jpg");
  if (/(drink|juice|water|shake|tea|coffee)/.test(s)) return FOOD("drinks.jpg");
  if (/(dessert|sweet|pudding)/.test(s))            return FOOD("desserts.jpg");
  return FOOD("sides.jpg");
}

const fmt = (n: number) => `Rs ${n.toLocaleString("en-LK")}`;

// ─── Stepper ─────────────────────────────────────────────────────────────────
function Stepper({
  qty, onDec, onInc, label,
}: { qty: number; onDec: () => void; onInc: () => void; label: string }) {
  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full bg-accent/15 border border-accent/40 p-0.5"
      aria-label={`${label}: ${qty}`}
    >
      <button
        aria-label={qty === 1 ? `Remove ${label}` : `Decrease ${label}`}
        onClick={onDec}
        className="w-7 h-7 inline-flex items-center justify-center rounded-full text-accent hover:bg-accent/20 active:scale-95 transition"
      >
        {qty === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
      </button>
      <span className="w-5 text-center text-xs tabular-nums font-semibold text-accent">{qty}</span>
      <button
        aria-label={`Increase ${label}`}
        onClick={onInc}
        className="w-7 h-7 inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground hover:opacity-90 active:scale-95 transition"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

// ─── Price cell ──────────────────────────────────────────────────────────────
function PriceCell({ item }: { item: MenuItem }) {
  const { add, setQty, lines } = useOrder();
  const p = item.price;

  if (typeof p === "number") {
    const line = lines.find((l) => l.n === item.n && !l.variant);
    return (
      <div className="flex items-center gap-2 shrink-0">
        <span className="rounded-full bg-accent/10 text-accent border border-accent/20 px-3 py-1 text-xs font-medium tabular-nums whitespace-nowrap">
          {fmt(p)}
        </span>
        {line ? (
          <Stepper
            qty={line.qty}
            label={item.name}
            onDec={() => setQty(item.n, undefined, line.qty - 1)}
            onInc={() => setQty(item.n, undefined, line.qty + 1)}
          />
        ) : (
          <button
            aria-label={`Add ${item.name}`}
            onClick={() => add(item)}
            className="rounded-full w-9 h-9 inline-flex items-center justify-center bg-accent text-accent-foreground hover:opacity-90 active:scale-95 transition"
          >
            <Plus size={16} />
          </button>
        )}
      </div>
    );
  }

  // variant pricing (S / R)
  const lineS = lines.find((l) => l.n === item.n && l.variant === "s");
  const lineR = lines.find((l) => l.n === item.n && l.variant === "r");
  return (
    <div className="flex flex-col items-end gap-1 shrink-0">
      {lineS ? (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">S · {fmt(p.s)}</span>
          <Stepper
            qty={lineS.qty}
            label={`Small ${item.name}`}
            onDec={() => setQty(item.n, "s", lineS.qty - 1)}
            onInc={() => setQty(item.n, "s", lineS.qty + 1)}
          />
        </div>
      ) : (
        <button
          aria-label={`Add small ${item.name}`}
          onClick={() => add(item, "s")}
          className="inline-flex items-center gap-1 rounded-full bg-card border border-border px-2.5 py-1.5 text-[11px] tabular-nums whitespace-nowrap hover:border-accent/60 hover:text-accent group"
        >
          <span className="text-muted-foreground group-hover:text-accent">S</span>
          <span className="text-foreground font-medium group-hover:text-accent">{fmt(p.s)}</span>
          <Plus size={10} />
        </button>
      )}
      {lineR ? (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">R · {fmt(p.r)}</span>
          <Stepper
            qty={lineR.qty}
            label={`Regular ${item.name}`}
            onDec={() => setQty(item.n, "r", lineR.qty - 1)}
            onInc={() => setQty(item.n, "r", lineR.qty + 1)}
          />
        </div>
      ) : (
        <button
          aria-label={`Add regular ${item.name}`}
          onClick={() => add(item, "r")}
          className="inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/30 px-2.5 py-1.5 text-[11px] tabular-nums whitespace-nowrap text-accent hover:bg-accent/20"
        >
          <span className="opacity-70">R</span>
          <span className="font-medium">{fmt(p.r)}</span>
          <Plus size={10} />
        </button>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function MenuPageClient({ initialMenu }: { initialMenu: MenuSection[] }) {
  const MENU = initialMenu;
  const [q, setQ] = useState("");
  const [active, setActive] = useState(MENU[0]?.id ?? "");

  // Highlight active section pill on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const v = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (v?.target.id) setActive(v.target.id);
      },
      { rootMargin: "-180px 0px -55% 0px", threshold: [0, 0.25, 0.6, 1] }
    );
    MENU.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [MENU]);

  const sections: MenuSection[] = useMemo(() => {
    if (!q.trim()) return MENU;
    const needle = q.toLowerCase();
    return MENU.map((s) => ({
      ...s,
      items: s.items.filter(
        (i) =>
          i.name.toLowerCase().includes(needle) ||
          s.title.toLowerCase().includes(needle)
      ),
    })).filter((s) => s.items.length > 0);
  }, [q, MENU]);

  const totalDishes = MENU.reduce((a, s) => a + s.items.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* ── Header ── */}
      <section className="border-b border-border/60 bg-gradient-to-b from-card/40 to-background pt-20">
        <div className="mx-auto max-w-5xl px-4 pt-10 pb-10 md:pt-16 md:pb-14 relative overflow-hidden">
          {/* floating food images */}
          <img src={FOOD("devilled.jpg")} alt="" loading="lazy"
            className="hidden md:block absolute -top-4 right-4 w-36 h-36 rounded-2xl object-cover shadow-2xl rotate-[-6deg] icon-float ring-1 ring-border" />
          <img src={FOOD("koththu.jpg")} alt="" loading="lazy"
            className="hidden md:block absolute top-28 right-44 w-28 h-28 rounded-2xl object-cover shadow-2xl rotate-[5deg] icon-float ring-1 ring-border" style={{ animationDelay: "0.6s" }} />
          <img src={FOOD("seafood.jpg")} alt="" loading="lazy"
            className="hidden md:block absolute bottom-2 right-2 w-28 h-28 rounded-2xl object-cover shadow-2xl rotate-[-3deg] icon-float ring-1 ring-border" style={{ animationDelay: "1.2s" }} />

          <div className="relative max-w-2xl">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent">
              <ArrowLeft size={14} /> Back to home
            </Link>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-card/60 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-accent border border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-accent icon-pulse" /> The Menu
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-foreground">
              {totalDishes} dishes,
              <br />
              <span className="italic text-accent">one kitchen.</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-md">
              Trincomalee coast cooking — from devilled prawns to cheese koththu. Prices in LKR.{" "}
              <span className="text-foreground">S</span> = small,{" "}
              <span className="text-foreground">R</span> = regular where shown.
            </p>

            <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/5 px-4 py-3 flex items-start gap-3">
              <div className="shrink-0 mt-0.5 w-9 h-9 rounded-full bg-accent/15 text-accent inline-flex items-center justify-center">
                <QrCode size={18} className="icon-pulse" />
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">No app, no waiting.</span> Tap{" "}
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent text-accent-foreground">
                  <Plus size={10} />
                </span>{" "}
                next to any dish, review your order, then show the QR — your waiter scans it and that&apos;s it.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4">
        {/* ── Sticky search + section pills ── */}
        <div className="sticky top-20 md:top-24 z-30 -mx-4 px-4 pt-3 pb-2 bg-background/95 backdrop-blur border-b border-border/60">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dishes…"
              className="w-full rounded-full bg-card border border-border pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {q && (
              <button
                aria-label="Clear"
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="mt-2.5 flex gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {MENU.map((s) => {
              const isActive = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  ref={(el) => {
                    if (el && isActive)
                      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                  }}
                  onClick={() => setActive(s.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "border-accent bg-accent text-accent-foreground scale-105"
                      : "border-border bg-card/60 text-muted-foreground hover:text-accent hover:border-accent/60"
                  }`}
                >
                  <img
                    src={imageFor(s.id, s.title)}
                    alt=""
                    loading="lazy"
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-border"
                  />
                  {s.title.replace(/ — .*/, "")}
                </a>
              );
            })}
          </div>
        </div>

        {/* ── Menu sections ── */}
        <div className="mt-8 space-y-12 pb-20">
          {sections.map((s) => (
            <section key={s.id}>
              <div id={s.id} className="scroll-mt-44 rounded-2xl border border-border bg-card/40 overflow-hidden">
                <header className="relative h-44 md:h-56 overflow-hidden border-b border-border/60">
                  <img
                    src={imageFor(s.id, s.title)}
                    alt={s.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
                  <div className="relative h-full flex items-end justify-between gap-4 px-5 md:px-7 py-5">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-accent mb-1">Section</div>
                      <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight truncate drop-shadow-lg">
                        {s.title}
                      </h2>
                      {s.note && (
                        <p className="text-xs text-muted-foreground mt-1 italic">{s.note}</p>
                      )}
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur border border-border px-3 py-1 text-xs text-muted-foreground tabular-nums">
                      <Flame size={12} className="text-accent icon-flame" />
                      {s.items.length} {s.items.length === 1 ? "dish" : "dishes"}
                    </span>
                  </div>
                </header>

                <ul className="grid md:grid-cols-2">
                  {s.items.map((i, idx) => (
                    <li
                      key={i.n}
                      className="group relative px-5 md:px-7 py-4 flex items-start justify-between gap-4 hover:bg-card/70 transition-colors border-b border-border/40 md:[&:nth-last-child(-n+2)]:border-b-0 md:odd:border-r md:odd:border-border/40"
                    >
                      <div className="flex gap-3 min-w-0 flex-1">
                        <span className="text-[10px] text-muted-foreground/70 tabular-nums w-7 pt-1 shrink-0 font-medium tracking-wider">
                          {String(i.n).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <div className="text-foreground leading-snug">{i.name}</div>
                          {idx === 0 && (
                            <div className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-accent">
                              <Sparkles size={10} className="icon-sparkle" /> Chef&apos;s pick
                            </div>
                          )}
                        </div>
                      </div>
                      <PriceCell item={i} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}

          {sections.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No dishes match &ldquo;{q}&rdquo;.</p>
              <button
                onClick={() => setQ("")}
                className="mt-4 text-sm text-accent hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>

      <OrderBar />
      <Footer />
    </div>
  );
}
