'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(_prevState: { error: string }, formData: FormData) {
  const username = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();
  const expectedUsername = process.env.ADMIN_USERNAME ?? 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

  if (username === expectedUsername && password === expectedPassword) {
    const cookieStore = await cookies();
    cookieStore.set('la-tavola-admin', 'true', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    redirect('/admin');
  }

  return { error: 'Incorrect admin username or password.' };
}
