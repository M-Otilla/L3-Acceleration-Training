import Link from "next/link";

import { NewsletterForm } from "./newsletter-form";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-intro">
            <Link className="brand" href="/" aria-label="La Tavola Italiana home">
              La Tavola <span>Italiana</span>
            </Link>
            <p>
              Good food. Good company.
              <br />
              A little more Italy in your day.
            </p>
            <div className="social-placeholders" role="group" aria-label="Social media placeholders">
              <span className="social-icon" role="img" aria-label="Instagram, link coming soon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="4" width="16" height="16" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle className="icon-dot" cx="17" cy="7" r="1" />
                </svg>
              </span>
              <span className="social-icon social-letter" role="img" aria-label="Facebook, link coming soon">
                f
              </span>
            </div>
            <p className="footer-note">Social links coming soon.</p>
          </div>

          <nav className="footer-links" aria-label="Footer navigation">
            <h2>At a Glance</h2>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/menu">Our Menu</Link>
              </li>
              <li>
                <Link href="/#our-story">Our Story</Link>
              </li>
              <li>
                <Link href="/#visit">Visit Us</Link>
              </li>
              <li>
                <Link href="/#reservations">Reservations</Link>
              </li>
            </ul>
          </nav>

          <div className="footer-hours">
            <h2>Opening Hours</h2>
            <p>
              Mon &ndash; Thu
              <br />
              11:00 AM &ndash; 10:00 PM
            </p>
            <p>
              Fri &ndash; Sun
              <br />
              11:00 AM &ndash; 11:00 PM
            </p>
            <p className="footer-note">Sample hours, to be confirmed.</p>
          </div>

          <NewsletterForm />
        </div>

        <div className="footer-bottom">
          <p>&copy; La Tavola Italiana. Website preview.</p>
          <p>Menu and restaurant details are placeholders.</p>
          <Link href="#main-content">Back to top &uarr;</Link>
        </div>
      </div>
    </footer>
  );
}
