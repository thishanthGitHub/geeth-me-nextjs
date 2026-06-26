# Geeth.me Restaurant

A restaurant website with online ordering and admin management.

## Project Structure

```
/
├── src/                   # Vite + TanStack Start app (original, Cloudflare Workers)
├── nextjs/                # Next.js port (in progress)
├── supabase/              # Supabase migrations and config
├── public/                # Static assets for root app
└── wrangler.jsonc         # Cloudflare Workers config
```

## Apps

### Root app (`/`) — Vite + TanStack Start
- Runs on Cloudflare Workers via Wrangler
- Auth via Supabase
- Full routing: home, menu, order, admin, account, login

**Dev:**
```bash
npm install
npm run dev
```

**Deploy:**
```bash
npm run deploy
```

### Next.js app (`/nextjs`) — Next.js 15
- In-progress port of the root app
- App Router with server components

**Dev:**
```bash
cd nextjs
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

For the Next.js app, copy `nextjs/.env.local.example` to `nextjs/.env.local`.

## Tech Stack

- **Frontend:** React, TailwindCSS, shadcn/ui, GSAP
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Deployment:** Cloudflare Workers (root), Vercel (nextjs)
