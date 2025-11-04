"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const PALETTE = {
  ink: "#0A0A0B",
  cyan: "#00F9FF",
  mint: "#3DDC97",
  red: "#E63946",
  sky: "#4CC9F0",
  blue: "#3E92CC",
};

type Item = { href: string; label: string; emoji: string };

const items: Item[] = [
  { href: "/consumer-dashboard", label: "Home",        emoji: "🏠" },
  { href: "/customer-history",   label: "History",     emoji: "🕘" },
  { href: "/customer-profile",   label: "My Profile",  emoji: "👤" },
  { href: "/customer-vehicles",  label: "My Vehicles", emoji: "🚗" },
];

export default function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex md:flex-col md:w-64 md:shrink-0 border-r min-h-screen"
      style={{ borderColor: "#E9EEF5", background: "white" }}
    >
      <div
        className="px-5 py-4 font-semibold text-white"
        style={{
          background: `linear-gradient(90deg, ${PALETTE.blue} 0%, ${PALETTE.sky} 100%)`,
        }}
      >
        Revamp • Customer
      </div>

      <nav className="p-3 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={[
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                active ? "text-white" : "text-gray-700 hover:text-gray-900",
              ].join(" ")}
              style={
                active
                  ? {
                      background: `linear-gradient(90deg, ${PALETTE.blue} 0%, ${PALETTE.sky} 100%)`,
                      boxShadow: "0 1px 0 rgba(0,0,0,0.02) inset",
                    }
                  : { background: "transparent" }
              }
            >
              <span className="text-base">{it.emoji}</span>
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-3">
        <div className="rounded-lg px-3 py-2 text-xs text-gray-600 ring-1"
             style={{ ringColor: "#E9EEF5" }}>
          Need help? Contact support@revamp.com
        </div>
      </div>
    </aside>
  );
}
