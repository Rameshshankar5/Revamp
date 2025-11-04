"use client";
import SidebarLayout from "@/components/SidebarLayout";
import { customerApi } from "@/lib/api";
import { useEffect, useState } from "react";

type Vehicle = { id?: string; make?: string; model?: string; plateNo?: string; year?: number };
type Item = {
  id?: string; title: string; status: string; completedAt?: string; cost?: number;
  vehicleId?: string;
  vehicle?: { plateNo?: string; make?: string; model?: string };
};

// ------- Updated Color Palette from your dashboard
const PALETTE = {
  primary: "#0A0A0B",      // Dark primary
  cyan: "#00F9FF",         // Bright cyan
  success: "#3DDC97",      // Green
  danger: "#E63946",       // Red
  info: "#4CC9F0",         // Light blue
  secondary: "#3E92CC",    // Blue
  background: "#FFFFFF",
  surface: "#F8FAFC",
  accent: "#6366F1",
  lightCyan: "#E6FFFF",    // Lighter cyan
  lightBlue: "#E6F7FF",    // Lighter blue
  lightGreen: "#E8F8F2",   // Lighter green
  lightRed: "#FFEBEE",     // Lighter red
  lightPurple: "#F3F4FF",  // Lighter purple
};

// ---------- Enhanced StatusBadge with updated colors
function StatusBadge({ status }: { status: string }) {
  const m: Record<string, { bg: string; text: string; glow: string }> = {
    OPEN: { bg: PALETTE.secondary, text: "white", glow: `${PALETTE.secondary}60` },
    IN_PROGRESS: { bg: PALETTE.info, text: "white", glow: `${PALETTE.info}60` },
    DONE: { bg: PALETTE.success, text: "white", glow: `${PALETTE.success}60` },
    CANCELLED: { bg: PALETTE.danger, text: "white", glow: `${PALETTE.danger}60` },
  };
  const s = m[status] ?? m.OPEN;
  
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-lg transition-all duration-300"
      style={{ 
        backgroundColor: s.bg,
        color: s.text,
        boxShadow: `0 2px 12px 0 ${s.glow}`
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
      {status.replace("_", " ")}
    </span>
  );
}

export default function HistoryPage() {
  const [rows, setRows] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [vehiclesRes, histRes] = await Promise.all([
          customerApi("/api/vehicles"),
          customerApi("/api/history"),
        ]);

        const vehicles: Vehicle[] = Array.isArray(vehiclesRes) ? vehiclesRes : [];
        const vmap = new Map<string, Vehicle>();
        vehicles.forEach(v => { if (v.id) vmap.set(v.id, v); });

        const list: Item[] = Array.isArray(histRes) ? histRes : [];
        list.forEach(h => {
          if (!h.vehicle && h.vehicleId && vmap.has(h.vehicleId)) {
            const v = vmap.get(h.vehicleId)!;
            h.vehicle = { make: v.make, model: v.model, plateNo: v.plateNo };
          }
        });

        list.sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""));
        setRows(list);
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div 
              className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-6"
              style={{ 
                borderColor: PALETTE.cyan,
                borderTopColor: 'transparent'
              }}
            ></div>
            <div className="text-gray-700 text-lg font-semibold">Loading service history...</div>
            <div className="text-cyan-600 text-sm mt-2">Fetching your records</div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      {/* Enhanced Header Section */}
      <div 
        className="rounded-2xl p-8 mb-8 hover:shadow-xl transition-all duration-500 border border-cyan-300"
        style={{
          background: `linear-gradient(135deg, ${PALETTE.lightBlue} 0%, ${PALETTE.lightCyan} 100%)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Service History</h2>
            <p className="text-gray-700 text-lg">Complete record of all your vehicle services</p>
          </div>
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl transform hover:rotate-12 transition-transform duration-500 shadow-lg text-white"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.cyan}, ${PALETTE.info})`,
              boxShadow: `0 8px 32px 0 ${PALETTE.cyan}60`
            }}
          >
            📋
          </div>
        </div>
      </div>

      {/* Enhanced Table Container */}
      <div 
        className="rounded-2xl p-6 hover:shadow-xl transition-all duration-500 border border-blue-300 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${PALETTE.lightBlue} 0%, ${PALETTE.lightCyan}80 100%)`,
        }}
      >
        {/* Table Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${PALETTE.secondary}, ${PALETTE.info})`,
                boxShadow: `0 4px 20px 0 ${PALETTE.secondary}60`
              }}
            >
              🔧
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">All Service Records</h3>
              <p className="text-gray-600 text-sm mt-1">Complete history of your vehicle services</p>
            </div>
          </div>
          <span 
            className="text-sm font-bold text-white px-4 py-2 rounded-full shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.secondary}, ${PALETTE.info})`,
              boxShadow: `0 4px 20px 0 ${PALETTE.secondary}60`
            }}
          >
            {rows.length} records
          </span>
        </div>

        {rows.length === 0 ? (
          <div 
            className="rounded-2xl border-2 border-dashed border-cyan-300 p-12 text-center text-gray-600 hover:border-cyan-500 transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.lightCyan}50, ${PALETTE.lightBlue}50)`,
            }}
          >
            <div className="text-5xl mb-4">📊</div>
            <div className="font-bold text-gray-700 text-xl mb-2">No service history found</div>
            <div className="text-gray-600">Your service records will appear here once you have services completed</div>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden border border-blue-200 bg-white/80 backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead>
                <tr 
                  className="text-left font-semibold text-gray-700"
                  style={{
                    background: `linear-gradient(135deg, ${PALETTE.lightBlue} 0%, ${PALETTE.lightCyan} 100%)`,
                  }}
                >
                  <th className="p-4 font-bold text-gray-900">Status</th>
                  <th className="p-4 font-bold text-gray-900">Completed Date</th>
                  <th className="p-4 font-bold text-gray-900">Service Title</th>
                  <th className="p-4 font-bold text-gray-900">Vehicle</th>
                  <th className="p-4 font-bold text-gray-900 text-right">Cost (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr 
                    key={r.id ?? i} 
                    className="border-t border-blue-100 hover:bg-white transition-all duration-300 group hover:scale-[1.01]"
                  >
                    <td className="p-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {r.completedAt ? new Date(r.completedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : "—"}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                        {r.title}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{ 
                            background: `linear-gradient(135deg, ${PALETTE.secondary}, ${PALETTE.info})`
                          }}
                        >
                          🚗
                        </span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {r.vehicle?.make} {r.vehicle?.model}
                          </div>
                          {r.vehicle?.plateNo && (
                            <div className="text-xs text-gray-600 mt-1">
                              {r.vehicle.plateNo}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {typeof r.cost === "number" ? (
                        <div className="flex items-center justify-end gap-2">
                          <span 
                            className="px-3 py-1 rounded-full text-sm font-bold text-white"
                            style={{
                              background: `linear-gradient(135deg, ${PALETTE.success}, ${PALETTE.cyan})`,
                              boxShadow: `0 2px 12px 0 ${PALETTE.success}40`
                            }}
                          >
                            Rs. {r.cost.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {rows.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-blue-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{rows.length}</span> service records
            </div>
            <div className="text-sm text-gray-600">
              Total spent: <span className="font-bold text-gray-900">
                Rs. {rows.reduce((sum, r) => sum + (r.cost || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}