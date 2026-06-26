import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { SmoothScroll } from "@/components/site/SmoothScroll";

// Set theme before first paint to prevent flash
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t)t='dark';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('dark');}})();`;

export const metadata: Metadata = {
  title: {
    default: "Geeth Me Restaurant — Trincomalee",
    template: "%s — Geeth Me",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  description:
    "Sri Lankan seafood in Trincomalee since 2004. Crab curry, kottu roti and devilled prawns on Dockyard Road.",
  keywords: [
    "seafood restaurant Trincomalee",
    "Sri Lankan crab curry",
    "kottu roti",
    "cheese kottu",
    "devilled prawns",
    "Geeth Me",
    "Trincomalee restaurants",
    "Sri Lankan food",
  ],
  openGraph: {
    siteName: "Geeth Me",
    title: "Geeth Me Restaurant — Trincomalee",
    description:
      "Sri Lankan seafood in Trincomalee since 2004. Crab curry, kottu roti and devilled prawns on Dockyard Road.",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a1959031-d7a5-4102-a9ab-f7591cdef99b/id-preview-01f8d21f--c1c4e2d7-5f4c-4178-8c79-c764dc0dc2e9.lovable.app-1779854480451.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geeth Me Restaurant — Trincomalee",
    description:
      "Sri Lankan seafood in Trincomalee since 2004. Crab curry, kottu roti and devilled prawns on Dockyard Road.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <SmoothScroll />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
