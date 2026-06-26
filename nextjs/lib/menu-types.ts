export type Price = number | { s: number; r: number };
export type MenuItem = { n: number; name: string; price: Price };
export type MenuSection = {
  id: string;
  title: string;
  note?: string;
  items: MenuItem[];
};
