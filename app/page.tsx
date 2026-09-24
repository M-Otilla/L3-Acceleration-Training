import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/data';

export default async function HomePage() {
  const categories = await getCategories();
  const products = await getProducts();
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="home-hero container" aria-labelledby="home-heading">
        <div>
          <p className="eyebrow">Pasta. Pizza. A place at the table.</p>
          <h1 id="home-heading">
            A little taste of <em>Italy.</em>
            <br />
            A table for you.
          </h1>
          <p>
            Welcome to La Tavola Italiana. Italian favorites, long conversations, and the simple pleasure of sharing something delicious.
          </p>
          <div className="hero-actions">
            <Link href="/menu" className="button">
              Browse the Menu <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="table-art" aria-hidden="true">
          <div className="plate">
            <span>La Tavola</span>
            <strong>
              Made for
              <br />
              <em>good company.</em>
            </strong>
            <span>Pasta &middot; Pizza &middot; Amore</span>
          </div>
          <p>There&apos;s always room at our table.</p>
        </div>
      </section>

      <section className="home-menu section-space" aria-labelledby="menu-heading">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">From the Italian kitchen</p>
              <h2 id="menu-heading">
                Find your <em>favorite.</em>
              </h2>
            </div>
            <Link href="/menu" className="text-link">
              Explore the full menu &rarr;
            </Link>
          </div>

          <nav aria-label="Explore menu categories">
            <ul className="category-teasers">
              {categories.map((category, index) => (
                <li key={category.id}>
                  <Link href={`/menu#${category.slug}`}>
                    <span className="eyebrow">{String(index + 1).padStart(2, '0')} / {category.description}</span>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className="teaser-link">Explore {category.name.toLowerCase()} &rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="preview-note">Preview menu: dishes and PHP prices are illustrative and will be confirmed before launch.</p>
        </div>
      </section>

      <section className="story-section container section-space" aria-labelledby="story-heading">
        <div>
          <p className="eyebrow">At our table</p>
          <h2 id="story-heading">
            Food brings us
            <br />
            <em>together.</em>
          </h2>
        </div>
        <div>
          <p className="story-lead">
            La Tavola means &ldquo;the table.&rdquo;
            <br />
            We think that&apos;s where the best things begin.
          </p>
          <p>La Tavola Italiana celebrates pasta, pizza, and authentic Italian cuisine, with the table at the heart of the experience.</p>
          <p className="preview-note">Our Story preview: restaurant history, team, and kitchen philosophy to come.</p>
        </div>
      </section>

      <section id="visit" className="visit-section section-space" aria-labelledby="visit-heading">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Come hungry. Stay awhile.</p>
              <h2 id="visit-heading">
                Visit <em>Us</em>
              </h2>
            </div>
            <p>
              A leisurely lunch. A dinner with friends.
              <br />
              Make yourself at home.
            </p>
          </div>

          <div className="visit-grid">
            <article className="info-card">
              <span className="card-kicker">01 / Plan your visit</span>
              <h3>Opening Hours</h3>
              <dl className="hours-list">
                <div>
                  <dt>Monday &ndash; Thursday</dt>
                  <dd>11:00 AM &ndash; 10:00 PM</dd>
                </div>
                <div>
                  <dt>Friday &ndash; Sunday</dt>
                  <dd>11:00 AM &ndash; 11:00 PM</dd>
                </div>
              </dl>
              <p className="preview-note">Sample hours. Final schedule and holiday hours to be confirmed.</p>
            </article>

            <article className="info-card">
              <span className="card-kicker">02 / Find us</span>
              <h3>Location</h3>
              <p>4 Via del Sole, Florence, Italy</p>
              <p className="preview-note">A warm neighborhood table, just around the corner from Piazza della Signoria.</p>
            </article>

            <article className="info-card" id="reservations">
              <span className="card-kicker">03 / Reserve</span>
              <h3>Book a Table</h3>
              <p>Call us at (+39) 055 123 4567 or ask your server for the next available evening reservation.</p>
              <p className="preview-note">Reservation details are illustrative and will be finalized before launch.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Chef&apos;s picks</p>
              <h2>
                A few <em>favorites.</em>
              </h2>
            </div>
          </div>
          <div className="menu-grid">
            {featuredProducts.map((product) => (
              <article key={product.id} className="menu-card">
                <span className="eyebrow">{product.categoryName}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className="price">€{product.price.toFixed(2)}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
