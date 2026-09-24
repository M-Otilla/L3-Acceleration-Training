'use client';

import { useFormState } from 'react-dom';
import { loginAction } from '@/app/login/actions';

const initialState = { error: '' };

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <main id="main-content" className="container py-16 md:py-20">
      <div className="mx-auto max-w-xl rounded-none border border-border bg-[#fffaf2] p-8 shadow-[0_18px_40px_rgba(48,37,30,0.08)]">
        <p className="eyebrow">Authorized access</p>
        <h1 className="mt-4 text-4xl md:text-5xl">Admin login</h1>
        <p className="mt-3 text-base text-[#5b4d42]">Use your secure environment credentials to manage the menu.</p>

        <form action={formAction} className="mt-8 space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#4d4038]">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="w-full border border-border bg-[#fffdf9] px-4 py-3 text-base text-ink outline-none focus:border-tomato"
              defaultValue="admin"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#4d4038]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full border border-border bg-[#fffdf9] px-4 py-3 text-base text-ink outline-none focus:border-tomato"
              required
            />
          </div>

          {state.error ? (
            <p className="text-sm font-semibold text-[#a32d24]">{state.error}</p>
          ) : null}

          <button type="submit" className="button w-full justify-center">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
