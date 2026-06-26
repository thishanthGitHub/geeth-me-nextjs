import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { OrderProvider } from "@/lib/order";
import { ThemeProvider } from "@/lib/theme";
import { ScrollProgress, ScrollToTop } from "@/components/site/ScrollUtils";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { PageTransition } from "@/components/site/PageTransition";
import { Toaster } from "@/components/ui/sonner";
import { AdminEditBanner } from "@/components/site/AdminEditBanner";

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(!t)t='dark';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('dark');}})();`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "Ufi5V8x1VgyqTVAoXa_0Y6HzX7qtS2AUE5ngvamdDnA" },
      { title: "Geeth Me Restaurant — Trincomalee" },
      { name: "description", content: "Sri Lankan seafood in Trincomalee since 2004. Crab curry, kottu roti and devilled prawns on Dockyard Road." },
      { name: "keywords", content: "seafood restaurant Trincomalee, Sri Lankan crab curry, kottu roti, cheese kottu, devilled prawns, Geeth Me, Trincomalee restaurants, Dockyard Road, Sri Lankan food" },
      { name: "author", content: "Geeth Me Restaurant" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: "Geeth Me" },
      { property: "og:title", content: "Geeth Me Restaurant — Trincomalee" },
      { property: "og:description", content: "Sri Lankan seafood in Trincomalee since 2004. Crab curry, kottu roti and devilled prawns on Dockyard Road." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_LK" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Geeth Me Restaurant — Trincomalee" },
      { name: "twitter:description", content: "Sri Lankan seafood in Trincomalee since 2004. Crab curry, kottu roti and devilled prawns on Dockyard Road." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a1959031-d7a5-4102-a9ab-f7591cdef99b/id-preview-01f8d21f--c1c4e2d7-5f4c-4178-8c79-c764dc0dc2e9.lovable.app-1779854480451.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a1959031-d7a5-4102-a9ab-f7591cdef99b/id-preview-01f8d21f--c1c4e2d7-5f4c-4178-8c79-c764dc0dc2e9.lovable.app-1779854480451.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Geeth Me",
          alternateName: "Geeth Me Sea Food Restaurant",
          url: "https://geeth-me-restaurant-tco.lovable.app",
          description: "Sri Lankan seafood restaurant on the Trincomalee coast since 2004. Known for crab curry, kottu roti and devilled prawns.",
          telephone: "+94771505771",
          foundingDate: "2004",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Dockyard Road",
            addressLocality: "Trincomalee",
            addressCountry: "LK",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <OrderProvider>
            <SmoothScroll />
            <ScrollProgress />

            <PageTransition>
              <Outlet />
            </PageTransition>
            <ScrollToTop />
            <Toaster />
            <AdminEditBanner />


          </OrderProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
