# Daily Log — Week 3

Participant: Track: Developers

Copy this file into your Google Drive folder and fill in one entry per day. Five entries by the end of week, logged the same day as the work.

### Repo:
- https://github.com/M-Otilla/L3-Acceleration-Training
### Branches: 
* Oneshot (Published)
* Multi-turn (WIP)

---

## Entry 1 — 2026- 09-24

- **Activity:** 

---
AI model used: GitHub Copilot

Task: One-shot conversion of the static website into a dynamic full-stack Next.js app using a single prompt.

Issues encountered:
* The one-shot prompt generated an outdated frontend stack and a Tailwind/PostCSS setup that did not match the current Tailwind v4 requirement, causing build errors until the config was updated to use the new `@tailwindcss/postcss` package.
* The generated output did not consistently preserve the original static HTML design; layout styling and visual structure needed manual correction to better match the provided restaurant branding and page hierarchy.
* The initial implementation lacked a fully functional backend layer; MongoDB connectivity was only partially scaffolded, so additional debugging and coding were required to complete the data model and server actions.
* The conversion required compatibility fixes for modern Next.js versions, including updates to config conventions and cookie handling in server actions/components.
* The single prompt consumed a high amount of token usage quickly, increasing from roughly 20% to 50% for a single conversion task, which is more than the typical weekly allowance for a small task.
* Because the prompt was broad and the app requirements were complex, more iterative prompting and manual review were needed to produce a working result.

Takeaway:
A one-shot prompt can be useful for rapid scaffolding and initial project generation, but it is not reliable for production-quality conversion work without follow-up fixes. For this project, the initial one-shot attempt introduced outdated dependencies, incomplete backend wiring, and design drift, which required additional debugging, verification, and refinement. Multi-turn prompting is more efficient and cost-effective for complex migrations like this.

Prompt used:
```
Role & Goal:
  Act as an expert Full-Stack Next.js Developer. Convert my project files
  (located in \personal approach folder) from static HTML website into a dynamic
  full-stack Next.js (App Router) application. Create an admin page that will
  manage both Category and Products. The admin page should be protected by a
  simple login page using env var. Next.js app should be on the root level
  directory and there should be no old files from static HTML website left
  after the conversion.

  Tech Stack:
  - Framework: Next.js (App Router, Server Components, Server Actions)
  - Database: MongoDB
  - Styling: Tailwind CSS (match the provided design exactly)
```

Result:
The one-shot output was rejected as incomplete because the generated design drifted away from the original UI and the backend/data layer was not fully functional. Additional prompt refinement and direct code changes were needed to finish the project but i didnt proceed with it and moved on to the Multi turn Prompt to save tokens.

## Entry 2 — 2026-09-25

- **Activity:** Multi-turn conversion planning and root-level scaffolding for the La Tavola restaurant website. The work focused on preserving the static Week 2 reference as a design source while building a clean Next.js App Router foundation in the repository root. The day included reviewing the live restaurant experience, confirming project structure and dependency choices, generating the root configuration, and validating that the app compiled before moving into feature implementation.

---
AI model used: GitHub Copilot

Task: Shift from the failed one-shot conversion approach to a more controlled multi-turn build strategy for the restaurant website, creating a root-level Next.js application while keeping the original static source intact for reference.

Issues encountered:
* The initial one-shot conversion had already shown that broad, single-prompt generation could drift away from the original design and fail to preserve branding or page hierarchy.
* The project required a careful decision on scope: the static Week 2 files needed to remain untouched while the new app was scaffolded in the repo root.
* The generated stack had to match current tooling requirements, including the correct Tailwind/PostCSS integration and modern Next.js conventions.
* The repo needed a proper App Router structure (`src/app`, `src/components`, `src/DB`, `src/API`, `src/lib`, etc.) with matching configuration and dependency setup before development could continue.
* Linting initially flagged the legacy static folder because the new ESLint configuration was scanning too broadly, which required narrowing validation to the active app scope rather than modifying the original reference implementation.
* Even with a cleaner multi-turn approach, there was still a need to verify build stability, dependency correctness, and file placement before feature work began.

Takeaway:
A multi-turn workflow is significantly more reliable for converting an existing static site into a complex app than a single all-at-once prompt. In this project, the better approach was to first establish a solid root-level foundation, preserve the original La Tavola design as a reference, and validate the scaffold before implementing any dynamic functionality. This reduces design drift, dependency mismatch, and rebuild issues while staying aligned with the original restaurant branding and structure.

Prompt used:
```
User: You are a senior FullStack Next.js Developer.
There will be 10 or more steps that we will go through in converting this Static HTML into a fully dynamic Next.js Application

Tech Stack to be used:
* Framework: Next.js (App Router, Server Components, Server Actions)
* Database: NoSQL (MongoDB)
* Styling: Tailwind (Match the Design that's provided in Week2 Folder)
Step 1:

* Initialize a Next.js Project in the root folder
* Include in the package.json additional tools for MongoDB, Tailwind, and Any necessary package that will be used for this project
* Outline the Project folders under src/(components, action, DB, API, APP, lib )
```

Result:
The multi-turn approach was successful in creating a stable root project scaffold without deleting or altering the static Week 2 site. The repo now includes a Next.js App Router setup with TypeScript, Tailwind, ESLint, MongoDB/Mongoose packages, and the required folder structure. Build and configuration checks passed, and the project is ready for the next stages of implementation and feature migration.

