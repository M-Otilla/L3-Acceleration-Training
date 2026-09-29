# Step 3 Implementation Plan

## Problem

The Next.js application currently has frontend-only demo state and an empty database/API architecture. Step 3 requires a secure MongoDB connection, Product and User schemas, and CRUD APIs that can support the later dynamic restaurant/admin features.

## Proposed approach

1. Add a local MongoDB configuration using the agreed database URI:
   - Host/database: `mongodb://localhost:27017/LaTavola`
   - Credentials: `admin` / `password`
   - Store the complete URI only in an ignored `.env.local`.
   - Add `.env.example` with a redacted placeholder and document the required variable.
2. Add the password hashing dependency (`bcryptjs`) and its TypeScript types if needed.
3. Create a cached Mongoose connection helper in `src/DB/mongodb.ts` that:
   - Reads `MONGODB_URI` from the environment.
   - Reuses the connection across Next.js hot reloads/serverless invocations.
   - Throws explicit configuration/connection errors instead of silently falling back.
4. Create Mongoose schemas/models:
   - `Product`: name, category, price, description, badges, timestamps, and stable identifiers.
   - `User`: full name, mobile number, unique normalized email, hashed password, timestamps.
   - Ensure model registration is safe during hot reload and database uniqueness is represented with an email index.
5. Create App Router route handlers for CRUD:
   - `src/app/api/products/route.ts` for listing and creating products.
   - `src/app/api/products/[id]/route.ts` for reading, updating, and deleting one product.
   - `src/app/api/users/route.ts` for listing and creating users.
   - `src/app/api/users/[id]/route.ts` for reading, updating, and deleting one user.
6. Add shared API validation/serialization helpers under `src/lib/` or `src/API/`:
   - Validate required fields, numeric price, category values, email format, and password rules.
   - Never return password hashes in API responses.
   - Return consistent JSON status codes for validation, not-found, duplicate, and server errors.
   - Normalize user emails before persistence.
7. Keep the existing frontend demo behavior unchanged in this step; wiring UI forms to the database/admin flows can follow after the API foundation is verified.
8. Validate with lint, production build, formatting checks, and focused API/module checks. If a local MongoDB server is available, exercise connection and CRUD paths; otherwise verify compilation and explicit configuration behavior without claiming live database success.

## Decisions and boundaries

- MongoDB URI: `mongodb://localhost:27017/LaTavola`.
- `.env.local` will contain the provided credentials and remain untracked; `.env.example` will contain no secret.
- Users include password authentication data, but API responses never expose password hashes.
- Passwords will be hashed with `bcryptjs`; plaintext passwords will never be persisted.
- CRUD APIs use Next.js App Router route handlers under `/api/products` and `/api/users`.
- No authentication middleware, admin authorization, session/token system, or frontend API wiring is added yet; those are separate follow-up work.
- Existing Week2 files and current visual frontend behavior remain unchanged.

## Expected files

- `.env.local` (ignored local secret)
- `.env.example`
- `package.json` / `package-lock.json`
- `src/DB/mongodb.ts`
- `src/DB/models/Product.ts`
- `src/DB/models/User.ts`
- `src/API/` validation/serialization helpers
- `src/app/api/products/route.ts`
- `src/app/api/products/[id]/route.ts`
- `src/app/api/users/route.ts`
- `src/app/api/users/[id]/route.ts`

## Validation

- Confirm `MONGODB_URI` is excluded from Git.
- Run `npm run lint`, `npm run build`, and `git diff --check`.
- Verify route handlers type-check and serialize MongoDB IDs safely.
- Verify password hashes are omitted from user responses.
- Verify the MongoDB connection reports missing/failed configuration explicitly.
