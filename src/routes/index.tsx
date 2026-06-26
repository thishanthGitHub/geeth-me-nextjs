import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Stats } from "@/components/site/Stats";
import { Categories } from "@/components/site/Categories";
import { MenuTeaser } from "@/components/site/MenuTeaser";
import { Intro } from "@/components/site/Intro";
import { Gallery } from "@/components/site/Gallery";
import { Story } from "@/components/site/Story";
import { BookingCTA } from "@/components/site/BookingCTA";
import { ContactMap } from "@/components/site/ContactMap";
import { ReviewsStrip } from "@/components/site/ReviewsStrip";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Geeth Me — Sri Lankan Seafood in Trincomalee" },
      {
        name: "description",
        content:
          "Authentic Sri Lankan seafood in Trincomalee since 2004. Famous for fresh crab curry, cheese kottu roti and devilled prawns on Dockyard Road.",
      },
      {
        name: "keywords",
        content:
          "best seafood restaurant Trincomalee, authentic Sri Lankan food Trincomalee, fresh crab curry Trincomalee, cheese kottu roti, devilled prawns, family restaurant Trincomalee, top rated restaurant Trincomalee, Geeth Me restaurant, Dockyard Road Trincomalee, things to eat in Trincomalee, where to eat Trincomalee, Sri Lankan seafood since 2004",
      },
      { property: "og:title", content: "Geeth Me — Sri Lankan Seafood in Trincomalee" },
      {
        property: "og:description",
        content: "Twenty years of fire on the Trincomalee coast. Crab curry, kottu roti, devilled prawns — 113 Sri Lankan dishes.",
      },
      { property: "og:url", content: "https://geeth-me-restaurant-tco.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://geeth-me-restaurant-tco.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Geeth Me",
          description:
            "Sri Lankan seafood restaurant on the Trincomalee coast since 2004. Specialising in crab curry, kottu roti and devilled prawns.",
          servesCuisine: ["Sri Lankan", "Seafood", "South Asian"],
          priceRange: "$$",
          telephone: "+94771505771",
          url: "https://geeth-me-restaurant-tco.lovable.app/",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Dockyard Road",
            addressLocality: "Trincomalee",
            addressCountry: "LK",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 8.5874,
            longitude: 81.2152,
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday", "Tuesday", "Wednesday", "Thursday",
                "Friday", "Saturday", "Sunday",
              ],
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
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Where is Geeth Me located?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Geeth Me is on Dockyard Road in Trincomalee, Sri Lanka, on the eastern coast. We've been serving Sri Lankan seafood here since 2004.",
              },
            },
            {
              "@type": "Question",
              name: "What kind of food does Geeth Me serve?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sri Lankan seafood — lagoon crab curry, devilled prawns, cheese kottu roti, rice and curry, plus chicken, beef and vegetarian dishes across a 113-item menu.",
              },
            },
            {
              "@type": "Question",
              name: "What are Geeth Me's opening hours?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Open daily from 11:00 to 23:00. Reservations are accepted by phone on +94 77 150 57 71.",
              },
            },
            {
              "@type": "Question",
              name: "Do you take reservations?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes — reserve a table by phone on +94 77 150 57 71 or through the booking section on this site.",
              },
            },
          ],
        }),
      },
    ],
  }),
});

function Index() {
  return (
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
      <ContactMap />
      <Footer />
    </main>
  );
}
