'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { CategoryModel, ProductModel } from '@/lib/data';

async function ensureDb() {
  await connectToDatabase();
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('la-tavola-admin');
  redirect('/');
}

export async function createCategoryAction(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const sortOrder = Number(formData.get('sortOrder') ?? 0);

  if (!name) {
    throw new Error('Category name is required.');
  }

  await ensureDb();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  await CategoryModel.create({
    name,
    slug,
    description,
    sortOrder
  });

  revalidatePath('/admin');
  revalidatePath('/menu');
  revalidatePath('/');
  redirect('/admin');
}

export async function createProductAction(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const price = Number(formData.get('price') ?? 0);
  const categoryId = String(formData.get('categoryId') ?? '');

  if (!name || !categoryId || !price) {
    throw new Error('Product name, price, and category are required.');
  }

  await ensureDb();
  const category = await CategoryModel.findById(categoryId).lean();
  const categoryName = category?.name ?? 'House Favorite';
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  await ProductModel.create({
    name,
    slug,
    description,
    price,
    categoryId,
    categoryName,
    featured: formData.get('featured') === 'on'
  });

  revalidatePath('/admin');
  revalidatePath('/menu');
  revalidatePath('/');
  redirect('/admin');
}

export async function deleteCategoryAction(categoryId: string) {
  await ensureDb();
  await CategoryModel.findByIdAndDelete(categoryId);
  await ProductModel.deleteMany({ categoryId });
  revalidatePath('/admin');
  revalidatePath('/menu');
  revalidatePath('/');
  redirect('/admin');
}

export async function deleteProductAction(productId: string) {
  await ensureDb();
  await ProductModel.findByIdAndDelete(productId);
  revalidatePath('/admin');
  revalidatePath('/menu');
  revalidatePath('/');
  redirect('/admin');
}
