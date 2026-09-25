import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { homeTeasers } from "@/lib/menu-data";

export default function HomePage() {
  return (
    <>
      <SiteHeader currentPage="home" />

      <main id="main-content" tabIndex={-1}>
        <section id="home" className="home-hero container" aria-labelledby="home-heading">
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
              <Link className="button" href="/menu">
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

        <section id="menu" className="home-menu section-space" aria-labelledby="menu-heading">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">From the Italian kitchen</p>
                <h2 id="menu-heading">
                  Find your <em>favorite.</em>
                </h2>
              </div>
              <Link className="text-link" href="/menu">
                Explore the full menu &rarr;
              </Link>
            </div>

            <nav aria-label="Explore menu categories">
              <ul className="category-teasers">
                {homeTeasers.map((card) => (
                  <li key={card.id}>
                    <Link href={card.href}>
                      <span className="eyebrow">{card.eyebrow}</span>
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                      <span className="teaser-link">Explore {card.title.toLowerCase()} &rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="preview-note">Preview menu: dishes and PHP prices are illustrative and will be confirmed before launch.</p>
          </div>
        </section>

        <section id="our-story" className="story-section container section-space" aria-labelledby="story-heading">
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
            <p>
              La Tavola Italiana celebrates pasta, pizza, and authentic Italian cuisine, with the table at the heart of the experience.
            </p>
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
                <p className="preview-note">Sample hours. Final schedule and service details coming soon.</p>
              </article>

              <article className="info-card">
                <span className="card-kicker">02 / Find our table</span>
                <h3>Our Neighborhood</h3>
                <address>
                  [Street &amp; building]
                  <br />
                  [Barangay, City, Postal code]
                  <br />
                  Philippines
                </address>
                <p className="preview-note">Address placeholder. Directions and parking details will be added once confirmed.</p>
              </article>

              <article className="info-card policy-card">
                <span className="card-kicker">03 / A seat for you</span>
                <h3>Reservations</h3>
                <p>
                  Reserve your table by phone. For larger groups or special occasions, discuss arrangements with the restaurant when calling.
                </p>
                <p className="preview-note">Policy preview. Group limits, cancellation terms, and walk-in availability are not yet confirmed.</p>
                <Link className="text-link" href="/#reservations">
                  Reservation details &rarr;
                </Link>
              </article>

              <article className="map-card" aria-labelledby="map-heading">
                <div className="map-art" aria-hidden="true">
                  <svg viewBox="0 0 640 340" preserveAspectRatio="xMidYMid slice">
                    <rect width="640" height="340" fill="#e8e7d7" />
                    <path d="M0 50H640M0 170H640M0 290H640M90 0V340M265 0V340M470 0V340" stroke="#d5d5bd" strokeWidth="48" />
                    <path d="M0 50H640M0 170H640M0 290H640M90 0V340M265 0V340M470 0V340" stroke="#faf7ed" strokeWidth="25" />
                    <path d="M570-20Q370 120 660 250" fill="none" stroke="#bccbc2" strokeWidth="48" />
                    <path d="M-30 330L550-30" stroke="#faf7ed" strokeWidth="20" />
                  </svg>
                  <div className="map-marker">
                    <svg viewBox="0 0 32 40">
                      <path d="M16 38S3 24 3 15a13 13 0 0 1 26 0c0 9-13 23-13 23Z" />
                      <circle cx="16" cy="15" r="5" />
                    </svg>
                    <span>La Tavola Italiana</span>
                  </div>
                  <div className="map-controls">
                    <span>+</span>
                    <span>&minus;</span>
                  </div>
                </div>
                <div className="map-caption">
                  <div>
                    <h3 id="map-heading">Meet us here</h3>
                    <p>Illustrative map, not a real location.</p>
                  </div>
                  <button className="button button-outline button-small" type="button" disabled aria-describedby="map-note">
                    View map &nearr;
                  </button>
                </div>
                <p id="map-note" className="preview-note">Live map and directions coming once the address is confirmed.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="reservations" className="reservation-section section-space" aria-labelledby="reservations-heading">
          <div className="container">
            <p className="eyebrow">Good evenings start with a table</p>
            <h2 id="reservations-heading">
              Want to <em>dine here?</em>
            </h2>
            <p>Reserve a table now by calling:</p>
            <strong className="reservation-phone">+63 9XX XXX XXXX</strong>
            <p className="reservation-note">Placeholder phone number. Phone reservations will be available once our contact details are confirmed.</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
