import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { ReviewsStrip } from "@/components/site/ReviewsStrip";
import { Stats } from "@/components/site/Stats";
import { Categories } from "@/components/site/Categories";
import { MenuTeaser } from "@/components/site/MenuTeaser";
import { Intro } from "@/components/site/Intro";
import { Gallery } from "@/components/site/Gallery";
import { Story } from "@/components/site/Story";
import { BookingCTA } from "@/components/site/BookingCTA";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Geeth Me — Sri Lankan Seafood in Trincomalee",
  description:
    "Authentic Sri Lankan seafood in Trincomalee since 2004. Famous for fresh crab curry, cheese kottu roti and devilled prawns on Dockyard Road.",
  alternates: { canonical: "https://geeth-me-restaurant-tco.lovable.app/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Geeth Me",
  description:
    "Sri Lankan seafood restaurant on the Trincomalee coast since 2004.",
  servesCuisine: ["Sri Lankan", "Seafood"],
  priceRange: "$$",
  telephone: "+94771505771",
  url: "https://geeth-me-restaurant-tco.lovable.app/",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dockyard Road",
    addressLocality: "Trincomalee",
    addressCountry: "LK",
  },
  geo: { "@type": "GeoCoordinates", latitude: 8.5874, longitude: 81.2152 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "11:00",
      closes: "23:00",
    },
  ],
  menu: "https://geeth-me-restaurant-tco.lovable.app/menu",
  acceptsReservations: "True",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.6",
    reviewCount: "280",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-background text-foreground">
        <Nav />
        <Hero />
        <Marquee />
        <ReviewsStrip />
        <Stats />
        <Categories />
        <MenuTeaser />
        <Intro />
        <Gallery />
        <Story />
        <BookingCTA />
        <Footer />
      </main>
    </>
  );
}
