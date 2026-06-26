import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Save, Trash2, ChevronDown, ChevronUp, ShieldAlert, Loader2, Sparkles, Flame } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useIsAdmin, useMenu } from "@/hooks/use-menu";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { KitchenLoader } from "@/components/site/KitchenLoader";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Geeth Me" },
      { name: "description", content: "Manage Geeth Me menu sections, items and pricing." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Draft = {
  // section drafts keyed by section id
  sections: Record<string, { title: string; note: string; sort_order: number }>;
  items: Record<
    number,
    { name: string; price: string; price_s: string; price_r: string; sort_order: number }
  >;
};

const empty: Draft = { sections: {}, items: {} };

function AdminPage() {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: menu = [] } = useMenu();

  const [draft, setDraft] = useState<Draft>(empty);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  // Seed draft from latest menu
  useEffect(() => {
    if (!menu.length) return;
    const d: Draft = { sections: {}, items: {} };
    menu.forEach((s, sIdx) => {
      d.sections[s.id] = { title: s.title, note: s.note ?? "", sort_order: (sIdx + 1) * 10 };
      s.items.forEach((i, iIdx) => {
        const isVar = typeof i.price !== "number";
        d.items[i.n] = {
          name: i.name,
          price: isVar ? "" : String(i.price),
          price_s: isVar ? String((i.price as { s: number }).s) : "",
          price_r: isVar ? String((i.price as { r: number }).r) : "",
          sort_order: iIdx + 1,
        };
      });
    });
    setDraft(d);
    if (!openSection && menu[0]) setOpenSection(menu[0].id);
  }, [menu, openSection]);

  if (loading || roleLoading) {
    return <KitchenLoader fullscreen label="Unlocking the kitchen…" />;
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <div className="mx-auto max-w-md px-6 py-32 text-center">
          <ShieldAlert className="mx-auto text-accent" size={36} />
          <h1 className="mt-6 font-display text-3xl">Admins only</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account doesn't have admin access. Ask a current admin to grant you the role.
          </p>
          <Link to="/" className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent hover:underline">
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>
      </div>
    );
  }

  const refresh = () => qc.invalidateQueries({ queryKey: ["menu"] });

  // ---------- section ops ----------
  const saveSection = async (id: string) => {
    const d = draft.sections[id];
    if (!d) return;
    setBusy(`section:${id}`);
    const { error } = await supabase
      .from("menu_sections")
      .update({ title: d.title, note: d.note || null, sort_order: d.sort_order })
      .eq("id", id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Section saved");
    refresh();
  };

  const deleteSection = async (id: string) => {
    if (!confirm("Delete this section and all its dishes?")) return;
    setBusy(`section:${id}`);
    const { error } = await supabase.from("menu_sections").delete().eq("id", id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Section deleted");
    refresh();
  };

  const addSection = async () => {
    const title = prompt("New section title?");
    if (!title) return;
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    if (!id) return toast.error("Invalid section id");
    setBusy("new-section");
    const sort_order = (menu.length + 1) * 10;
    const { error } = await supabase.from("menu_sections").insert({ id, title, sort_order });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Section added");
    setOpenSection(id);
    refresh();
  };

  // ---------- item ops ----------
  const saveItem = async (sectionId: string, n: number) => {
    const d = draft.items[n];
    if (!d) return;
    const hasSingle = d.price.trim() !== "";
    const hasVar = d.price_s.trim() !== "" && d.price_r.trim() !== "";
    if (!hasSingle && !hasVar) return toast.error("Set a price or S+R prices");
    if (hasSingle && hasVar) return toast.error("Use either a single price OR S+R, not both");
    const payload = {
      name: d.name,
      sort_order: d.sort_order,
      price: hasSingle ? Number(d.price) : null,
      price_s: hasVar ? Number(d.price_s) : null,
      price_r: hasVar ? Number(d.price_r) : null,
      section_id: sectionId,
    };
    setBusy(`item:${n}`);
    const { error } = await supabase.from("menu_items").update(payload).eq("n", n);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`#${n} saved`);
    refresh();
  };

  const deleteItem = async (n: number) => {
    if (!confirm(`Delete dish #${n}?`)) return;
    setBusy(`item:${n}`);
    const { error } = await supabase.from("menu_items").delete().eq("n", n);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Dish deleted");
    refresh();
  };

  const addItem = async (sectionId: string) => {
    const name = prompt("Dish name?");
    if (!name) return;
    const priceStr = prompt("Price in LKR (leave blank for S/R)?", "500");
    const allNs = Object.keys(draft.items).map(Number);
    const nextN = (allNs.length ? Math.max(...allNs) : 0) + 1;
    const sectionItems = menu.find((s) => s.id === sectionId)?.items.length ?? 0;
    setBusy(`new-item:${sectionId}`);
    const base = {
      section_id: sectionId,
      n: nextN,
      name,
      sort_order: sectionItems + 1,
    };
    type ItemInsert = {
      section_id: string;
      n: number;
      name: string;
      sort_order: number;
      price: number | null;
      price_s: number | null;
      price_r: number | null;
    };
    let payload: ItemInsert;
    if (priceStr && !isNaN(Number(priceStr))) {
      payload = { ...base, price: Number(priceStr), price_s: null, price_r: null };
    } else {
      const sP = prompt("Small price (LKR)?");
      const rP = prompt("Regular price (LKR)?");
      if (!sP || !rP) {
        setBusy(null);
        return;
      }
      payload = { ...base, price: null, price_s: Number(sP), price_r: Number(rP) };
    }
    const { error } = await supabase.from("menu_items").insert(payload);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Dish added");
    refresh();
  };

  const sectionsSorted = useMemo(() => menu, [menu]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <section className="pt-24 border-b border-border bg-gradient-to-b from-card/50 to-background relative overflow-hidden">
        <Flame size={120} className="absolute -top-6 right-8 text-accent/10 icon-flame pointer-events-none hidden md:block" />
        <div className="mx-auto max-w-5xl px-6 py-10 relative">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent">
            <ArrowLeft size={14} /> Back to site
          </Link>
          <div className="mt-4 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/30 px-3 py-1 text-fluid-eyebrow uppercase text-accent">
                <Sparkles size={12} className="icon-sparkle" /> Admin
              </span>
              <h1 className="mt-3 font-display text-fluid-h1">
                Menu <span className="italic text-accent">manager</span>
              </h1>
              <p className="mt-2 text-fluid-body text-muted-foreground max-w-md">
                Edit any dish, price or section. Changes go live instantly.
              </p>
            </div>
            <button
              onClick={addSection}
              disabled={busy === "new-section"}
              className="group inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:opacity-90 active:scale-95 transition disabled:opacity-50 min-h-11"
            >
              <Plus size={14} className="icon-wiggle-hover" /> New section
            </button>
          </div>
        </div>
      </section>


      <main className="mx-auto max-w-5xl px-6 py-10 space-y-3 pb-20">
        {sectionsSorted.map((s) => {
          const sDraft = draft.sections[s.id];
          const open = openSection === s.id;
          return (
            <div key={s.id} className="rounded-2xl border border-border bg-card/40 overflow-hidden">
              <button
                onClick={() => setOpenSection(open ? null : s.id)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-card/70 transition"
              >
                <div className="text-left min-w-0">
                  <div className="font-display text-lg md:text-xl truncate">{sDraft?.title ?? s.title}</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                    {s.items.length} {s.items.length === 1 ? "dish" : "dishes"} · id: {s.id}
                  </div>
                </div>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {open && sDraft && (
                <div className="border-t border-border/60 px-5 py-5 space-y-5">
                  <div className="grid md:grid-cols-[1fr,1fr,90px,auto,auto] gap-3 items-end">
                    <Field label="Title">
                      <input
                        value={sDraft.title}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            sections: { ...d.sections, [s.id]: { ...sDraft, title: e.target.value } },
                          }))
                        }
                        className="input"
                      />
                    </Field>
                    <Field label="Note (optional)">
                      <input
                        value={sDraft.note}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            sections: { ...d.sections, [s.id]: { ...sDraft, note: e.target.value } },
                          }))
                        }
                        className="input"
                      />
                    </Field>
                    <Field label="Order">
                      <input
                        type="number"
                        value={sDraft.sort_order}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            sections: { ...d.sections, [s.id]: { ...sDraft, sort_order: Number(e.target.value) } },
                          }))
                        }
                        className="input"
                      />
                    </Field>
                    <button
                      onClick={() => saveSection(s.id)}
                      disabled={busy === `section:${s.id}`}
                      className="btn-primary"
                    >
                      <Save size={14} /> Save
                    </button>
                    <button
                      onClick={() => deleteSection(s.id)}
                      disabled={busy === `section:${s.id}`}
                      className="btn-danger"
                      title="Delete section"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {s.items.map((i) => {
                      const iDraft = draft.items[i.n];
                      if (!iDraft) return null;
                      return (
                        <div
                          key={i.n}
                          className="grid md:grid-cols-[40px,1fr,90px,90px,90px,70px,auto,auto] gap-2 items-center bg-background/60 rounded-xl border border-border/60 px-3 py-2.5"
                        >
                          <span className="text-[11px] tabular-nums text-muted-foreground">#{i.n}</span>
                          <input
                            value={iDraft.name}
                            onChange={(e) =>
                              setDraft((d) => ({
                                ...d,
                                items: { ...d.items, [i.n]: { ...iDraft, name: e.target.value } },
                              }))
                            }
                            className="input"
                            placeholder="Dish name"
                          />
                          <input
                            value={iDraft.price}
                            onChange={(e) =>
                              setDraft((d) => ({
                                ...d,
                                items: { ...d.items, [i.n]: { ...iDraft, price: e.target.value } },
                              }))
                            }
                            className="input"
                            placeholder="Price"
                            inputMode="numeric"
                          />
                          <input
                            value={iDraft.price_s}
                            onChange={(e) =>
                              setDraft((d) => ({
                                ...d,
                                items: { ...d.items, [i.n]: { ...iDraft, price_s: e.target.value } },
                              }))
                            }
                            className="input"
                            placeholder="S"
                            inputMode="numeric"
                          />
                          <input
                            value={iDraft.price_r}
                            onChange={(e) =>
                              setDraft((d) => ({
                                ...d,
                                items: { ...d.items, [i.n]: { ...iDraft, price_r: e.target.value } },
                              }))
                            }
                            className="input"
                            placeholder="R"
                            inputMode="numeric"
                          />
                          <input
                            type="number"
                            value={iDraft.sort_order}
                            onChange={(e) =>
                              setDraft((d) => ({
                                ...d,
                                items: { ...d.items, [i.n]: { ...iDraft, sort_order: Number(e.target.value) } },
                              }))
                            }
                            className="input"
                            title="Order"
                          />
                          <button
                            onClick={() => saveItem(s.id, i.n)}
                            disabled={busy === `item:${i.n}`}
                            className="btn-primary"
                          >
                            <Save size={12} />
                          </button>
                          <button
                            onClick={() => deleteItem(i.n)}
                            disabled={busy === `item:${i.n}`}
                            className="btn-danger"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => addItem(s.id)}
                      disabled={busy === `new-item:${s.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-accent/40 bg-accent/5 py-3 text-xs uppercase tracking-[0.2em] text-accent hover:bg-accent/10 transition"
                    >
                      <Plus size={14} /> Add dish to {sDraft.title}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>

      <style>{`
        .input { width: 100%; background: hsl(var(--background, 0 0% 100%)); background-color: var(--color-background); color: var(--color-foreground); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.85rem; outline: none; }
        .input:focus { border-color: var(--color-accent); box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-accent) 25%, transparent); }
        .btn-primary { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--color-accent); color: var(--color-accent-foreground); padding: 0.55rem 0.9rem; border-radius: 0.6rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 500; transition: opacity 0.15s; }
        .btn-primary:hover { opacity: 0.9; }
        .btn-primary:disabled { opacity: 0.5; }
        .btn-danger { display: inline-flex; align-items: center; gap: 0.4rem; background: color-mix(in oklab, var(--color-destructive) 18%, transparent); color: var(--color-destructive); padding: 0.55rem 0.7rem; border-radius: 0.6rem; font-size: 0.75rem; }
        .btn-danger:hover { background: color-mix(in oklab, var(--color-destructive) 28%, transparent); }
      `}</style>

      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}
