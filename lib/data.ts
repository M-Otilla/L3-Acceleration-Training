import mongoose, { Schema } from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
  featured: boolean;
};

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema);
export const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);

export const DEMO_CATEGORIES: Category[] = [
  { id: 'category-pasta', name: 'Pasta', slug: 'pasta', description: 'Silky sauces, slow-cooked favorites, and one more forkful.', sortOrder: 1 },
  { id: 'category-pizza', name: 'Pizza', slug: 'pizza', description: 'Golden crusts, bright tomatoes, and toppings worth sharing.', sortOrder: 2 },
  { id: 'category-antipasti', name: 'Antipasti & Salads', slug: 'antipasti', description: 'Crisp greens and little bites to begin a good meal.', sortOrder: 3 },
  { id: 'category-desserts', name: 'Desserts', slug: 'desserts', description: 'A little espresso, a little cocoa, a moment to linger.', sortOrder: 4 }
];

export const DEMO_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'Truffle Tagliatelle', slug: 'truffle-tagliatelle', description: 'Fresh tagliatelle in a silky parmesan cream with black truffle.', price: 20, categoryId: 'category-pasta', categoryName: 'Pasta', featured: true },
  { id: 'prod-2', name: 'Bolognese Rigatoni', slug: 'bolognese-rigatoni', description: 'Slow-simmered beef ragù finished with basil and pecorino.', price: 18, categoryId: 'category-pasta', categoryName: 'Pasta', featured: true },
  { id: 'prod-3', name: 'Margherita Pizza', slug: 'margherita-pizza', description: 'Wood-fired crust with crushed tomato, mozzarella, and basil.', price: 17, categoryId: 'category-pizza', categoryName: 'Pizza', featured: true },
  { id: 'prod-4', name: 'Diavola Pizza', slug: 'diavola-pizza', description: 'Tomato, mozzarella, spicy salami, and chili oil.', price: 19, categoryId: 'category-pizza', categoryName: 'Pizza', featured: false },
  { id: 'prod-5', name: 'Crisp Burrata Salad', slug: 'crispy-burrata-salad', description: 'Lettuce, roasted grapes, burrata, herbs, and citrus vinaigrette.', price: 14, categoryId: 'category-antipasti', categoryName: 'Antipasti & Salads', featured: false },
  { id: 'prod-6', name: 'Panna Cotta', slug: 'panna-cotta', description: 'Vanilla bean cream with berry compote and toasted almond.', price: 11, categoryId: 'category-desserts', categoryName: 'Desserts', featured: true }
];

function toCategory(doc: any): Category {
  return {
    id: String(doc._id ?? doc.id),
    name: doc.name,
    slug: doc.slug || doc.name.toLowerCase().replace(/\s+/g, '-'),
    description: doc.description || 'Freshly prepared favorites.',
    sortOrder: Number(doc.sortOrder ?? 0)
  };
}

function toProduct(doc: any): Product {
  return {
    id: String(doc._id ?? doc.id),
    name: doc.name,
    slug: doc.slug || doc.name.toLowerCase().replace(/\s+/g, '-'),
    description: doc.description || 'House favorite.',
    price: Number(doc.price ?? 0),
    categoryId: String(doc.categoryId ?? ''),
    categoryName: doc.categoryName || 'House Favorite',
    featured: Boolean(doc.featured)
  };
}

export async function getCategories(): Promise<Category[]> {
  const connected = await connectToDatabase();
  if (!connected) {
    return DEMO_CATEGORIES;
  }

  try {
    const categories = await CategoryModel.find({}).sort({ sortOrder: 1, createdAt: 1 }).lean();
    if (categories.length === 0) {
      return DEMO_CATEGORIES;
    }
    return categories.map((category: any) => toCategory(category));
  } catch (error) {
    console.warn('Failed to fetch categories, using fallback data.', error);
    return DEMO_CATEGORIES;
  }
}

export async function getProducts(): Promise<Product[]> {
  const connected = await connectToDatabase();
  if (!connected) {
    return DEMO_PRODUCTS;
  }

  try {
    const products = await ProductModel.find({}).sort({ createdAt: 1 }).lean();
    if (products.length === 0) {
      return DEMO_PRODUCTS;
    }
    return products.map((product: any) => toProduct(product));
  } catch (error) {
    console.warn('Failed to fetch products, using fallback data.', error);
    return DEMO_PRODUCTS;
  }
}
