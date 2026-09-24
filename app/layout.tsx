import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { logoutAction } from '@/app/admin/actions';

export const metadata: Metadata = {
  title: 'La Tavola Italiana',
  description: 'Pasta, pizza, and Italian dining with a modern admin experience.'
};

async function SiteHeader() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('la-tavola-admin')?.value === 'true';

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="La Tavola Italiana home">
          La Tavola <span>Italiana</span>
        </Link>

        <div className="header-panel">
          <nav aria-label="Main navigation">
            <ul className="nav-links">
              <li><Link href="/" aria-current="page">Home</Link></li>
              <li><Link href="/menu">Menu</Link></li>
              <li><Link href="/#visit">Visit</Link></li>
            </ul>
          </nav>

          {isAdmin ? (
            <div className="header-auth-menu">
              <Link href="/admin" className="button button-small header-auth is-logged-in">Admin</Link>
              <form action={logoutAction}>
                <button type="submit" className="button button-small header-auth hidden-button">Logout</button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="button button-small header-auth">Log in</Link>
          )}

          <Link href="/#reservations" className="button button-small header-reserve header-reserve-sticky">
            Reserve a Table <span aria-hidden="true">&nearr;</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-[#f7f1e8] py-12">
      <div className="container footer-top">
        <div>
          <p className="eyebrow">La Tavola Italiana</p>
          <h3 className="mt-2 text-3xl">Pasta, pizza, and warm company.</h3>
        </div>
        <div className="mt-8 flex flex-col gap-4 md:mt-0 md:items-end">
          <p>4 Via del Sole, Florence, Italy</p>
          <p>hello@latavolaitaliana.com</p>
          <p>(+39) 055 123 4567</p>
        </div>
      </div>
    </footer>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
