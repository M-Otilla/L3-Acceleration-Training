"use client";

import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminProductTable from "@/components/admin-product-table";

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if ((user as { type?: string } | null)?.type !== "admin") {
      router.push("/");
    }
  }, [user, loading, router]);

  return (
    <div className="admin-products">
      <div className="container">
        <nav aria-label="Admin breadcrumb" style={{ marginBottom: "1.5rem" }}>
          <Link href="/" className="button button-small">
            &larr; Home
          </Link>
        </nav>
        <AdminProductTable />
      </div>
    </div>
  );
}
