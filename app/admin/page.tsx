import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createCategoryAction, createProductAction, deleteCategoryAction, deleteProductAction, logoutAction } from '@/app/admin/actions';
import { getCategories, getProducts } from '@/lib/data';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('la-tavola-admin')?.value === 'true';

  if (!isAuthenticated) {
    redirect('/login');
  }

  const categories = await getCategories();
  const products = await getProducts();

  return (
    <main id="main-content" className="container py-16">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Operations</p>
          <h1 className="mt-2 text-4xl md:text-5xl">Menu administration</h1>
        </div>

        <form action={logoutAction}>
          <button type="submit" className="button button-small">Log out</button>
        </form>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="border border-border bg-[#fffaf2] p-6">
          <h2 className="text-2xl">Add category</h2>
          <form action={createCategoryAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="category-name" className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#4d4038]">Name</label>
              <input id="category-name" name="name" className="w-full border border-border bg-white px-3 py-2 outline-none focus:border-tomato" required />
            </div>
            <div>
              <label htmlFor="category-description" className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#4d4038]">Description</label>
              <textarea id="category-description" name="description" className="w-full border border-border bg-white px-3 py-2 outline-none focus:border-tomato" rows={4} />
            </div>
            <div>
              <label htmlFor="category-order" className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#4d4038]">Sort order</label>
              <input id="category-order" name="sortOrder" type="number" defaultValue={0} className="w-full border border-border bg-white px-3 py-2 outline-none focus:border-tomato" />
            </div>
            <button type="submit" className="button">Save category</button>
          </form>
        </section>

        <section className="border border-border bg-[#fffaf2] p-6">
          <h2 className="text-2xl">Add product</h2>
          <form action={createProductAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="product-name" className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#4d4038]">Name</label>
              <input id="product-name" name="name" className="w-full border border-border bg-white px-3 py-2 outline-none focus:border-tomato" required />
            </div>
            <div>
              <label htmlFor="product-description" className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#4d4038]">Description</label>
              <textarea id="product-description" name="description" className="w-full border border-border bg-white px-3 py-2 outline-none focus:border-tomato" rows={4} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="product-price" className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#4d4038]">Price</label>
                <input id="product-price" name="price" type="number" step="0.01" min="0" className="w-full border border-border bg-white px-3 py-2 outline-none focus:border-tomato" required />
              </div>
              <div>
                <label htmlFor="product-category" className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#4d4038]">Category</label>
                <select id="product-category" name="categoryId" className="w-full border border-border bg-white px-3 py-2 outline-none focus:border-tomato" required>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold text-[#4d4038]">
              <input type="checkbox" name="featured" />
              Feature on homepage
            </label>
            <button type="submit" className="button">Save product</button>
          </form>
        </section>
      </div>

      <section className="mt-12 border border-border bg-[#fffaf2] p-6">
        <h2 className="text-2xl">Categories</h2>
        <div className="mt-6 space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col gap-3 border border-border bg-white p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold text-lg">{category.name}</p>
                <p className="text-sm text-[#5b4d42]">{category.description}</p>
              </div>
              <form action={deleteCategoryAction.bind(null, category.id)}>
                <button type="submit" className="button button-small">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border border-border bg-[#fffaf2] p-6">
        <h2 className="text-2xl">Products</h2>
        <div className="mt-6 space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col gap-3 border border-border bg-white p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold text-lg">{product.name}</p>
                <p className="text-sm text-[#5b4d42]">{product.categoryName} · €{product.price.toFixed(2)}</p>
              </div>
              <form action={deleteProductAction.bind(null, product.id)}>
                <button type="submit" className="button button-small">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
