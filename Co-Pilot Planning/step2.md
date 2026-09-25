# Step 2 Implementation Plan

## Problem

The root Next.js app currently contains only a placeholder page, while the Week2 reference implementation provides the complete La Tavola Italiana home page, menu page, responsive visual system, and browser interactions. Step 2 requires recreating that experience in Next.js rather than serving or embedding the static HTML.

## Proposed approach

1. Preserve the Week2 source files as the visual and behavior reference.
2. Extract the shared restaurant shell into reusable React components:
   - Header/navigation with responsive mobile menu
   - Authentication modal and logged-in dropdown state
   - Footer/newsletter demo
   - Shared buttons, typography, and supporting UI where reuse improves clarity
3. Create the home route at `src/app/page.tsx`, reproducing:
   - Hero/table artwork
   - Menu category teaser cards
   - Our Story section
   - Visit Us cards and illustrative map
   - Reservation call-to-action
4. Create the dedicated menu route at `src/app/menu/page.tsx`, reproducing all four menu categories, dish content, badges, favourites controls, category navigation, and filtering controls.
5. Move the Week2 visual system into the Next.js global stylesheet, retaining the existing cream/tomato/olive palette, typography, responsive breakpoints, focus states, sticky navigation, and mobile layouts. Use CSS modules only if a component-specific rule cannot remain coherently shared.
6. Replace the imperative DOM script with client components and React state/effects:
   - Responsive navigation state and Escape/outside-click handling
   - Auth login/register modal backed by the existing localStorage demo behavior
   - Per-user favourites with expiry and menu filtering
   - Newsletter demo persistence and validation
   - Hash/deep-link category behavior where compatible with App Router
7. Update route-aware links and metadata so links target `/`, `/menu`, `/#visit`, and `/#reservations` instead of static `.html` files.
8. Keep the design content and placeholder disclosures aligned with Week2, including the illustrative map, sample pricing, placeholder contact details, and demo-only browser storage notices.
9. Validate with lint, production build, formatting checks, and targeted browser verification of both routes and the key interactions.

## Decisions and boundaries

- Both the home page and dedicated `/menu` page are in scope.
- Existing client-side interactions are preserved, but implemented using React client components rather than loading `Week2/script.js`.
- The Week2 folder remains unchanged.
- This step is a frontend recreation only; MongoDB, server actions, real authentication, and persistent backend data remain out of scope for Step 2.
- The visual result should match the existing CSS closely; Tailwind may remain available, but the established design rules should not be rewritten into a less faithful approximation.
- No external imagery or unapproved restaurant details will be introduced.

## Expected files/components

- `src/app/page.tsx`
- `src/app/menu/page.tsx`
- `src/app/globals.css`
- Shared components under `src/components/`
- Client interaction components/hooks under `src/components/` and/or `src/lib/`
- Static menu/content data under `src/lib/` where it prevents duplicated JSX

## Validation

- Confirm `/` and `/menu` render the complete layouts with responsive styling.
- Confirm navigation, auth modal, register/login state, logout, favourites profile/expiry, menu filters, hash links, and newsletter demo work without runtime errors.
- Run `npm run lint`, `npm run build`, and `git diff --check`.
- Confirm Week2 files remain unchanged.
