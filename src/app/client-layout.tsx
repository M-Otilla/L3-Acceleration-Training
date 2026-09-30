"use client";

import dynamic from "next/dynamic";

const AuthProvider = dynamic(() => import("@/contexts/AuthContext").then((mod) => mod.AuthProvider), { ssr: false });

export default function ClientLayout(props: { children: React.ReactNode }) {
  return <AuthProvider>{props.children}</AuthProvider>;
}
