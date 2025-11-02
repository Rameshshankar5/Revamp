"use client";

import { useEffect, useMemo, useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { api } from "@/lib/api";
import { decodeToken } from "@/utils/jwt";

type Customer = { id?: string; userId?: string; name?: string; email?: string; phone?: string };
type Vehicle = { id?: string; customerUserId?: string; make?: string; model?: string; plateNo?: string; year?: number };
type HistoryItem = {
  id?: string; vehicleId?: string; title: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELLED" | string;
  completedAt?: string; cost?: number;
  vehicle?: { plateNo?: string; make?: string; model?: string };
};

// ------- palette
const PALETTE = {
  ink: "#0A0A0B",
  cyan: "#00F9FF",
  mint: "#3DDC97",
  red: "#E63946",
  sky: "#4CC9F0",
  blue: "#3E92CC",
};

function StatusBadge({ status }: { status: string }) {
  const m: Record<string, { bg: string; text: string; ring: string }> = {
    OPEN:        { bg: "bg-[#3E92CC]/15", text: "text-[#3E92CC]", ring: "ring-[#3E92CC]/30" },
    IN_PROGRESS: { bg: "bg-[#4CC9F0]/15", text: "text-[#4CC9F0]", ring: "ring-[#4CC9F0]/30" },
    DONE:        { bg: "bg-[#3DDC97]/15", text: "text-[#3DDC97]", ring: "ring-[#3DDC97]/30" },
    CANCELLED:   { bg: "bg-[#E63946]/15", text: "text-[#E63946]", ring: "ring-[#E63946]/30" },
  };
  const s = m[status] ?? m.OPEN;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${s.bg} ${s.text} ${s.ring}`}>
      <span className="h-1.5 w-1.5 rounded-full" />
      {status.replace("_", " ")}
    </span>
  );
}

function StatCard({ title, value, hint, emoji }: { title: string; value: string; hint?: string; emoji?: string }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-xl">{emoji}</span>
      </div>
      <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
      {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className={`text-gray-900 ${mono ? "font-mono text-xs break-all" : ""}`}>{value ?? "—"}</span>
    </div>
  );
}

function greetNow() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}
function formatLKR(n: number) {
  try {
    return n
      .toLocaleString("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 })
      .replace("LKR", "Rs.");
  } catch {
    return `Rs. ${Math.round(n).toLocaleString()}`;
  }
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<{ username?: string; email?: string } | null>(null);
  const [me, setMe] = useState<Customer | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [recent, setRecent] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const stats = useMemo(() => {
    const active = recent.filter((r) => r.status !== "DONE" && r.status !== "CANCELLED").length;
    const completed = recent.filter((r) => r.status === "DONE").length;
    const totalCost = recent.reduce((s, r) => s + (typeof r.cost === "number" ? r.cost : 0), 0);
    return { active, completed, totalCost };
  }, [recent]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decoded: any = decodeToken(token);
    setUser({ username: decoded?.username, email: decoded?.email });

    (async () => {
      try {
        const mePromise = api("/api/customer/customers/me").catch(() => null);
        const [meRes, vRes, hRes] = await Promise.all([
          mePromise,
          api("/api/customer/vehicles"),
          api("/api/customer/history"),
        ]);

        setMe(meRes ?? null);
        setVehicles(Array.isArray(vRes) ? vRes : []);
        const hist = Array.isArray(hRes) ? hRes : [];
        hist.sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""));
        setRecent(hist.slice(0, 8));
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <SidebarLayout><div className="min-h-[50vh] grid place-items-center text-gray-600">Loading…</div></SidebarLayout>;
  if (err)      return <SidebarLayout><div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{err}</div></SidebarLayout>;

  return (
    <SidebarLayout>
      {/* welcome bar under header */}
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">{user?.email ?? ""}</div>
            <h2 className="text-xl font-semibold text-gray-900">
              {`Good ${greetNow()}, ${user?.username ?? "Customer"}!`}
            </h2>
            <p className="text-gray-600">Here’s your work overview for today.</p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Active Jobs" value={String(stats.active)} hint="Open or in-progress" emoji="🛠️" />
        <StatCard title="Completed"  value={String(stats.completed)} hint="All-time shown"      emoji="✅" />
        <StatCard title="Recent Cost" value={formatLKR(stats.totalCost)} hint="Sum of recent items" emoji="💳" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <section className="lg:col-span-1">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">My Profile</h3>
              {me && (
                <span className="rounded-full bg-white text-[#3E92CC] ring-1 ring-[#3E92CC]/30 px-2.5 py-1 text-xs font-medium">
                  Customer
                </span>
              )}
            </div>
            {me ? (
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Name" value={me.name} />
                <Row label="Email" value={me.email} />
                <Row label="Phone" value={me.phone} />
                <Row label="User ID" value={me.userId} mono />
              </div>
            ) : (
              <p className="mt-4 text-gray-600">No profile found.</p>
            )}
          </div>
        </section>

        {/* Vehicles */}
        <section className="lg:col-span-2">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">My Vehicles</h3>
            </div>

            {vehicles.length === 0 ? (
              <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
                No vehicles found.
              </div>
            ) : (
              <ul className="mt-4 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {vehicles.map((v) => (
                  <li key={v.id} className="rounded-lg border border-gray-200 p-4 hover:shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-gray-900">{v.make} {v.model}</div>
                      <span className="text-xs px-2 py-0.5 rounded-full ring-1 ring-gray-200 bg-gray-50">{v.year ?? "—"}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">{v.plateNo ?? "—"}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Recent history */}
      <section className="mt-6">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <h3 className="text-lg font-semibold mb-4">Recent Service History</h3>

          {recent.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
              No history yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full">
                <thead>
                  <tr className="text-left text-sm font-semibold" style={{ background: PALETTE.ink, color: "white" }}>
                    <th className="p-3">Completed</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Cost (LKR)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recent.map((h, i) => (
                    <tr key={h.id ?? i} className="border-t last:border-b" style={{ borderColor: "#EEF2F7" }}>
                      <td className="p-3 text-gray-600">{h.completedAt ? new Date(h.completedAt).toLocaleString() : "—"}</td>
                      <td className="p-3 font-medium text-gray-800">{h.title}</td>
                      <td className="p-3 text-gray-700">
                        {h.vehicle?.make} {h.vehicle?.model}
                        {h.vehicle?.plateNo ? <span className="text-gray-500"> • {h.vehicle?.plateNo}</span> : ""}
                      </td>
                      <td className="p-3"><StatusBadge status={h.status} /></td>
                      <td className="p-3 text-right font-semibold" style={{ color: PALETTE.ink }}>
                        {typeof h.cost === "number" ? h.cost.toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </SidebarLayout>
  );
}
