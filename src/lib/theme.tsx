import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default to "dark" on server to match the pre-hydration shell.
  const [theme, setThemeState] = useState<Theme>("dark");

  // After mount, sync to what the inline script already set on <html>.
  useEffect(() => {
    const t = document.documentElement.classList.contains("light") ? "light" : "dark";
    setThemeState(t);
  }, []);

  const applyTheme = (t: Theme) => {
    setThemeState(t);
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(t);
    try { localStorage.setItem("theme", t); } catch {}
  };

  const setTheme = (t: Theme) => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    if (
      doc.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      doc.startViewTransition(() => applyTheme(t));
    } else {
      applyTheme(t);
    }
  };

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
