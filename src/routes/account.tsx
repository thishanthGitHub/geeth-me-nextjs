import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { LogOut, Sparkles, Gift, Save, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { fmtLKR, useOrder } from "@/lib/order";
import { KitchenLoader } from "@/components/site/KitchenLoader";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — Geeth Me" },
      { name: "description", content: "Manage your Geeth Me profile, saved orders, contact details and loyalty offers for the Trincomalee restaurant." },
      { property: "og:title", content: "My account — Geeth Me" },
      { property: "og:description", content: "Manage your Geeth Me profile, saved orders and loyalty offers." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AccountPage,
});

const nameSchema = z.string().trim().min(1).max(80);
const phoneSchema = z.string().trim().min(7).max(20).regex(/^[+0-9 ()-]+$/);

function AccountPage() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { savedOrders } = useOrder();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [loading, user, navigate]);
  useEffect(() => { setFullName(profile?.full_name ?? ""); setPhone(profile?.phone ?? ""); }, [profile]);

  if (loading || !user) return <KitchenLoader fullscreen label="Plating your account…" />;

  const save = async () => {
    setErr(null); setMsg(null);
    const n = nameSchema.safeParse(fullName); if (!n.success) return setErr("Enter a valid name");
    const p = phoneSchema.safeParse(phone); if (!p.success) return setErr("Enter a valid phone number");
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, full_name: n.data, phone: p.data });
    setSaving(false);
    if (error) return setErr(error.message);
    setMsg("Saved");
    await refreshProfile();
    setTimeout(() => setMsg(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent">
          <ArrowLeft size={14} /> Back to home
        </Link>

        <header className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
          <div className="px-6 py-5 bg-accent/10">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-accent">
              <Sparkles size={12} className="icon-sparkle" /> Geeth Me Regular
            </div>
            <h1 className="mt-1 font-display text-3xl text-foreground leading-tight">
              {profile?.full_name || "Welcome"}
            </h1>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>

          <div className="px-6 py-5 space-y-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Full name</span>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={80}
                className="mt-1 w-full rounded-full bg-background border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Phone (for offers)</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" maxLength={20}
                className="mt-1 w-full rounded-full bg-background border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
            </label>
            {err && <p className="text-xs text-destructive">{err}</p>}
            {msg && <p className="text-xs text-accent">{msg}</p>}
            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={save} disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-sm font-medium min-h-11 disabled:opacity-50 hover:opacity-90">
                <Save size={14} /> {saving ? "Saving…" : "Save profile"}
              </button>
              <button onClick={async () => { await signOut(); navigate({ to: "/" }); }}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-destructive/60 min-h-11">
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Gift size={16} className="text-accent icon-wiggle-hover" />
            <h2 className="font-display text-xl text-foreground">Your offers</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            No active offers yet. We'll send your first welcome offer to {phone || "your phone"} soon.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl text-foreground mb-3">Recent orders</h2>
          {savedOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Your QR-shared orders will show up here. <Link to="/menu" className="text-accent hover:underline">Open the menu</Link>.
            </p>
          ) : (
            <ul className="space-y-2">
              {savedOrders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3">
                  <div>
                    <div className="text-sm text-foreground">
                      {o.count} {o.count === 1 ? "item" : "items"}
                      {o.table && <span className="text-muted-foreground"> · Table {o.table}</span>}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{new Date(o.date).toLocaleString("en-LK", { dateStyle: "medium", timeStyle: "short" })}</div>
                  </div>
                  <div className="font-display text-lg text-accent tabular-nums">{fmtLKR(o.total)}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
