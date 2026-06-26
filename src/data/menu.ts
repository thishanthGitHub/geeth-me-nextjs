export type Price = number | { s: number; r: number };
export type MenuItem = { n: number; name: string; price: Price };
export type MenuSection = { id: string; title: string; note?: string; items: MenuItem[] };

export const MENU: MenuSection[] = [
  { id: "drinks", title: "Drinks", items: [
    { n: 1, name: "Soft Drinks", price: 100 },
    { n: 2, name: "Mineral Water", price: 160 },
  ]},
  { id: "soup", title: "Soup", items: [
    { n: 3, name: "Cream of Vegetable Soup", price: 380 },
    { n: 4, name: "Cream of Chicken Soup", price: 500 },
    { n: 5, name: "Cream of Mixed Soup", price: 750 },
    { n: 6, name: "Sea Food Soup", price: 730 },
  ]},
  { id: "rice-curry", title: "Rice & Curry", items: [
    { n: 7, name: "Chicken Rice & Curry", price: 450 },
    { n: 8, name: "Fish Rice & Curry", price: 380 },
    { n: 9, name: "Vegetable Rice & Curry", price: 330 },
    { n: 10, name: "Egg Rice & Curry (Omelet)", price: 380 },
    { n: 11, name: "Egg Rice & Curry (Bullae)", price: 350 },
  ]},
  { id: "sunday", title: "Sunday Special — Rice & Curry", items: [
    { n: 12, name: "Fish", price: 450 },
    { n: 13, name: "Chicken", price: 550 },
  ]},
  { id: "fried-rice", title: "Fried Rice", items: [
    { n: 14, name: "Mixed Fried Rice", price: { s: 950, r: 1550 } },
    { n: 15, name: "Sea Food Fried Rice", price: { s: 900, r: 1500 } },
    { n: 16, name: "Fried Rice with Prawns", price: { s: 850, r: 1450 } },
    { n: 17, name: "Fried Rice with Chicken", price: { s: 650, r: 1200 } },
    { n: 18, name: "Fried Rice with Beef", price: { s: 750, r: 1350 } },
    { n: 19, name: "Fried Rice with Fish", price: { s: 750, r: 1050 } },
    { n: 20, name: "Fried Rice with Egg", price: { s: 600, r: 900 } },
    { n: 21, name: "Fried Rice with Vegetable", price: { s: 500, r: 800 } },
  ]},
  { id: "noodles", title: "Noodles", items: [
    { n: 22, name: "Mixed Fried Noodles", price: { s: 980, r: 1600 } },
    { n: 23, name: "Sea Food Fried Noodles", price: { s: 950, r: 1550 } },
    { n: 24, name: "Fried Noodles with Prawns", price: { s: 900, r: 1480 } },
    { n: 25, name: "Fried Noodles with Chicken", price: { s: 700, r: 1300 } },
    { n: 26, name: "Fried Noodles with Beef", price: { s: 780, r: 1400 } },
    { n: 27, name: "Fried Noodles with Egg", price: { s: 630, r: 1080 } },
    { n: 28, name: "Fried Noodles with Vegetable", price: { s: 550, r: 930 } },
  ]},
  { id: "meegoreng", title: "Mee Goreng", items: [
    { n: 29, name: "Mixed Mee Goreng", price: 1250 },
    { n: 30, name: "Sea Food Mee Goreng", price: 1200 },
    { n: 31, name: "Chicken Mee Goreng", price: 900 },
  ]},
  { id: "nasi", title: "Nasi Goreng / Grill Chicken", note: "Seafood, veg salad, fried egg, and chili paste", items: [
    { n: 32, name: "Mixed Nasi Goreng", price: 1400 },
    { n: 33, name: "Sea Food Nasi Goreng", price: 1350 },
    { n: 34, name: "Chicken Nasi Goreng", price: 1200 },
    { n: 35, name: "Beef Nasi Goreng", price: 1300 },
  ]},
  { id: "spicy-rice", title: "Spicy Rice", items: [
    { n: 36, name: "Mixed Spicy Rice", price: 1250 },
    { n: 37, name: "Sea Food Spicy Rice", price: 1200 },
    { n: 38, name: "Chicken Spicy Rice", price: 900 },
    { n: 39, name: "Beef Spicy Rice", price: 1050 },
  ]},
  { id: "koththu", title: "Koththu", items: [
    { n: 57, name: "Mixed Koththu", price: { s: 950, r: 1550 } },
    { n: 58, name: "Sea Food Koththu", price: { s: 900, r: 1500 } },
    { n: 59, name: "Chicken Koththu", price: { s: 650, r: 1200 } },
    { n: 60, name: "Beef Koththu", price: { s: 750, r: 1350 } },
    { n: 61, name: "Egg Koththu", price: { s: 480, r: 800 } },
    { n: 62, name: "Vegetable Koththu", price: { s: 400, r: 750 } },
    { n: 63, name: "Fish Koththu", price: { s: 750, r: 1350 } },
    { n: 64, name: "Chicken Breast (Boneless)", price: { s: 750, r: 1350 } },
  ]},
  { id: "cheese-koththu", title: "Cheese Koththu — Geeth Me Special", items: [
    { n: 65, name: "Mixed Cheese Koththu", price: 1450 },
    { n: 66, name: "Sea Food Cheese Koththu", price: 1400 },
    { n: 67, name: "Chicken Cheese Koththu", price: 1100 },
    { n: 68, name: "Beef Cheese Koththu", price: 1200 },
    { n: 69, name: "Egg Cheese Koththu", price: 900 },
    { n: 70, name: "Vegetable Cheese Koththu", price: 800 },
    { n: 71, name: "Fish Cheese Koththu", price: 1300 },
    { n: 72, name: "Chicken Breast (Boneless) Koththu", price: 1200 },
  ]},
  { id: "prawns", title: "Prawns", items: [
    { n: 91, name: "Hot Butter Jumbo Prawns", price: 2400 },
    { n: 92, name: "Hot Butter Prawns", price: 1950 },
    { n: 93, name: "Battered Prawns", price: 1950 },
    { n: 94, name: "Fried Prawns", price: 1600 },
    { n: 95, name: "Devilled Prawns", price: 1700 },
    { n: 96, name: "Sri Lankan Prawns Curry", price: 1850 },
  ]},
  { id: "crab", title: "Crab", items: [
    { n: 97, name: "Fried Crabs", price: 1650 },
    { n: 98, name: "Devilled Crabs", price: 1750 },
    { n: 99, name: "Sri Lankan Crabs Curry", price: 1900 },
  ]},
  { id: "chicken", title: "Chicken", items: [
    { n: 100, name: "Fried Chicken", price: 1250 },
    { n: 101, name: "Devilled Chicken", price: 1300 },
    { n: 102, name: "Black Pepper Chicken", price: 1900 },
  ]},
  { id: "beef", title: "Beef", items: [
    { n: 103, name: "Fried Beef", price: 1400 },
    { n: 104, name: "Devilled Beef", price: 1500 },
    { n: 105, name: "Black Pepper Beef", price: 1750 },
  ]},
  { id: "deviled", title: "Devilled", items: [
    { n: 108, name: "Mix Devilled", price: 3000 },
    { n: 109, name: "Sea Food Devilled", price: 2800 },
  ]},
  { id: "omelet", title: "Omelet", items: [
    { n: 110, name: "Sri Lankan Omelet", price: 400 },
    { n: 111, name: "Cheese Omelet", price: 550 },
    { n: 112, name: "Chicken Omelet", price: 550 },
    { n: 113, name: "Spinach & Prawns Omelet", price: 650 },
  ]},
];
