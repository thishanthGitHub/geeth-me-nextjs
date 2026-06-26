import type { Metadata } from "next";
import { parseMenuTxt } from "@/lib/menu-parser";
import { OrderViewClient } from "./OrderViewClient";

export const metadata: Metadata = {
  title: "Order — Geeth Me",
  description: "Waiter order view for Geeth Me Restaurant.",
  robots: { index: false, follow: false },
};

export default function OrderPage() {
  // Pass full menu to client so it can resolve item names/prices from the QR data
  const menu = parseMenuTxt();
  return <OrderViewClient menu={menu} />;
}
