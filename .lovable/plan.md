
# Clone Restaurant Goma — Animated Single Page

Build a pixel-faithful clone of the Restaurant Goma landing page shown in the reference, with rich scroll-driven animations (GSAP ScrollTrigger) and component motion (Framer Motion).

## Scope (sections, top → bottom)

1. **Hero** — Full-bleed dark cinematic shot of salmon on a smoky pan. Top nav: "GOMA" logo (left), "MENU ☰" (right). Centered overlay: "Restaurant Goma" headline (left), service hours block (center), short Omakase intro paragraph (right), CTAs: "Book your table" (outlined) + "Explore our menu →".
2. **Marquee strip** — Horizontal scrolling text: "UMAMI · BOOK YOUR TABLE · GOMA · …" repeating.
3. **Intro / About** — Two-column: amber headline ("Exceptional japanese dining experience in the heart of Odense.") + image of soy being poured; right column body copy about Kaiseki dining, with bold inline emphasis.
4. **Image gallery row** — Three food photos side-by-side (full-bleed).
5. **Menu teaser** — Section listing a few signature dishes with prices, dark cards.
6. **Booking CTA** — Large headline + button to reserve.
7. **Footer** — Address (Odense), opening hours, social links, small print.

(Sections 5–7 are inferred — the screenshot only shows the first 4. I'll keep them stylistically consistent.)

## Visual system

- Palette: near-black background `#0a0a0a`, off-white text, warm amber accent `#d4a574`-ish for headlines.
- Type: display serif/sans pair — **Fraunces** or **Cormorant** for the amber headline, **Inter** / **Space Grotesk** for body and nav. Will set via Google Fonts in `styles.css` and wire as design tokens in `oklch`.
- Tokens added to `src/styles.css`: `--accent` (amber), `--background` (near-black), gradient + shadow tokens for the hero vignette.
- Layout: generous negative space, full-bleed hero, max-width container (~1280px) for content sections.

## Animations

**GSAP + ScrollTrigger**
- Hero: subtle parallax on the salmon image; smoke layer drifts slower than foreground on scroll.
- Marquee: infinite horizontal loop driven by GSAP, speed slows on hover.
- Intro section: pinned headline while right-column paragraphs scroll past (mini scrollytelling).
- Gallery row: images scale/translate in as they enter viewport with stagger.
- Section headlines: word-by-word reveal via SplitText-style spans (manual split, no paid plugin).

**Framer Motion**
- Nav: slide down on mount, MENU button morphs on hover.
- CTAs: hover scale + underline grow.
- Page transitions / fade-in on first paint.
- Image cards: `whileHover` zoom inside fixed frame.

Initialize GSAP in a `useGsapScroll` hook with `useGSAP` + cleanup; register `ScrollTrigger` once.

## Assets

Generate 4–6 images via `imagegen` (premium where text/detail matters):
- Hero: salmon fillet on cast-iron pan with smoke, top-down, moody dark.
- Pouring soy over a plated dish (intro section).
- Three gallery shots: sashimi platter, grilled dish in clay pot, nigiri close-up.
Saved to `src/assets/` and imported as ES6 modules.

## File plan

- `src/routes/index.tsx` — assemble sections, replace placeholder.
- `src/components/site/Nav.tsx`
- `src/components/site/Hero.tsx`
- `src/components/site/Marquee.tsx`
- `src/components/site/Intro.tsx`
- `src/components/site/Gallery.tsx`
- `src/components/site/MenuTeaser.tsx`
- `src/components/site/BookingCTA.tsx`
- `src/components/site/Footer.tsx`
- `src/hooks/use-gsap-scroll.ts` — registers ScrollTrigger, exposes helpers.
- `src/styles.css` — add fonts, accent token, marquee keyframes fallback.
- `src/routes/__root.tsx` — update `head()` title/description/og to "Restaurant Goma — Japanese dining in Odense".

## Dependencies to add

- `gsap` (includes ScrollTrigger, free)
- `framer-motion`

## Technical notes

- All animations run client-side; guard `ScrollTrigger.create` behind `useEffect` so SSR doesn't touch `window`.
- Marquee uses transform-only animation for 60fps.
- Respect `prefers-reduced-motion`: skip parallax and stagger reveals.
- Single H1 in Hero, semantic `<section>` per block, alt text on every image.
- Mobile (390px viewport user is previewing on): hero text stacks, marquee shrinks, gallery becomes horizontal snap-scroll.

## Out of scope

- Real reservation backend — "Book your table" is a visual CTA only.
- CMS / dynamic menu data — hard-coded content.
