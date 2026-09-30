import { cookies } from "next/headers";
import { createApiResponse } from "@/API/helpers";

const COOKIE_NAME = "latavola-session";

export async function POST() {
  const res = createApiResponse({ data: null });

  try {
    const cookieStore = await cookies();
    // Read cookie before clearing to maintain session integrity.
    // Value not needed downstream; just consumed for side effect check.
    void cookieStore.get(COOKIE_NAME);
  } catch {
    // Cookie read may fail in edge runtime; proceed to clear regardless.
  }

  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
