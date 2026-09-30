"use client";

import { useCallback, useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  productCode: string;
  category: string;
  price: number;
  description: string;
  badges: string[];
};

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Product>>({});

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products.");
      const body = await res.json();
      setProducts((body as { data: Product[] }).data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      price: product.price,
      category: product.category,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error("Failed to save product.");
      cancelEdit();
      fetchProducts();
    } finally {
      setDraft({});
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product.");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const categories = ["antipasti", "pasta", "pizza", "desserts", "drinks", "specials"] as const;

  return (
    <div className="container" style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ marginBottom: 1.5 }}>Admin Dashboard</h1>

      {loading ? (
        <p>Loading products…</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="border px-4 py-2">Product name</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2" style={{ width: 160 }}>
                Edit / Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td className="border px-4 py-8 text-center text-gray-500" colSpan={4}>
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isEditing = editingId === product.id;

                return (
                  <tr key={product.id} className={isEditing ? "bg-blue-50" : ""}>
                    {/* Name */}
                    <td className="border px-4 py-2">{isEditing ? (
                      <input
                        className="w-full border px-2 py-1"
                        value={draft.name ?? product.name}
                        onChange={(e) => setDraft((d: Partial<Product>) => ({ ...d, name: e.target.value }))}
                      />
                    ) : (
                      product.name
                    )}</td>

                    {/* Price */}
                    <td className="border px-4 py-2">€{isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-24 border px-2 py-1"
                        value={draft.price ?? product.price}
                        onChange={(e) => setDraft((d: Partial<Product>) => ({ ...d, price: parseFloat(e.target.value) || 0 }))}
                      />
                    ) : (
                      <span>€{product.price.toFixed(2)}</span>
                    )}</td>

                    {/* Category */}
                    <td className="border px-4 py-2">{isEditing ? (
                      <select
                        className="w-full border px-2 py-1"
                        value={draft.category ?? product.category}
                        onChange={(e) => setDraft((d: Partial<Product>) => ({ ...d, category: e.target.value }))}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      product.category.charAt(0).toUpperCase() + product.category.slice(1)
                    )}</td>

                    {/* Actions */}
                    <td className="border px-4 py-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            className="mr-2 rounded bg-green-600 px-3 py-1 text-sm text-white"
                            onClick={() => saveEdit(product.id)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="rounded border px-3 py-1 text-sm"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="mr-2 rounded border px-3 py-1 text-sm"
                            onClick={() => startEdit(product)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === product.id}
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                            onClick={() => handleDelete(product.id)}
                          >
                            {deletingId === product.id ? "Deleting…" : "Delete"}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
