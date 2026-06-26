import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { MENU } from "@/data/menu";
import { decodeOrder, fmtLKR } from "@/lib/order";
import { CheckCircle2, AlertTriangle, ArrowLeft, QrCode, Sparkles, ShoppingBag } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";


export const Route = createFileRoute("/order")({
  validateSearch: z.object({ d: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Your order — Geeth Me" },
      { name: "description", content: "Your Geeth Me order summary — show this screen to a waiter to place dishes directly from the table at the Trincomalee restaurant." },
      { property: "og:title", content: "Your order — Geeth Me" },
      { property: "og:description", content: "Order summary preview for waiter scanning at Geeth Me, Trincomalee." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: OrderViewPage,
});

function OrderViewPage() {
  const { d } = Route.useSearch();
  if (!d) return <Empty title="No order to show" msg="Open the menu, add a few dishes, then tap Show waiter QR." />;
  const decoded = decodeOrder(d);
  if (!decoded) return <Empty title="Invalid QR" msg="This order link looks corrupt. Ask the guest to regenerate." />;

  const all = MENU.flatMap((s) => s.items);
  type Row = { n: number; name: string; qty: number; variant?: "s" | "r"; unit: number; line: number };
  const rows: Row[] = [];
  let total = 0, missing = 0;
  for (const it of decoded.items) {
    const item = all.find((x) => x.n === it.n);
    if (!item) { missing++; continue; }
    const unit = typeof item.price === "number" ? item.price : it.variant === "s" ? item.price.s : item.price.r;
    const line = unit * it.qty;
    total += line;
    rows.push({ n: item.n, name: item.name, qty: it.qty, variant: it.variant, unit, line });
  }
  const count = rows.reduce((a, r) => a + r.qty, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Nav />
      <div className="flex-1 mx-auto w-full max-w-2xl px-4 pt-28 pb-10">
        <Link to="/menu" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent">
          <ArrowLeft size={14} /> Back to menu
        </Link>

        <div className="mt-4 rounded-2xl border border-accent/30 bg-card overflow-hidden shadow-2xl">
          <header className="px-6 py-5 border-b border-border flex items-center gap-3 bg-accent/10 relative">
            <CheckCircle2 className="text-accent icon-pulse" size={22} />
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-fluid-eyebrow uppercase text-accent">
                <Sparkles size={10} className="icon-sparkle" /> Customer order
              </div>
              <h1 className="font-display text-fluid-h3 text-foreground">
                {count} {count === 1 ? "item" : "items"}
                {decoded.table && <span className="ml-2 text-muted-foreground">· Table {decoded.table}</span>}
              </h1>
            </div>
          </header>

          <ul className="divide-y divide-border/60">
            {rows.map((r) => (
              <li key={`${r.n}-${r.variant ?? ""}`} className="px-6 py-4 flex items-start gap-4">
                <span className="text-fluid-eyebrow text-muted-foreground tabular-nums w-8 pt-1.5 font-medium">#{String(r.n).padStart(2, "0")}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-fluid-body text-foreground leading-snug">
                    {r.name}
                    {r.variant && <span className="ml-2 text-fluid-eyebrow uppercase text-muted-foreground">{r.variant === "s" ? "Small" : "Regular"}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 tabular-nums">{r.qty} × {fmtLKR(r.unit)}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg text-foreground tabular-nums">{fmtLKR(r.line)}</div>
                  <div className="text-fluid-eyebrow uppercase text-accent mt-0.5">×{r.qty}</div>
                </div>
              </li>
            ))}
          </ul>

          <footer className="px-6 py-5 border-t border-border bg-background/40 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total to bill</span>
            <span className="font-display text-fluid-h3 text-accent tabular-nums">{fmtLKR(total)}</span>
          </footer>
        </div>

        {missing > 0 && (
          <p className="mt-4 inline-flex items-center gap-2 text-xs text-destructive">
            <AlertTriangle size={14} /> {missing} item(s) were not found in the current menu.
          </p>
        )}
        <p className="mt-6 text-center text-xs text-muted-foreground">Confirm this with the guest, then key it into the POS.</p>
      </div>
      <Footer />
    </div>
  );
}

function Empty({ title, msg }: { title: string; msg: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Nav />
      <div className="flex-1 mx-auto w-full max-w-md px-4 pt-32 pb-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/30 mb-6">
          <QrCode size={26} className="text-accent icon-pulse" />
        </div>
        <div className="inline-flex items-center gap-2 text-fluid-eyebrow uppercase text-accent mb-3">
          <Sparkles size={10} className="icon-sparkle" /> Waiter QR
        </div>
        <h1 className="font-display text-fluid-h2 text-foreground">{title}</h1>
        <p className="mt-3 text-fluid-body text-muted-foreground">{msg}</p>
        <Link to="/menu" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 min-h-11">
          <ShoppingBag size={16} className="icon-wiggle-hover" /> Open menu
        </Link>
      </div>
      <Footer />
    </div>
  );

}
