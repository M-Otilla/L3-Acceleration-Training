"use client";

import { useCallback, useEffect, useState } from "react";

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  productCode: string;
  category: string;
  price: number;
  description: string;
  badges: string[];
};

const CATEGORIES = [
  "antipasti",
  "pasta",
  "pizza",
  "desserts",
  "drinks",
  "specials",
] as const;

export default function AdminProductTable() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<AdminProduct>>({});

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products.");
      const body = (await res.json()) as { data: AdminProduct[] };
      setProducts(body.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const startEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      slug: product.slug,
      productCode: product.productCode,
      category: product.category,
      price: product.price,
      description: product.description,
      badges: product.badges,
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
      if (!res.ok) {
        const body = (await res.json()) as { error?: { message?: string } };
        throw new Error(body.error?.message ?? "Failed to save.");
      }
      cancelEdit();
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = (await res.json()) as { error?: { message?: string } };
        throw new Error(body.error?.message ?? "Failed to delete.");
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const categoryOptions = CATEGORIES.map((c) => c as string);

  return (
    <div className="admin-products">
      <div className="container">
        <header className="admin-header">
          <h1>Product Management</h1>
        </header>

        {error && (
          <div className="admin-alert admin-alert-error" role="alert">
            {error}
            <button type="button" className="admin-alert-close" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        )}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">Product</th>
                <th className="admin-th">Price</th>
                <th className="admin-th">Category</th>
                <th className="admin-th admin-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="admin-tbody-loading">
                    Loading products&hellip;
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="admin-tbody-empty">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isEditing = editingId === product.id;

                  return (
                    <tr key={product.id} className={isEditing ? "admin-row-editing" : ""}>
                      {isEditing ? (
                        <>
                          <td className="admin-td">
                            <input
                              className="admin-input admin-input-name"
                              type="text"
                              value={draft.name ?? ""}
                              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                            />
                          </td>
                          <td className="admin-td">
                            <input
                              className="admin-input"
                              type="number"
                              step="0.01"
                              min="0"
                              value={draft.price ?? ""}
                              onChange={(e) =>
                                setDraft((d) => ({ ...d, price: parseFloat(e.target.value) || 0 }))
                              }
                            />
                          </td>
                          <td className="admin-td">
                            <select
                              className="admin-select"
                              value={draft.category ?? ""}
                              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                            >
                              {categoryOptions.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="admin-td admin-td-actions">
                            <button
                              type="button"
                              className="button button-small"
                              onClick={() => saveEdit(product.id)}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="button button-small button-outline"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="admin-td">
                            <span className="admin-product-name">{product.name}</span>
                          </td>
                          <td className="admin-td admin-td-price">
                            PHP {product.price.toFixed(2)}
                          </td>
                          <td className="admin-td">
                            <span className="admin-badge">
                              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                            </span>
                          </td>
                          <td className="admin-td admin-td-actions">
                            <button
                              type="button"
                              className="button button-small"
                              onClick={() => startEdit(product)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="button button-small button-outline"
                              disabled={deletingId === product.id}
                              onClick={() => handleDelete(product.id)}
                            >
                              {deletingId === product.id ? "Deleting…" : "Delete"}
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
