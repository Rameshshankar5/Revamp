"use client";
import SidebarLayout from "@/components/SidebarLayout";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Item = { id?: string; title: string; status: string; completedAt?: string; cost?: number;
  vehicle?: { plateNo?: string; make?: string; model?: string } };

export default function HistoryPage() {
  const [rows, setRows] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      const h = await api("/api/customer/history");
      const list = Array.isArray(h) ? h : [];
      list.sort((a: Item, b: Item) => (b.completedAt || "").localeCompare(a.completedAt || ""));
      setRows(list);
    })();
  }, []);

  return (
    <SidebarLayout>
      <h2 className="text-xl font-semibold mb-4">All History</h2>
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left font-semibold text-gray-700">
              <th className="p-3">Completed</th>
              <th className="p-3">Title</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3 text-right">Cost (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id ?? i} className="border-t">
                <td className="p-3">{r.completedAt ? new Date(r.completedAt).toLocaleString() : "—"}</td>
                <td className="p-3 font-medium">{r.title}</td>
                <td className="p-3">{r.vehicle?.make} {r.vehicle?.model} {r.vehicle?.plateNo ? `• ${r.vehicle?.plateNo}` : ""}</td>
                <td className="p-3 text-right">{typeof r.cost === "number" ? r.cost.toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SidebarLayout>
  );
}
