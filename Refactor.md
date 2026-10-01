# La Tavola Italiana — Code Refactor Plan

## Priority: HIGH

### 1. Duplicate admin product table components

**Files**: `src/components/admin-product-table.tsx` and `src/app/admin/products/page.tsx` are nearly identical clones — same state shape, same inline-editing logic, same JSX structure (table rows, inputs, selects, buttons). The only difference is the currency label (`PHP` vs `€`).

**Action**:
- Remove `src/app/admin/products/page.tsx`.
- Keep only `src/components/admin-product-table.tsx` as the source of truth.
- Update `src/app/admin/page.tsx` to import it (already does) and ensure any route that used `/admin/products` redirects or deletes the file.
- If dual-currency display is needed later, accept a `currency` prop rather than duplicating the component.

### 2. AuthContext returns stale `isAdmin` / missing `refreshSession`

**File**: `src/contexts/AuthContext.tsx:146-150`

`isAdmin` is derived from the current `user` state at render time. The `checkAdmin` callback closes over that same snapshot via `useCallback([isAdmin])`, so if the session cookie changed server-side between renders, `checkAdmin` returns a stale truthy value. Also there is no way to re-fetch the session after a login/logout cycle on a different route — it only calls `/api/auth/me` once on mount.

**Action**:
- Replace `checkAdmin` with a function that calls `/api/auth/me` and returns the result.
- Add a `refreshSession` method that re-runs `fetchSession()` and updates state.
- In the header dropdown, call `refreshSession()` before checking `isAdmin`.

### 3. Register route sets session cookie but login doesn't hand it off

**Files**: `src/app/api/auth/login/route.ts`, `src/app/api/users/route.ts` (register logic), `AuthContext.register()`

The login route calls `setSessionCookie(res, serializedUser)` and returns it — the browser stores the cookie. But the AuthContext `register` function extracts `user` from `body.data.user` and stores it in localStorage; it never reads back the cookie or re-fetches `/api/auth/me`. This means after registration:
- The cookie **is** set server-side (good).
- The client-side state is correct because `serializeUser` returns the user object.
- But if a different tab opens `/api/auth/me`, it will see the session; this tab won't refresh until next mount.

**Action**:
- After `register`, call `refreshSession()` (from above) instead of trusting the response body to be in sync with what the cookie holds.
- Same for login — call `refreshSession()` after a successful POST so all state sources converge on the same truth.

### 4. API helpers repeated error guards everywhere

**Pattern across all routes**: every handler repeats:
```ts
if (isMongoUnavailableError(message)) { return createApiError(503, ...) }
if (message === "Invalid ObjectId.") { return createApiError(400, ...) }
if (isDuplicateKeyError(error)) { return createApiError(409, ...) }
```

**Action**:
- Create a `handleApiError(context: { req, defaultStatus })` helper that inspects the error once and returns the response. Routes call it in a single `catch` line.
- Move `ensureValidObjectId` validation into the helper so route handlers don't repeat the check before calling the DB method.

### 5. `parseJsonBody` body shape not typed

**Across all routes**: `const payload = await parseJsonBody(request)` returns an untyped value, then gets cast inline:
- `(payload as Record<string, unknown>).email`
- `(body as { data: Product[] }).data`

**Action**:
- Generic-typed `parseJsonBody<T>(req): Promise<T>` with a default of `Record<string, unknown>`.
- Callers pass their expected shape: `parseJsonBody<{ email: string; password: string }>(request)`.
- TypeScript then catches missing/wrong fields at compile time.

---

## Priority: MEDIUM

### 6. Favorites storage schema has a migration edge-case

**File**: `src/components/menu-page-client.tsx:59-64`

The code detects old-format favorites (plain array without `expiresAt`) and migrates them in-place. This runs on every mount while the old format exists. The migration is correct but could throw if storage is full during the write — the outer `try/catch` catches it, but the user never sees a success message for the migration.

**Action**:
- Move the migration to `useEffect` (not inside `readFavorites`) so it runs once per mount with an explicit status message.
- Add a brief console log: `console.info('[menu] migrated old favorites format')`.

### 7. Newsletter form uses localStorage without server sync

**File**: `src/components/newsletter-form.tsx`

The component stores emails client-side only and shows "No real subscription was created." This is intentional for the preview stage, but it means:
- Emails are lost if the user clears browser data.
- There's no way to export or review the list from admin.

**Action**:
- If/when a newsletter backend exists, replace the `handleSubmit` with a POST to `/api/newsletter/subscribe`.
- Keep localStorage as a **staging** layer: queue unsent emails, then flush on interval or page unload via `navigator.sendBeacon`.

### 8. Menu-page fetch has no timeout / retry

**File**: `src/app/menu/page.tsx:12` and `src/components/menu-page-client.tsx:135`

