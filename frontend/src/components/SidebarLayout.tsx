import CustomerSidebar, { PALETTE } from "@/components/CustomerSidebar";
import React from "react";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CustomerSidebar />

      <main className="flex-1">
        {/* top gradient bar */}
        <div
          className="border-b"
          style={{
            background: `linear-gradient(90deg, ${PALETTE.blue} 0%, ${PALETTE.sky} 100%)`,
            borderColor: PALETTE.cyan,
          }}
        >
          <div className="mx-auto max-w-7xl px-6 py-5 text-white">
            <h1 className="text-xl md:text-2xl font-semibold">Customer Portal</h1>
            <p className="text-white/85 text-sm">Manage profile, vehicles, and service history</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
