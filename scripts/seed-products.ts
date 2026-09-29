import { connect } from "mongoose";

import { menuCategories, type MenuItem } from "@/lib/menu-data";
import { slugify } from "@/API/helpers";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/la-tavola";

async function parsePrice(priceStr: string): Promise<number> {
  const stripped = priceStr.replace(/[^0-9.]/g, "");
  const num = Number(stripped);
  if (Number.isNaN(num) || num < 0) throw new Error(`Invalid price: "${priceStr}"`);
  return Math.round(num * 100) / 100;
}

async function mapProduct(item: MenuItem, category: string): Promise<Record<string, unknown>> {
  const slug = slugify(item.name);
  return {
    name: item.name.trim(),
    slug,
    productCode: slug.toUpperCase().replace(/-/g, "").slice(0, 24),
    category,
    price: await parsePrice(item.price),
    description: item.description?.trim() ?? "",
    badges: (item.badges ?? []).map((b) => b.label),
  };
}

async function main(): Promise<void> {
  try {
    await connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const Product = (await import("@/DB/models/Product")).default;

    let inserted = 0;
    let skipped = 0;

    for (const cat of menuCategories) {
      for (const item of cat.items) {
        const slug = slugify(item.name);
        const existing = await Product.findOne({ slug }).lean();

        if (existing) {
          console.log(`  Skip ${item.name} (${slug})`);
          skipped++;
          continue;
        }

        const doc = await mapProduct(item, cat.id);
        await Product.create(doc);
        console.log(`  Inserted ${item.name}`);
        inserted++;
      }
    }

    console.log(`\nDone. ${inserted} product(s) inserted, ${skipped} skipped.`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
