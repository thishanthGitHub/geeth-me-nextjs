import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Mail, Lock, Phone, User as UserIcon, ArrowLeft, Sparkles, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";


export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Geeth Me Rewards" },
      { name: "description", content: "Optional account for Geeth Me regulars — unlock loyalty offers, saved orders and faster reservations at the Trincomalee restaurant." },
      { property: "og:title", content: "Sign in — Geeth Me Rewards" },
      { property: "og:description", content: "Loyalty offers, saved orders and faster reservations at Geeth Me, Trincomalee." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(6, "At least 6 characters").max(72);
const nameSchema = z.string().trim().min(1, "Name required").max(80);
const phoneSchema = z.string().trim().min(7, "Enter a valid phone").max(20).regex(/^[+0-9 ()-]+$/, "Digits, spaces, + - ( ) only");

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => { if (!loading && user) navigate({ to: "/account" }); }, [loading, user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null);
    const em = emailSchema.safeParse(email);
    if (!em.success) return setError(em.error.issues[0].message);
    const pw = passwordSchema.safeParse(password);
    if (!pw.success) return setError(pw.error.issues[0].message);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const nm = nameSchema.safeParse(fullName);
        if (!nm.success) { setError(nm.error.issues[0].message); return; }
        const ph = phoneSchema.safeParse(phone);
        if (!ph.success) { setError(ph.error.issues[0].message); return; }
        const { error } = await supabase.auth.signUp({
          email: em.data, password: pw.data,
          options: { emailRedirectTo: `${window.location.origin}/account`, data: { full_name: nm.data, phone: ph.data } },
        });
        if (error) throw error;
        setInfo("Check your email to confirm your account, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: em.data, password: pw.data });
        if (error) throw error;
        navigate({ to: "/account" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setSubmitting(false); }
  };

  const handleGoogle = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/account` });
    if (result.error) { setError(result.error.message ?? "Google sign-in failed"); return; }
    if (result.redirected) return;
    navigate({ to: "/account" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Nav />
      <div className="flex-1 mx-auto w-full max-w-md px-4 pt-28 pb-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent">
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div className="mt-4 rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
          <header className="px-6 py-5 border-b border-border bg-accent/10 relative">
            <Flame size={56} className="absolute -top-2 right-4 text-accent/15 icon-flame pointer-events-none" />
            <div className="inline-flex items-center gap-2 text-fluid-eyebrow uppercase text-accent">
              <Sparkles size={12} className="icon-sparkle" /> Geeth Me Rewards
            </div>
            <h1 className="mt-1 font-display text-fluid-h2 text-foreground">
              {mode === "signin" ? "Welcome back" : "Join the regulars"}
            </h1>
            <p className="mt-1 text-fluid-body text-muted-foreground">
              {mode === "signin" ? "Sign in for offers, faster orders, and birthday treats." : "Optional — only for regulars who want offers & rewards."}
            </p>
          </header>


          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
            {mode === "signup" && (
              <>
                <Field icon={<UserIcon size={14} />} label="Full name">
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" maxLength={80} required
                    className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" placeholder="e.g. Nimal Perera" />
                </Field>
                <Field icon={<Phone size={14} />} label="Phone (for offers)">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" maxLength={20} required
                    className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" placeholder="+94 77 123 4567" />
                </Field>
              </>
            )}
            <Field icon={<Mail size={14} />} label="Email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" maxLength={255} required
                className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" placeholder="you@example.com" />
            </Field>
            <Field icon={<Lock size={14} />} label="Password">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={6} maxLength={72} required
                className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" placeholder="••••••••" />
            </Field>

            {error && <p role="alert" className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">{error}</p>}
            {info && <p className="text-xs text-foreground bg-accent/10 border border-accent/30 rounded-lg px-3 py-2">{info}</p>}

            <button type="submit" disabled={submitting}
              className="w-full rounded-full bg-accent text-accent-foreground px-5 py-3 text-sm font-medium min-h-11 disabled:opacity-50 hover:opacity-90">
              {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center" aria-hidden><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-card px-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">or</span></div>
            </div>

            <button type="button" onClick={handleGoogle}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground min-h-11 hover:bg-card">
              <GoogleMark /> Continue with Google
            </button>

            <p className="text-center text-xs text-muted-foreground pt-2">
              {mode === "signin" ? "New to Geeth Me?" : "Already have an account?"}{" "}
              <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }}
                className="text-accent hover:underline font-medium">
                {mode === "signin" ? "Create one" : "Sign in"}
              </button>
            </p>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Ordering & QR work without signing in — this is only for offers.
        </p>
      </div>
      <Footer />
    </div>
  );
}


function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center gap-2 rounded-full bg-background border border-border px-4 py-2.5 focus-within:ring-2 focus-within:ring-accent">
        <span className="text-muted-foreground">{icon}</span>
        {children}
      </div>
    </label>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.3 2.4-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.2C40.6 35.9 44 30.5 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
