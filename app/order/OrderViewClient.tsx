"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, AlertTriangle, ArrowLeft, QrCode,
  Sparkles, ShoppingBag, UtensilsCrossed, Clock,
} from "lucide-react";
import { decodeOrder, fmtLKR } from "@/lib/order";
import type { MenuSection } from "@/lib/menu-types";
import type { Price } from "@/lib/menu-types";

// ─── helpers ────────────────────────────────────────────────────────────────

function priceOf(price: Price, variant?: "s" | "r"): number {
  if (typeof price === "number") return price;
  return variant === "s" ? price.s : price.r;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function Empty({ title, msg }: { title: string; msg: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/30 mb-6">
        <QrCode size={26} className="text-accent icon-pulse" />
      </div>
      <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-accent mb-3">
        <Sparkles size={10} className="icon-sparkle" /> Waiter QR
      </div>
      <h1 className="font-display text-3xl text-foreground text-center">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground text-center max-w-xs">{msg}</p>
      <Link
        href="/menu"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90"
      >
        <ShoppingBag size={16} /> Open menu
      </Link>
    </div>
  );
}

// ─── inner component (uses useSearchParams) ──────────────────────────────────

function OrderViewInner({ menu }: { menu: MenuSection[] }) {
  const params = useSearchParams();
  const d = params.get("d");

  // Record the moment this QR was first opened (scanned time)
  const [scannedAt] = useState(() => new Date());
  const scannedTime = scannedAt.toLocaleTimeString("en-LK", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const scannedDate = scannedAt.toLocaleDateString("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (!d) {
    return (
      <Empty
        title="No order to show"
        msg="Open the menu, add a few dishes, then tap Show waiter QR."
      />
    );
  }

  const decoded = decodeOrder(d);
  if (!decoded) {
    return (
      <Empty
        title="Invalid QR"
        msg="This order link looks corrupt. Ask the guest to regenerate it."
      />
    );
  }

  const allItems = menu.flatMap((s) => s.items);

  type Row = {
    n: number;
    name: string;
    section: string;
    qty: number;
    variant?: "s" | "r";
    unit: number;
    line: number;
  };

  const rows: Row[] = [];
  let missing = 0;

  for (const it of decoded.items) {
    const item = allItems.find((x) => x.n === it.n);
    if (!item) { missing++; continue; }
    const section = menu.find((s) => s.items.some((x) => x.n === it.n))?.title ?? "";
    const unit = priceOf(item.price, it.variant);
    rows.push({
      n: item.n,
      name: item.name,
      section,
      qty: it.qty,
      variant: it.variant,
      unit,
      line: unit * it.qty,
    });
  }

  const total = rows.reduce((a, r) => a + r.line, 0);
  const count = rows.reduce((a, r) => a + r.qty, 0);

  // Group rows by menu section for the waiter's readability
  const grouped = menu
    .map((s) => ({
      title: s.title,
      rows: rows.filter((r) => r.section === s.title),
    }))
    .filter((g) => g.rows.length > 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── top bar ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Link href="/menu" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent shrink-0">
          <ArrowLeft size={14} /> Menu
        </Link>
        <div className="flex-1 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-accent font-medium">
            Waiter View
          </span>
        </div>
        {/* spacer to balance the back link */}
        <span className="w-14" />
      </header>

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8 space-y-6">

        {/* ── order summary card ── */}
        <div className="rounded-2xl border border-accent/30 bg-card overflow-hidden shadow-xl">

          {/* card header */}
          <div className="px-5 py-4 border-b border-border bg-accent/10">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-accent icon-pulse shrink-0 mt-1" size={22} />
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-accent">
                  <Sparkles size={10} className="icon-sparkle" /> Customer order
                </div>
                <h1 className="font-display text-2xl text-foreground leading-tight">
                  {count} {count === 1 ? "item" : "items"}
                  {decoded.table && (
                    <span className="ml-2 text-muted-foreground text-xl">
                      · Table {decoded.table}
                    </span>
                  )}
                </h1>
              </div>
            </div>
            {/* scanned timestamp */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={12} className="text-accent shrink-0" />
              <span>Scanned at</span>
              <span className="font-medium text-foreground tabular-nums">{scannedTime}</span>
              <span className="text-border">·</span>
              <span className="tabular-nums">{scannedDate}</span>
            </div>
          </div>

          {/* grouped order rows */}
          <div className="divide-y divide-border/60">
            {grouped.map((g) => (
              <div key={g.title}>
                {/* section label */}
                <div className="px-5 py-2 bg-card/60 flex items-center gap-2">
                  <UtensilsCrossed size={12} className="text-accent" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {g.title}
                  </span>
                </div>

                {/* items in section */}
                {g.rows.map((r) => (
                  <div
                    key={`${r.n}-${r.variant ?? ""}`}
                    className="px-5 py-4 flex items-start gap-4 hover:bg-card/50 transition-colors"
                  >
                    {/* item number badge */}
                    <span className="shrink-0 w-10 h-10 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tabular-nums flex items-center justify-center">
                      #{String(r.n).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug font-medium">
                        {r.name}
                        {r.variant && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground font-normal">
                            {r.variant === "s" ? "Small" : "Regular"}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                        {r.qty} × {fmtLKR(r.unit)}
                      </p>
                    </div>

                    {/* qty pill + line total */}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-accent font-semibold bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">
                        ×{r.qty}
                      </span>
                      <span className="font-display text-lg text-foreground tabular-nums">
                        {fmtLKR(r.line)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* total footer */}
          <div className="px-5 py-4 border-t border-border bg-background/40 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Total to bill</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {count} {count === 1 ? "dish" : "dishes"} · incl. all sizes
              </p>
            </div>
            <span className="font-display text-3xl text-accent tabular-nums">
              {fmtLKR(total)}
            </span>
          </div>
        </div>

        {/* ── missing items warning ── */}
        {missing > 0 && (
          <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">
            <AlertTriangle size={14} className="shrink-0" />
            {missing} item{missing > 1 ? "s" : ""} in the QR could not be matched to the current menu.
          </div>
        )}

        {/* ── waiter note ── */}
        <p className="text-center text-xs text-muted-foreground pb-6">
          Confirm this order with the guest, then key it into the POS.
        </p>
      </main>
    </div>
  );
}

// ─── exported component (wraps in Suspense for useSearchParams) ──────────────

export function OrderViewClient({ menu }: { menu: MenuSection[] }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-sm text-muted-foreground animate-pulse">Loading order…</div>
        </div>
      }
    >
      <OrderViewInner menu={menu} />
    </Suspense>
  );
}
