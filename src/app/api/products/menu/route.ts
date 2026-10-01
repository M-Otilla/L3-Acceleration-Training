import { NextResponse } from "next/server";

import { connectToDatabase } from "@/DB/mongodb";
import { VALID_PRODUCT_CATEGORIES } from "@/API/helpers";

type MenuItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  badges?: { label: string; variant: "special" | "spicy" | "vegetarian" }[];
};

type MenuCategory = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  aside: string;
  items: MenuItem[];
};

// Menu layout config — mirrors the hardcoded structure from menu-data.ts
const MENU_LAYOUT: {
  id: (typeof VALID_PRODUCT_CATEGORIES)[number];
  number: string;
  title: string;
  subtitle: string;
  aside: string;
}[] = [
  { id: "pasta", number: "01", title: "Pasta", subtitle: "Comfort, twirled around a fork.", aside: "La pasta" },
  { id: "pizza", number: "02", title: "Pizza", subtitle: "A golden crust. A generous heart.", aside: "Dal forno" },
  {
    id: "antipasti",
    number: "03",
    title: "Antipasti & Salads",
    subtitle: "A fresh beginning, best shared.",
    aside: "Per iniziare",
  },
  { id: "desserts", number: "04", title: "Desserts", subtitle: "Always leave a little room.", aside: "La dolce vita" },
];

function formatPrice(value: number): string {
  return `PHP ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function badgeVariant(label: string): "special" | "spicy" | "vegetarian" | undefined {
  const lower = label.toLowerCase();
  if (lower.includes("chef")) return "special";
  if (lower.includes("spicy")) return "spicy";
  if (lower.includes("vegetar")) return "vegetarian";
  return undefined;
}

export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    const Product = mongoose.models?.Product ?? mongoose.model("Product");

    const products = await Product.find({}).sort({ category: 1, name: 1 }).lean();

    const categories: MenuCategory[] = MENU_LAYOUT.map((layout) => {
      const items = (products.filter((p) => p.category === layout.id) as any[]).map((p) => ({
        id: p.slug ?? p.productCode ?? "",
        name: p.name,
        price: formatPrice(p.price),
        description: p.description ?? "",
        badges: (p.badges ?? [])
          .map((label: string) => {
            const variant = badgeVariant(label);
            return variant ? { label, variant } : null;
          })
          .filter(Boolean),
      }));

      return {
        id: layout.id,
        number: layout.number,
        title: layout.title,
        subtitle: layout.subtitle,
        aside: layout.aside,
        items,
      };
    });

    return NextResponse.json({ categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch menu data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