Both the server component (`fetch("/api/products/menu", { next: { revalidate: 60 } })`) and the client component (`fetch("/api/products/menu")`) have no explicit timeout. If MongoDB hangs, the page spins indefinitely (client) or the edge runtime times out after 60s (server).

**Action**:
- Add an AbortController with a 10-second timeout to the client-side fetch.
- On timeout, log and fall back to the seeded empty categories (already does this implicitly, but be explicit).
- Consider `AbortSignal.timeout(10_000)` if targeting Next.js 15+ edge runtime.

### 9. Admin pages lack CSRF protection for mutations

**Pattern**: PATCH and DELETE in `src/app/api/products/[id]/route.ts` accept requests with any origin if cookies are sent (sameSite: lax allows cross-site top-level nav, but not form POSTs — however, the cookie is httpOnly so it's sent automatically).

**Action**:
- Add a CSRF token check for state-mutating routes. Since this uses same-site cookies (not JWT), the simplest approach is to verify `referer` header matches the origin or use a double-submit cookie pattern.
- At minimum, log the IP and user agent on DELETE for audit trail.

### 10. `serializeProduct` / `serializeUser` cast everywhere

**Across routes**: `product.toObject() as Record<string, unknown>` appears in every route handler. The `.lean()` results are also cast the same way.

**Action**:
- Define proper TypeScript interfaces: `SerializedProduct`, `SerializedUser`.
- Remove `as Record<string, unknown>` casts; let the serializer function return the typed interface.
- This catches serialization mismatches at compile time instead of runtime.

---

## Priority: LOW

### 11. Map placeholder SVG has no alt / is decorative-only

**File**: `src/app/page.tsx:158-178`

The map card uses `<div className="map-art">` with an inline SVG and a marker — it's marked `aria-hidden="true"`. The caption says "Illustrative map, not a real location." This is fine for accessibility (screen readers skip it), but the SVG itself has no `role` or `aria-label` because it's hidden. No change needed; this is informational only.

### 12. Opening hours duplicated across three places

**Locations**:
- `src/app/page.tsx:118-130` (Visit section)
- `src/components/site-footer.tsx:55-68` (Footer Hours)
- CSS/media queries (sticky header behavior, not content-related)

**Action**: Move hours data to `src/lib/restaurant-data.ts` and import from both places. This also makes it easy to update for seasonal changes.

### 13. Hardcoded categories array in two components

**Files**: `admin-product-table.tsx:16-23`, `app/admin/products/page.tsx:16` (duplicate). Both define the same `CATEGORIES` const. If a new category is added, it must be updated in both places.

**Action**: Move to `src/lib/menu-data.ts` or `src/constants/categories.ts`. The existing `menu-data` module already has category types — add `CATEGORIES` there as a const export.

### 14. No loading skeleton for menu items

**File**: `src/components/menu-page-client.tsx:433-435`

During the initial fetch (when `loading` is true), only "Loading menu..." is shown. For a restaurant menu with many categories, a skeleton grid would be better UX — users can see the page structure loading rather than a single sentence.

**Action**: Add a `<MenuSkeleton>` component that renders 2-3 placeholder cards per row while data fetches.

### 15. `favoriteUserModalOpen` state could conflict with AuthModal

**File**: `src/components/menu-page-client.tsx:332-376` and `src/components/site-header.tsx:20-269`

Both components render a modal that covers the viewport (`auth-modal` and `favorites-login-modal`). If a user somehow triggers both (unlikely but possible via URL manipulation), the modals stack without z-index coordination. The backdrop click handlers each only close their own modal, so closing one leaves the other beneath.

**Action**: Add a shared modal context or z-index counter. For now, add `z-index: 1000` to the favorites modal and ensure backdrops close any open modal when clicked (already does for auth; extend to favorites).

---

## Summary of recommended order

| Order | Item | Effort | Impact |
|-------|------|--------|--------|
| 1 | Dedupe admin product table | Low | Eliminates ~200 lines of copy-paste |
| 2 | Fix `isAdmin` / add `refreshSession` | Medium | Prevents stale auth state bugs |
| 3 | Session refresh after login/register | Medium | Ensures client/server cookie sync |
| 4 | Centralize API error handling | Medium | Removes ~30 duplicate if/return blocks |
| 5 | Typed `parseJsonBody<T>` | Low | Catches wrong shapes at compile time |
| 6 | Favorite migration edge-case | Low | Cleaner UX, better logging |
| 7 | Newsletter server sync (future) | High | Depends on backend |
| 8 | Menu fetch timeout | Low-Medium | Prevents spin loops |
| 9 | CSRF for mutations | Medium | Security hardening |
| 10 | Remove `as Record` casts | Low | Type safety improvement |
| 11-15 | Polish items | Various | UX quality improvements |
