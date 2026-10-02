# Test Generation Writeup — Vitest + MongoMemoryServer for Next.js API Routes

## Why this module

The L3 Acceleration Training project (La Tavola) is a Next.js full-stack app with MongoDB-backed API routes for products and authentication. The testing strategy chooses **integration over unit** tests: every test calls the route handlers directly (imported as functions), exercising routing, body parsing, validation, error handling, and database queries as an actual client would see them.

This matters because many bugs live in the boundaries — malformed JSON, wrong content types, missing fields, invalid ObjectIds — that unit tests of individual functions would miss. The trade-off is slower test execution, but for a small API surface (~5 endpoints), integration tests provide more confidence per line of code.

## Generating the suite

The suite was generated with an automated tool (the `Refactor.md` file documents the generation prompt). It produced two files:

- **`src/app/api/products/route.test.ts`** — 260 lines, 13 active tests across 2 endpoint groups
- **`src/app/api/auth/login.test.ts`** — 348 lines, 17 active tests across 3 endpoint groups

The generator chose `vitest` for speed (native ES modules, parallel threads) and a simpler config. It selected `mongodb-memory-server` to spin up a real MongoDB instance in-process, avoiding mock databases.

## What the generated suite covers

### Products (`route.test.ts`)

| Endpoint | Tests | Coverage highlights |
|---|---|---|
| **GET** `/api/products` | 2 | Empty list, 503 on DB unavailable (via `isMongoUnavailableError` helper) |
| **POST** `/api/products` | 11 | Creation + response shape, category normalization to lowercase, validation (missing name, invalid category listing valid values, negative price), malformed JSON, wrong content type, price rounding, badge stripping (non-strings filtered), whitespace trimming, empty badges, no badges field |

The PATCH/DELETE/GET-by-id endpoint groups are commented out — they require parameterized route handlers (`[id]/route.ts`) that have not yet been implemented.

### Auth (`login.test.ts`)

| Endpoint | Tests | Coverage highlights |
|---|---|---|
| **POST** `/api/auth/login` (valid) | 5 | User login, Admin login, session cookie set and parsed correctly, email normalization to lowercase, no password hash in response |
| **POST** `/api/auth/register` | 10 | Creation + shape, bcrypt verification (hash stored AND validates), duplicate email rejection, password policy (<8 chars, no letter, no number), malformed JSON, missing fullName/mobileNumber, invalid email format, session cookie on registration |
| **POST** `/api/auth/logout` | 2 | Cookie cleared (`max-age=0`), idempotent calls |

## What the coverage numbers say (and don't say)

### What they say

- **Error-path parity:** Every validation branch in POST `/api/products` has its own test. The endpoint alone has 11 tests, with separate cases for missing name, invalid category, negative price, malformed JSON, wrong content type, and more. This is strong — most real-world APIs test the happy path and stop there.
- **Security-relevant tests:** Login sets a session cookie on success, parses it back to verify user identity, and never returns password hashes in login responses. Password hashing is verified end-to-end: bcrypt hash stored, starts with `$2b$`, and `bcrypt.compare` validates against the plaintext.
- **Data integrity:** Registration verifies slug generation, product code generation, price rounding, and badge filtering on products; duplicate email rejection and session cookie setting on auth.

### What they don't say

- **No client-side tests.** These only cover API routes. React components (admin dashboard, checkout flow) are untested. If the app grows to rely on complex client logic, Vitest with `jsdom` or Playwright would be needed.
- **No concurrency tests.** Two simultaneous logins for the same user, race conditions during registration, or concurrent product creation from duplicate slugs — none of these are tested. MongoDB handles most of this at the document level (unique indexes), but it's not verified by test.
- **No performance benchmarks.** Route handlers work but take arbitrary time. There's no assertion on response time, which matters for a production food ordering app.

## Run results

```bash
npm test     # runs `vitest run`
```

The suite requires no external services — `MongoMemoryServer` handles MongoDB automatically. The first run downloads a MongoDB binary (~200 MB); subsequent runs are fast.

