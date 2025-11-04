"use client";
import SidebarLayout from "@/components/SidebarLayout";
import { authApi, customerApi } from "@/lib/api";
import { useEffect, useState } from "react";

type Customer = { userId?: string; name?: string; email?: string; phone?: string };

export default function ProfilePage() {
  const [me, setMe] = useState<Customer | null>(null);

  useEffect(() => {
    (async () => setMe(await customerApi("/api/customers/me").catch(() => null)))();
  }, []);

  return (
    <SidebarLayout>
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-2 text-sm">
        <div><span className="text-gray-500">Name:</span>  <span className="ml-2">{me?.name ?? "—"}</span></div>
        <div><span className="text-gray-500">Email:</span> <span className="ml-2">{me?.email ?? "—"}</span></div>
        <div><span className="text-gray-500">Phone:</span> <span className="ml-2">{me?.phone ?? "—"}</span></div>
        <div><span className="text-gray-500">User ID:</span> <span className="ml-2 font-mono text-xs break-all">{me?.userId ?? "—"}</span></div>
      </div>
    </SidebarLayout>
  );
}
