"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MenuItem, Price } from "@/lib/menu-types";
import { getOrSetSessionId, getTableFromUrl } from "@/lib/session";

export type OrderLine = {
  n: number;
  name: string;
  price: Price;
  variant?: "s" | "r";
  qty: number;
};

export type SavedOrder = {
  id: string;
  date: string;
  sessionId: string;
  table: string;
  lines: OrderLine[];
  total: number;
  count: number;
};

type OrderCtx = {
  lines: OrderLine[];
  count: number;
  total: number;
  add: (item: MenuItem, variant?: "s" | "r") => void;
  setQty: (n: number, variant: "s" | "r" | undefined, qty: number) => void;
  clear: () => void;
  savedOrders: SavedOrder[];
  saveOrder: (table: string) => SavedOrder | null;
};

const Ctx = createContext<OrderCtx | null>(null);
const KEY = "geethme.order.v1";
const ORDERS_KEY = "geethme.orders.v1";

const priceOf = (l: OrderLine): number =>
  typeof l.price === "number"
    ? l.price
    : l.variant === "s"
    ? l.price.s
    : l.price.r;

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [savedOrders, setSavedOrders] = useState<SavedOrder[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
      const rawOrders = localStorage.getItem(ORDERS_KEY);
      if (rawOrders) setSavedOrders(JSON.parse(rawOrders));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(savedOrders));
    } catch {}
  }, [savedOrders]);

  const value = useMemo<OrderCtx>(
    () => ({
      lines,
      count: lines.reduce((a, l) => a + l.qty, 0),
      total: lines.reduce((a, l) => a + priceOf(l) * l.qty, 0),
      add: (item, variant) =>
        setLines((prev) => {
          const v =
            typeof item.price === "number" ? undefined : variant ?? "r";
          const i = prev.findIndex(
            (l) => l.n === item.n && l.variant === v
          );
          if (i >= 0) {
            const copy = [...prev];
            copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
            return copy;
          }
          return [
            ...prev,
            { n: item.n, name: item.name, price: item.price, variant: v, qty: 1 },
          ];
        }),
      setQty: (n, variant, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => !(l.n === n && l.variant === variant))
            : prev.map((l) =>
                l.n === n && l.variant === variant ? { ...l, qty } : l
              )
        ),
      clear: () => setLines([]),
      savedOrders,
      saveOrder: (table) => {
        if (lines.length === 0) return null;
        const total = lines.reduce((a, l) => a + priceOf(l) * l.qty, 0);
        const count = lines.reduce((a, l) => a + l.qty, 0);
        const resolvedTable = (table || getTableFromUrl() || "").toString();
        const order: SavedOrder = {
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `o_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          date: new Date().toISOString(),
          sessionId: getOrSetSessionId(),
          table: resolvedTable,
          lines: lines.map((l) => ({ ...l })),
          total,
          count,
        };
        setSavedOrders((prev) => [order, ...prev].slice(0, 50));
        return order;
      },
    }),
    [lines, savedOrders]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrder() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOrder must be used inside OrderProvider");
  return c;
}

export const fmtLKR = (n: number) => `Rs ${n.toLocaleString("en-LK")}`;
export const lineUnit = priceOf;

export function encodeOrder(
  lines: OrderLine[],
  table?: string,
  sessionId?: string
): string {
  const compact = {
    t: table || "",
    s: sessionId || "",
    i: lines.map((l) => [
      l.n,
      l.qty,
      l.variant === "s" ? 0 : l.variant === "r" ? 1 : -1,
    ]),
  };
  const json = JSON.stringify(compact);
  if (typeof window === "undefined") return "";
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeOrder(b64: string): {
  table: string;
  sessionId: string;
  items: { n: number; qty: number; variant?: "s" | "r" }[];
} | null {
  try {
    const json = decodeURIComponent(escape(atob(b64)));
    const obj = JSON.parse(json) as {
      t: string;
      s?: string;
      i: [number, number, number][];
    };
    return {
      table: obj.t,
      sessionId: obj.s ?? "",
      items: obj.i.map(([n, qty, v]) => ({
        n,
        qty,
        variant: v === 0 ? "s" : v === 1 ? "r" : undefined,
      })),
    };
  } catch {
    return null;
  }
}
