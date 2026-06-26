import type { Metadata } from "next";
import { parseMenuTxt } from "@/lib/menu-parser";
import { MenuPageClient } from "./MenuPageClient";

export const metadata: Metadata = {
  title: "Menu — Geeth Me Restaurant, Trincomalee",
  description:
    "Full menu: rice & curry, koththu, devilled seafood, prawns, crab, chicken, beef. 113 Sri Lankan dishes from Trincomalee's coast.",
  alternates: { canonical: "https://geeth-me-restaurant-tco.lovable.app/menu" },
};

export default function MenuPage() {
  // Read menu.txt on the server — zero latency, no client waterfall
  const menu = parseMenuTxt();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Geeth Me Menu",
    url: "https://geeth-me-restaurant-tco.lovable.app/menu",
    inLanguage: "en",
    hasMenuSection: menu.map((s) => ({
      "@type": "MenuSection",
      name: s.title,
      hasMenuItem: s.items.slice(0, 12).map((it) => ({
        "@type": "MenuItem",
        name: it.name,
        offers: {
          "@type": "Offer",
          priceCurrency: "LKR",
          price: typeof it.price === "number" ? it.price : it.price.r,
        },
      })),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MenuPageClient initialMenu={menu} />
    </>
  );
}
