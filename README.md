# La Tavola Italiana

A restaurant website built with plain HTML, CSS, and JavaScript. Phase 2 expands the original single-page foundation with a dedicated menu page.

## Preview

Open `index.html` or `menu.html` in a browser. No installation or build step is required. All page links and category navigation work without JavaScript.

To share newsletter demo storage reliably between pages, serve this folder over HTTP (for example, `npx --yes http-server .`) and open both pages on the same origin. Browser storage behavior for directly opened `file:` URLs varies.

## Files

- `index.html`: home, menu category previews, story, Visit Us cards, and phone reservations.
- `menu.html`: dedicated menu with 16 sample dishes across four categories.
- `styles.css`: shared rustic design, sticky navigation, menu cards, Visit Us layout, footer, and responsive breakpoints.
- `script.js`: mobile navigation, menu filtering, and the local newsletter demo.
- `newsletter.test.js`: newsletter regression tests; run with `node --test newsletter.test.js` (Node.js 18+).

## Confirmed Direction

- Main action: browse the dedicated menu page. Home and Visit links return to `index.html` and `index.html#visit`.
- Reservations: navigate to the bottom section and call the restaurant, rather than submit a form or open a modal.
- Visual direction: rustic trattoria, with cream, tomato red, olive green, and serif headings.
- Content: sample dishes and PHP prices, text-based branding, and placeholder contact details.

## Build Phases

### Phase 1: Architecture & HTML Boilerplate

- Header and section navigation.
- Welcome section with one primary heading.
- Menu grouped into pasta, pizza, and more Italian favorites.
- Our Story, Visit Us, and phone reservation sections.
- Footer, skip link, metadata, viewport configuration, and baseline styling.
- Menu browsing and reservation navigation work without JavaScript.

### Phase 2: Core Components Coding

- Shared sticky header with Home, Menu, Visit, and reservation links; current page highlighted using `aria-current`.
- Compact Our Menu banner and native category anchors.
- Two-column menu cards for Pasta, Pizza, Antipasti & Salads, and Desserts, stacking on small screens.
- Each dish includes a PHP price and one-sentence description, with optional sample feature badges.
- Visit Us cards for sample opening hours, placeholder address, reservation policy, and an illustrative map.
- Matching footer on both pages with quick links, sample hours, social icon placeholders, and inline newsletter input/button.
- The map button remains disabled. Newsletter controls enable with JavaScript for a browser-only demo; there is no backend or real subscription.
- System fonts and local CSS/SVG illustrations keep the preview self-contained; restaurant photography remains pending approval.

### Phase 3: Interactivity, Mobile Polish & Optimization

- Add progressive enhancements where needed; keep core content accessible without JavaScript.
- Verify keyboard navigation, touch targets, mobile layout, and reduced-motion behavior.
- Optimize imagery and check performance and browser behavior.
- Confirm a newsletter provider, consent/privacy requirements, actual social URLs, and the address before enabling their integrations. Do not simulate successful signups.

### Newsletter Demo

- Emails are saved only in localStorage under `la-tavola-newsletter-emails`, as a JSON array. Use test addresses; nothing is sent to a server.
- Both pages use the same list on the same origin. Each submission reads the latest list and checks for duplicates, ignoring case and surrounding whitespace.
- Empty or invalid emails are rejected by browser validation. Duplicate emails are not added; storage failures or malformed stored data show an error without overwriting the list.
- Clearing this localStorage key resets the demo. Storage is specific to the browser/profile and origin; it is not a real database and cannot guarantee atomic updates for simultaneous submissions in multiple tabs.
- Controls remain disabled without JavaScript. Feedback explicitly describes demo storage, not real enrollment.

## Before Launch

- Confirm every menu item, description, price, and dietary badge. Sample badges are not verified dietary or allergen guarantees.
- Replace the phone placeholder and add a working `tel:` link. The placeholder is deliberately not callable.
- Supply the actual address, hours, restaurant story, and approved photos.
- Confirm group booking, cancellation, and walk-in policies.
- Replace the local newsletter demo with a tested provider integration and server-side duplicate protection before accepting real subscriptions; replace the illustrative map and social placeholders with verified destinations.
- Remove preview notices and the `noindex, nofollow` meta tag only after the content is ready for publication.
- Add deployment-specific metadata, such as the canonical URL and social preview image, once those assets are known.

Each phase is reviewed before the next begins.

## Maintenance

The shared header and footer are intentionally static HTML so both pages work from the filesystem and without JavaScript. Apply shared markup changes to both pages. The only header difference is the current-page indicator.
