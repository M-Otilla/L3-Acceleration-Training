import { connect } from "mongoose";

import type { MenuItem } from "@/lib/menu-data";
import { slugify } from "@/API/helpers";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/la-tavola";

// Inline product data — mirrors the original menu-categories layout.
// Update this list to keep MongoDB in sync with your source of truth.
const MENU_ITEMS: Array<{ item: MenuItem; category: string }> = [
  { item: { id: "spaghetti-carbonara", name: "Spaghetti Carbonara", price: "PHP 420.00", description: "Spaghetti coated in silky egg and Pecorino, with crisp guanciale and a generous crack of black pepper.", badges: [{ label: "Chef's Special", variant: "special" }] }, category: "pasta" },
  { item: { id: "penne-arrabbiata", name: "Penne Arrabbiata", price: "PHP 350.00", description: "Penne tossed in a lively tomato sauce with garlic, fiery red chili, and fresh parsley.", badges: [{ label: "Vegetarian", variant: "vegetarian" }, { label: "Spicy", variant: "spicy" }] }, category: "pasta" },
  { item: { id: "fettuccine-alfredo", name: "Fettuccine Alfredo", price: "PHP 390.00", description: "Long ribbons of fettuccine folded through a rich butter and Parmesan sauce with a delicate peppery finish." }, category: "pasta" },
  { item: { id: "lasagna", name: "Lasagna", price: "PHP 460.00", description: "Layers of pasta, slow-simmered beef ragù, and creamy béchamel baked to a golden, bubbling top.", badges: [{ label: "Chef's Special", variant: "special" }] }, category: "pasta" },

  { item: { id: "margherita", name: "Margherita", price: "PHP 390.00", description: "Sweet tomato, milky mozzarella, and fragrant basil meet a lightly charred, wood-fired crust.", badges: [{ label: "Vegetarian", variant: "vegetarian" }] }, category: "pizza" },
  { item: { id: "quattro-formaggi", name: "Quattro Formaggi", price: "PHP 490.00", description: "Mozzarella, Gorgonzola, fontina, and Parmesan melt into a bold, creamy four-cheese medley." }, category: "pizza" },
  { item: { id: "prosciutto-e-funghi", name: "Prosciutto e Funghi", price: "PHP 520.00", description: "Savory prosciutto and earthy mushrooms sit over tomato and mozzarella, finished with olive oil.", badges: [{ label: "Chef's Special", variant: "special" }] }, category: "pizza" },
  { item: { id: "diavola", name: "Diavola", price: "PHP 480.00", description: "Spicy salami, melted mozzarella, and red chili bring a warming kick to a bright tomato base.", badges: [{ label: "Spicy", variant: "spicy" }] }, category: "pizza" },

  { item: { id: "bruschetta", name: "Bruschetta", price: "PHP 220.00", description: "Garlic-rubbed toast piled with ripe tomatoes, fresh basil, and a bright drizzle of extra-virgin olive oil.", badges: [{ label: "Vegetarian", variant: "vegetarian" }] }, category: "antipasti" },
  { item: { id: "caprese-salad", name: "Caprese Salad", price: "PHP 290.00", description: "Juicy tomatoes and soft mozzarella layered with basil, olive oil, and a sweet balsamic finish.", badges: [{ label: "Vegetarian", variant: "vegetarian" }] }, category: "antipasti" },
  { item: { id: "arancini", name: "Arancini", price: "PHP 280.00", description: "Crisp golden risotto balls reveal a melting mozzarella center, served with a tangy tomato dip." }, category: "antipasti" },
  { item: { id: "insalata-mista", name: "Insalata Mista", price: "PHP 240.00", description: "A crisp mix of leafy greens, cucumber, and cherry tomatoes dressed with a zesty lemon vinaigrette.", badges: [{ label: "Vegetarian", variant: "vegetarian" }] }, category: "antipasti" },

  { item: { id: "tiramisu", name: "Tiramisu", price: "PHP 250.00", description: "Espresso-soaked ladyfingers and airy mascarpone meet a bittersweet dusting of cocoa.", badges: [{ label: "Chef's Special", variant: "special" }] }, category: "desserts" },
  { item: { id: "panna-cotta", name: "Panna Cotta", price: "PHP 230.00", description: "Silky vanilla cream with a delicate wobble, balanced by a tart mixed-berry compote." }, category: "desserts" },
  { item: { id: "cannoli", name: "Cannoli", price: "PHP 260.00", description: "Crisp pastry shells filled with sweet ricotta, flecks of dark chocolate, and fragrant orange zest." }, category: "desserts" },
  { item: { id: "gelato", name: "Gelato", price: "PHP 180.00", description: "Two creamy scoops in your choice of chocolate, vanilla, or pistachio for a cool, velvety finish." }, category: "desserts" },
];

async function parsePrice(priceStr: string): Promise<number> {
  const stripped = priceStr.replace(/[^0-9.]/g, "");
  const num = Number(stripped);
  if (Number.isNaN(num) || num < 0) throw new Error(`Invalid price: "${priceStr}"`);
  return Math.round(num * 100) / 100;
}

async function main(): Promise<void> {
  try {
    await connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const Product = (await import("@/DB/models/Product")).default;

    let inserted = 0;
    let skipped = 0;

    for (const { item, category } of MENU_ITEMS) {
      const slug = slugify(item.name);
      const existing = await Product.findOne({ slug }).lean();

      if (existing) {
        console.log(`  Skip ${item.name} (${slug})`);
        skipped++;
        continue;
      }

      const doc = {
        name: item.name.trim(),
        slug,
        productCode: slug.toUpperCase().replace(/-/g, "").slice(0, 24),
        category,
        price: await parsePrice(item.price),
        description: item.description?.trim() ?? "",
        badges: (item.badges ?? []).map((b) => b.label),
      };

      await Product.create(doc);
      console.log(`  Inserted ${item.name}`);
      inserted++;
    }

    console.log(`\nDone. ${inserted} product(s) inserted, ${skipped} skipped.`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
