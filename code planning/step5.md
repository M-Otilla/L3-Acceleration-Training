# Step 5 — Authentication & API Wire-up

## Goal

Replace localStorage-based auth with a real login/register/logout flow backed by MongoDB.

---

## Backend APIs

### 1. Login (`src/app/api/auth/login/route.ts`)

**POST** `{ email, password }` → verifies via `bcrypt.compare`, sets an HTTP-only cookie (`latavola-session`), returns `{ data: { user: {...} } }`.

Returns 401 for wrong password or missing fields, 503 if MongoDB is down.

### 2. Register (`src/app/api/auth/register/route.ts`)

**POST** `{ fullName, mobileNumber, email, password }` → creates a `User`, auto-logs in (same cookie flow), returns `{ data: { user: {...} } }`.

Returns 400 for invalid input, 409 for duplicate email.

### 3. Logout (`src/app/api/auth/logout/route.ts`)

**POST** → clears the session cookie, returns 200.

### 4. Me (`src/app/api/auth/me/route.ts`)

**GET** → validates the cookie, returns current user profile or `{ data: null }`.

---

## Frontend Wire-up

### AuthContext (`src/contexts/AuthContext.tsx`)

Provides `{ user, isAuthenticated, login, register, logout }`. Fetches session on mount via `GET /api/auth/me`.

### Update AuthModal (`src/components/site-header.tsx`)

Replace localStorage operations with API calls. Add loading states and error toasts.

Remove keys: `la-tavola-current-user-data`, `la-tavola-current-user-name`, `la-tavola-registered-users`.

---

## Files

| File | Action |
|------|--------|
| `src/app/api/auth/login/route.ts` | Create |
| `src/app/api/auth/register/route.ts` | Create |
| `src/app/api/auth/logout/route.ts` | Create |
| `src/app/api/auth/me/route.ts` | Create |
| `src/contexts/AuthContext.tsx` | Create |

**Modify:** `src/components/site-header.tsx` (replace localStorage auth with API calls)

---

## Key Decisions

- HTTP-only cookie for session (prevents XSS). Name: `latavola-session`. Expiry: 7 days.
- Admin features, favourites server migration, and newsletter are out of scope for this step.

---

## Validation

- [ ] Login with valid credentials → session cookie set, user logged in
- [ ] Wrong password → 401
- [ ] Register → new user created, auto-logged in
- [ ] Duplicate email → 409
- [ ] Logout → cookie cleared
- [ ] AuthModal uses API calls instead of localStorage
- [ ] `npm run lint`, `npm run build` pass
