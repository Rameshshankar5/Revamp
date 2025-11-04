"use client";
import SidebarLayout from "@/components/SidebarLayout";
import { authApi, customerApi } from "@/lib/api";
import { useEffect, useState } from "react";

type Vehicle = { id?: string; make?: string; model?: string; plateNo?: string; year?: number };

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  useEffect(() => { (async () => setVehicles(await customerApi("/api/vehicles")))(); }, []);

  return (
    <SidebarLayout>
      <h2 className="text-xl font-semibold mb-4">My Vehicles</h2>
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        {vehicles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">No vehicles found.</div>
        ) : (
          <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
    </SidebarLayout>
  );
}
