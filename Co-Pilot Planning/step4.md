# Step 4 Implementation Plan

## Problem

The Next.js application has Products and Users CRUD APIs already built but untested. Admins are missing entirely, and there is no automated testing to validate correctness.

## Requirements (from original step4.md)

- Create API: users, products, and admins
- Read API: products, users
- Update API: all related data
- Delete API: all data
- Test CRUD features after creation

## Current State

| Feature | Status |
|---------|--------|
| Products CRUD (POST, GET list, GET by id, PATCH, DELETE) | Done |
| Users CRUD (POST, GET list, GET by id, PATCH, DELETE) | Done |
| Admins API | Not built |
| Tests | None |

## Implementation Plan

### Phase A: Admins API (new model + routes)

1. Create `src/DB/models/Admin.ts` — Simple schema:
   - `fullName`: String, required, trimmed
   - `email`: String, required, unique, normalized lowercase
   - `passwordHash`: String, required, select: false
   - timestamps: true

2. Extend `src/API/helpers.ts` with admin helpers:
   - `validateAdminInput(payload)` — requires fullName, email, password (min 8 chars, letter + number)
   - `validateAdminUpdateInput(payload)` — same fields but optional (partial update)
   - `serializeAdmin(value)` — sanitize plain object, remove passwordHash

3. Create `src/app/api/admins/route.ts`:
   - `GET()` — list all admins (no passwordHash in response)
   - `POST(request)` — create admin with hashed password, duplicate email check

4. Create `src/app/api/admins/[id]/route.ts`:
   - `GET(_request, context)` — find by id, 404 if not found
   - `PATCH(request, context)` — update provided fields, hash password if changed
   - `DELETE(_request, context)` — soft delete by id

### Phase B: Seed Script

5. Create `scripts/seed-admin.ts`:
   - Connects to MongoDB via Mongoose
   - Creates first admin if none exists:
     - fullName: "Admin"
     - email: "admin@latavola.com"
     - passwordHash: bcrypt("Password", 10)

### Phase C: Vitest Tests

6. Install dependencies: `vitest`, `@testing-library/jest-dom`, `tsx`, `@types/node` to devDependencies. Add `"test": "vitest run"` script to package.json.

7. Create `vitest.config.ts` — path alias `@/*` → `./src/*`, setup file `vitest.setup.ts`.

8. Create `vitest.setup.ts` — import `@testing-library/jest-dom`, configure mocks for MongoDB where needed.

9. Test suites:
   - `tests/helpers.test.ts` — validateAdminInput, validateAdminUpdateInput, sanitizePlainObject, serializeAdmin, hashPassword, error helpers (no DB)
   - `tests/api/products.test.ts` — CREATE valid product, REJECT invalid input, READ list, READ by id 404, UPDATE fields, DELETE, duplicate slug/code 409, mongo unavailable 503
   - `tests/api/users.test.ts` — CREATE valid user with hash, REJECT missing fields, READ list + by id 404, UPDATE name/email/password, DELETE, duplicate email 409
   - `tests/api/admins.test.ts` — CREATE admin with hash, REJECT invalid input, READ list + by id 404, UPDATE, DELETE, duplicate email 409

### Phase D: Verification

10. Run `npm run lint`, `npm run build`, `npx vitest run`. All should pass.

## Decisions and Boundaries

- Admin schema mirrors User minus mobileNumber — simple auth identity only.
- Seed script uses fixed creds from step4.md: name "Admin", email "admin@latavola.com", password "Password".
- Tests use in-memory MongoDB (mongodb-memory-server) for realistic route handler integration tests.
- API responses never expose passwordHash for User, Admin.
- Existing Products and Users APIs remain unchanged — only tests are added.
- Validation patterns reuse existing helpers from `src/API/helpers.ts`.

## Expected Files

| File | Action |
|------|--------|
| `src/DB/models/Admin.ts` | Create |
| `src/API/helpers.ts` | Extend with admin helpers |
| `src/app/api/admins/route.ts` | Create |
| `src/app/api/admins/[id]/route.ts` | Create |
| `scripts/seed-admin.ts` | Create |
| `vitest.config.ts` | Create |
| `vitest.setup.ts` | Create |
| `tests/helpers.test.ts` | Create |
| `tests/api/products.test.ts` | Create |
| `tests/api/users.test.ts` | Create |
| `tests/api/admins.test.ts` | Create |

## Validation

- Confirm all CRUD route handlers compile and type-check.
- Run `npx vitest run` — all tests pass.
- Run `npm run lint` and `npm run build` — clean output.
- Verify passwordHash is never exposed in User/Admin API responses.
- Verify duplicate email returns 409 for both Users and Admins.