**Expected behavior:**
- All tests should pass on a clean checkout.
- The in-memory DB is created via the global `vitest.setup.ts` (shared across workers) and torn down after the run.
- Each test file manages its own connection lifecycle in `beforeAll`/`afterEach`.
- Test order within a file is deterministic (describe block ordering). Cross-worker order is not guaranteed.

## What this suite is actually protecting

This suite protects the **contract between the client and the API**:

1. **Status codes are correct.** Every endpoint returns the right HTTP code for success, validation failure, not-found, conflict, and server-error paths. This matters because the frontend makes routing decisions based on status (201 → redirect, 409 → "already exists", 503 → "try again").

2. **Response shapes are stable.** Tests assert `body.data.name`, `body.data.slug`, `body.data.user.email` etc. — if a handler changes its response format, the assertions will break. This is effectively type-safety for the API contract without using TypeScript at runtime.

3. **Validation catches real user mistakes.** The 11 POST tests are mostly about "what happens when a user submits bad data." Each one verifies that a clear, actionable error message is returned rather than a crash or confusing server error.

4. **Auth flow end-to-end.** From registration (password hashed correctly) → login (cookie set and parsed) → logout (cookie cleared), the full auth lifecycle is verified as an integrated pipeline, not as isolated functions.

## Optional — CI

For continuous integration:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test
```

Consider adding `--reporter=verbose` for detailed output in CI logs. If the MongoDB binary download is slow in CI, pre-cache it:

```bash
npx mongodb-memory-server --build-path ~/.cache/mongodb-binaries
```

The suite works on Windows (tested with PowerShell) and Linux/macOS out of the box.

---

## Architecture analysis

### Design decisions worth noting

**Importing route handlers directly.** Both suites import route handler functions (`GET`, `POST`) directly from their route files rather than spinning up an HTTP server. This tests the full request pipeline — routing, body parsing, validation chain, error handling — but skips the Next.js middleware layer and real HTTP semantics (headers, cookies as a client would see them). For ~5 endpoints with rich validation, direct imports provide better ROI than an HTTP wrapper.

**Seeding through Mongoose models.** The `createUser()`, `createAdmin()`, and product helper calls use `Model.create()` directly rather than making HTTP requests to seed data. This avoids a chicken-and-egg problem (needing auth to create test users) but means seeded documents bypass the route's validation layer — edge cases in validation might not be caught by seeded data.

**Dual MongoDB setup.** The global `vitest.setup.ts` creates a `MongoMemoryServer` instance once per process. Each test file (`route.test.ts`, `login.test.ts`) also creates its own instance in its own `beforeAll`. The route.test.ts instance overrides `MONGODB_URI` to point at itself, so it effectively uses its own server. The auth test's setup is more independent — it sets `MONGODB_URI` per test via `connectToDatabase()` calls in the seeding helpers.

**Clearing vs disconnecting.** `route.test.ts` clears all collections in `afterEach` (`coll.deleteMany({})`) to keep the connection alive between tests, instead of tearing down the entire DB. This is faster than re-connecting per test but means shared state across describe blocks within a file. Each describe block that needs clean state seeds its own data (which they all do, correctly).

### Risks and technical debt

1. **Unseeded endpoint coverage.** PATCH/DELETE/GET-by-id for products and GET `/api/auth/me` are commented out with no active tests. These require parameterized route handlers (`[id]/route.ts`). When added, test coverage should be expanded to match.

2. **Unused `route-debug3.test.ts`.** A debug artifact testing `validateProductInput()` with/without explicit slug and productCode. It has 2 minimal tests that log results and are more for interactive debugging than automated verification. Consider folding it into `route.test.ts` or deleting once validation is confirmed working.

3. **Global imports hide dependencies.** With `globals: true`, every test can use `describe`, `it`, `expect` without importing them. This keeps files terse but makes it impossible to tell from the import list what each file depends on. Consider whether the clarity cost is worth the boilerplate savings — or at least document this convention prominently.

4. **Test data persists across endpoint groups.** A product seeded in one POST test may appear in a subsequent GET test if they run in the same worker. Each describe block seeds its own data (which they all do correctly), but new blocks could accidentally inherit stale data between workers. The `afterEach` clear helps within a file but not across them.
