import { MenuPageClient } from "@/components/menu-page-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Our Menu | La Tavola Italiana",
  description: "Explore the La Tavola Italiana menu of authentic pasta, pizza, antipasti, salads, and desserts.",
};

async function getMenuCategories() {
  try {
    const res = await fetch("/api/products/menu", {
      next: { revalidate: 60 }, // revalidate every 60 seconds
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data.categories) ? data.categories : null;
  } catch {
    return null;
  }
}

export default async function MenuPage() {
  const menuData = (await getMenuCategories()) ?? undefined;

  return (
    <>
      <SiteHeader currentPage="menu" />

      <main id="main-content" tabIndex={-1}>
        <section className="menu-hero" aria-labelledby="menu-heading">
          <div className="container">
            <p className="eyebrow">La Tavola Italiana &nbsp; / &nbsp; The kitchen</p>
            <h1 id="menu-heading">
              Our <em>Menu</em>
            </h1>
            <p>
              Authentic Italian pasta, wood-fired pizza, and fresh Mediterranean flavors.
              <br className="desktop-break" />
              A little of what you love. Something new to fall for.
            </p>
            <span className="hero-flourish" aria-hidden="true">
              Buon appetito!
            </span>
          </div>
        </section>

        <MenuPageClient menuData={menuData} />
      </main>

      <SiteFooter />
    </>
  );
}
