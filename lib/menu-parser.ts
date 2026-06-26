import fs from "fs";
import path from "path";

export type Price = number | { s: number; r: number };
export type MenuItem = { n: number; name: string; price: Price };
export type MenuSection = {
  id: string;
  title: string;
  note?: string;
  items: MenuItem[];
};

/**
 * Parse menu.txt into MenuSection[].
 * Called only on the server (Next.js Server Components / route handlers).
 */
export function parseMenuTxt(): MenuSection[] {
  const filePath = path.join(process.cwd(), "data", "menu.txt");
  const raw = fs.readFileSync(filePath, "utf-8");
  const sections: MenuSection[] = [];
  let current: MenuSection | null = null;

  for (const rawLine of raw.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    if (line.startsWith("SECTION ")) {
      const parts = line.slice(8).split("|");
      const id = parts[0].trim();
      const title = parts[1]?.trim() ?? id;
      const note = parts[2]?.trim();
      current = { id, title, ...(note ? { note } : {}), items: [] };
      sections.push(current);
      continue;
    }

    if (line.startsWith("ITEM ") && current) {
      const parts = line.slice(5).split("|");
      const n = parseInt(parts[0].trim(), 10);
      const name = parts[1]?.trim() ?? "";

      let price: Price;
      const p2 = parts[2]?.trim() ?? "";
      const p3 = parts[3]?.trim() ?? "";

      if (p2.startsWith("s:") && p3.startsWith("r:")) {
        price = { s: parseInt(p2.slice(2), 10), r: parseInt(p3.slice(2), 10) };
      } else {
        price = parseInt(p2, 10);
      }

      current.items.push({ n, name, price });
    }
  }

  return sections;
}