---

## Entry 3 — 2026-09-29

- **Activity:** Created database and backend environment, including full authentication infrastructure for the La Tavola restaurant website. The work focused on implementing MongoDB user model, auth API routes (login, register, logout, session), Next.js App Router cookie-based session management, and a client-side AuthContext provider that persists user state across page reloads. The session also covered fixing a critical bug where the missing `AuthProvider` in the root layout caused all auth hooks to fall back to no-op defaults, and resolving an httpOnly cookie persistence issue by adding `credentials: "include"` to every fetch call.

---
AI model used: Claude Code

Task: Build the backend database layer (MongoDB user model with Mongoose schema) and the authentication API routes (login, register, logout, session check), then wire them up through a client-side AuthContext provider so that the login state persists across page loads and the site header dynamically shows either "Log in" or "Welcome {fullName}".

Issues encountered:
* The root layout (`src/app/layout.tsx`) never rendered `AuthProvider`, so every component calling `useAuth()` received empty default no-op functions — login/register/logout did nothing and the modal just closed silently.
* Trying to add `"use client"` directly to the server-side root layout broke `metadata` export (not allowed in Client Components). Solved by splitting into a server-side `layout.tsx` that imports a Client Component wrapper (`client-layout.tsx`) which handles the dynamic import of `AuthProvider`.
* All `fetch()` calls in `AuthContext` were missing `credentials: "include"`, so httpOnly cookies set by the API routes were never sent back on mount. `/api/auth/me` always returned `{ data: null }`, resetting user state to `null` on reload.
* The header displayed `user?.lastName` which doesn't exist on the User Mongoose model (only `fullName`). Logged-in users would have seen "Welcome Guest" instead of their actual name.
* Cookie configuration used `secure: process.env.NODE_ENV === "production"`, which disables secure cookies in development — need to verify this works locally during testing.

Takeaway:
Setting up a backend authentication layer requires more than writing API routes; the client-side provider must be properly wired into the component tree, and every fetch that communicates with cookie-backed endpoints must explicitly include credentials. Without `AuthProvider` in the root layout and `credentials: "include"` on every request, the authentication state would silently fail even though the backend was fully functional. The separation between server components (layout, metadata) and client components (dynamic auth) also highlights the importance of using Next.js dynamic imports rather than forcing `"use client"` into a server file.

Prompt used:
refer to: `code planning/step4.md`

Result:
The backend was fully implemented with all four auth endpoints (`/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me`), a properly validated User Mongoose schema, bcrypt password hashing, and 7-day httpOnly session cookies. The frontend had complete form handling with validation in `AuthModal`, but the missing `AuthProvider` wrapper and absent `credentials` option broke persistence. After fixing both issues, login state now correctly persists across page reloads and the header dynamically switches between "Log in" and "Welcome {fullName}".

## Entry 4 — 2026-09-30

- **Activity:** Implementation of the backend APIs to the frontend, connecting API endpoints to their corresponding pages and components so data flows from MongoDB through Next.js App Router routes into the UI. The work focused on wiring up the products API to the menu page, setting up a reusable fetch pattern with proper error handling for all public-facing pages (Home, Menu, Visit, About), and creating shared layout structure that avoids duplicating `AuthProvider`, `SiteHeader`, and navigation across every page.

---
AI model used: Claude Code

Task: Bridge the gap between backend API routes and frontend pages — connect `/api/products` to the menu page, replace all hardcoded/static content with data fetched from MongoDB through Next.js server components, establish a consistent error-handling pattern for failed fetches (server-side fallback + client-side retry), and ensure the global layout (`AuthProvider`, `SiteHeader`) wraps every page without duplication.

Issues encountered:
* The menu page currently renders static product data hardcoded in JSX; wiring it to `/api/products` requires changing from a pure Server Component to one that awaits an async fetch, which means handling loading states and empty-data edge cases.
* Several pages (Home, Visit, About) don't have dedicated API routes yet — they rely on hardcoded content. The product category data needs to be fetched and displayed dynamically with proper fallback if the database is empty or unreachable.
* Navigation state (`currentPage` prop passed to `SiteHeader`) needs a centralised way to determine which page header section is active, rather than duplicating URL-matching logic across pages.
* Error handling for API calls differs between server components (throws propagate to Next.js error boundary) and client hooks (requires try/catch + state-based UI feedback), creating inconsistency in how failures present to the user.
* The products API (`/api/products` and `/api/products/[id]`) is fully scaffolded but has no frontend consumer — menu items need to be displayed with pricing, descriptions, and category filtering that currently exist only as static data.

Takeaway:
Connecting backend APIs to the frontend is not just about calling endpoints — it's about establishing a consistent data-fetching pattern (server components for initial data, client hooks for interactive state), handling every failure mode gracefully (empty database, network errors, malformed responses), and keeping layout wrapping (`AuthProvider`, `SiteHeader`) DRY. Without these foundations in place, each page ends up with ad-hoc fetch logic that's hard to debug or reuse.

Prompt used:
refer to: `code planing/step5.md`

Result:
The backend-to-frontend bridge is established with the `/api/products` endpoint wired into the menu page, `AuthProvider` properly wrapping all pages via `client-layout.tsx`, and a reusable pattern for server-component data fetching with loading/empty states. The global layout (header navigation, auth context) now works consistently across every page without duplication.

## Entry 5 — YYYY-MM-DD

- **Activity:** 