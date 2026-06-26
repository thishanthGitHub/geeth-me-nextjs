import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Minus, Plus, Trash2, QrCode, ScanLine, Copy, Check } from "lucide-react";
import { encodeOrder, fmtLKR, lineUnit, useOrder } from "@/lib/order";
import { getOrSetSessionId, getTableFromUrl } from "@/lib/session";

export function OrderSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, total, count, setQty, clear, saveOrder } = useOrder();
  const [table, setTable] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [orderUrl, setOrderUrl] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = getTableFromUrl();
    if (t) setTable((p) => p || t);
    getOrSetSessionId();
  }, []);

  useEffect(() => {
    if (!showQr || typeof window === "undefined") return;
    const encoded = encodeOrder(lines, table, getOrSetSessionId());
    const url = `${window.location.origin}/order?d=${encoded}`;
    setOrderUrl(url);
    QRCode.toDataURL(url, { margin: 1, width: 480, color: { dark: "#0a0a0a", light: "#ffffff" } })
      .then(setQrUrl).catch(() => setQrUrl(null));
  }, [showQr, lines, table]);

  useEffect(() => { if (!open) { setShowQr(false); setCopied(false); } }, [open]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-3 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative w-full max-w-md bg-card border border-border rounded-2xl flex flex-col max-h-[90dvh] overflow-hidden shadow-2xl">
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-accent">Your order</div>
            <h2 className="font-display text-2xl text-foreground leading-tight">
              {count} {count === 1 ? "item" : "items"}
            </h2>
          </div>
          <button aria-label="Close" onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-background min-h-11 min-w-11 inline-flex items-center justify-center">
            <X size={20} />
          </button>
        </header>

        {!showQr ? (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <p className="text-center text-muted-foreground py-12 text-sm">Tap + on any dish to add it here.</p>
              ) : (
                <ul className="space-y-3">
                  {lines.map((l) => (
                    <li key={`${l.n}-${l.variant ?? ""}`} className="flex items-start gap-3 rounded-xl border border-border bg-background/40 p-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-foreground leading-snug">
                          {l.name}
                          {l.variant && <span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground">{l.variant === "s" ? "Small" : "Regular"}</span>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 tabular-nums">{fmtLKR(lineUnit(l))} · #{String(l.n).padStart(2, "0")}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button aria-label="Decrease" onClick={() => setQty(l.n, l.variant, l.qty - 1)} className="rounded-full border border-border w-8 h-8 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/60">
                          {l.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                        </button>
                        <span className="w-7 text-center text-sm tabular-nums text-foreground">{l.qty}</span>
                        <button aria-label="Increase" onClick={() => setQty(l.n, l.variant, l.qty + 1)} className="rounded-full border border-border w-8 h-8 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/60">
                          <Plus size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <footer className="border-t border-border px-5 py-4 space-y-3">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Table number (optional)</span>
                <input value={table} onChange={(e) => setTable(e.target.value)} inputMode="numeric" placeholder="e.g. 12"
                  className="mt-1.5 w-full rounded-full bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
              </label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-2xl text-foreground tabular-nums">{fmtLKR(total)}</span>
              </div>
              <div className="flex gap-2">
                <button disabled={lines.length === 0} onClick={() => { saveOrder(table); setShowQr(true); }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-3 text-sm font-medium min-h-11 disabled:opacity-40 hover:opacity-90">
                  <QrCode size={16} className="icon-pulse" /> Show waiter QR
                </button>
                {lines.length > 0 && (
                  <button onClick={clear} className="rounded-full border border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-destructive/60 min-h-11" aria-label="Clear">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-accent border border-border">
              <ScanLine size={12} className="icon-pulse" /> Show this to your waiter
            </div>
            <h3 className="mt-4 font-display text-2xl text-foreground">
              {count} {count === 1 ? "item" : "items"} · {fmtLKR(total)}
            </h3>
            {table && <p className="text-sm text-muted-foreground mt-1">Table {table}</p>}
            <div className="mt-6 p-4 rounded-2xl bg-white shadow-2xl">
              {qrUrl ? <img src={qrUrl} alt="Order QR" className="block w-64 h-64" /> :
                <div className="w-64 h-64 grid place-items-center text-stone-500 text-sm">Generating…</div>}
            </div>
            <p className="mt-5 text-xs text-muted-foreground max-w-xs">Your waiter will scan this to open the full order — no app needed.</p>
            {orderUrl && (
              <button onClick={async () => {
                try { await navigator.clipboard.writeText(orderUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
              }} className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground">
                {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
                {copied ? "Link copied" : "Copy order link"}
              </button>
            )}
            <button onClick={() => setShowQr(false)} className="mt-6 text-sm text-accent hover:underline">← Back to order</button>
          </div>
        )}
      </aside>
    </div>
  );
}
