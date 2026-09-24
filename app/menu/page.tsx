import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/data';

export default async function MenuPage() {
  const categories = await getCategories();
  const products = await getProducts();

  return (
    <main id="main-content" className="container py-16">
      <div className="mb-10">
        <p className="eyebrow">Full menu</p>
        <h1 className="mt-2 text-4xl md:text-5xl">What&apos;s on the table</h1>
      </div>

      {categories.map((category, index) => {
        const categoryProducts = products.filter((product) => product.categoryName === category.name);

        return (
          <section key={category.id} id={category.slug} className="section-space pt-0">
            <div className="section-heading">
              <div>
                <span className="eyebrow">{String(index + 1).padStart(2, '0')} / {category.name}</span>
                <h2 className="mt-3">{category.name}</h2>
              </div>
              <Link href="/" className="text-link">
                Back home &rarr;
              </Link>
            </div>
            <div className="menu-grid">
              {categoryProducts.length > 0 ? (
                categoryProducts.map((product) => (
                  <article key={product.id} className="menu-card">
                    <span className="eyebrow">{product.categoryName}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <span className="price">€{product.price.toFixed(2)}</span>
                  </article>
                ))
              ) : (
                <p className="text-sm text-[#5b4d42]">No dishes available in this category yet.</p>
              )}
            </div>
          </section>
        );
      })}
    </main>
  );
}
