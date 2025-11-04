"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Theme palette (matches your dashboard)
export const PALETTE = {
  ink: "#0A0A0B",     // primary text
  cyan: "#00F9FF",    // accent
  mint: "#3DDC97",    // success
  red:  "#E63946",    // danger
  sky:  "#4CC9F0",    // info
  blue: "#3E92CC",    // secondary
  // soft tints
  softBlue: "#F1F9FF",
  softMint: "#F2FCF8",
  softRing: "#E9EEF5",
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
      className="hidden md:flex md:flex-col md:w-64 md:shrink-0 min-h-screen border-r bg-white"
      style={{ borderColor: PALETTE.softRing }}
    >
      {/* Header strip with subtle glassy gradient */}
      <div
        className="px-5 py-4 font-semibold text-white tracking-wide"
        style={{
          background: `linear-gradient(90deg, ${PALETTE.blue} 0%, ${PALETTE.sky} 100%)`,
          boxShadow: "inset 0 -1px 0 rgba(255,255,255,.25)",
        }}
      >
        Revamp • Customer
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={[
                "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-900",
              ].join(" ")}
              style={
                active
                  ? {
                      background: `linear-gradient(90deg, ${PALETTE.blue} 0%, ${PALETTE.sky} 100%)`,
                      boxShadow:
                        "0 4px 14px rgba(62,146,204,.18), inset 0 1px 0 rgba(255,255,255,.25)",
                    }
                  : {
                      background: PALETTE.softBlue, // soft, elegant idle state
                      boxShadow: "inset 0 0 0 1px " + PALETTE.softRing,
                    }
              }
            >
              {/* Active accent bar */}
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full"
                style={{
                  background: active
                    ? "rgba(255,255,255,.9)"
                    : "transparent",
                }}
              />
              <span className="text-base">{it.emoji}</span>
              <span>{it.label}</span>

              {/* Hover sheen */}
              <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,0))" }} />
            </Link>
          );
        })}
      </nav>

      {/* Support card */}
      <div className="mt-auto p-3">
        <div
          className="rounded-xl px-3 py-2 text-xs text-gray-700 ring-1"
          style={{ ringColor: PALETTE.softRing, background: PALETTE.softMint }}
        >
          Need help? <span className="font-semibold">support@revamp.com</span>
        </div>
      </div>
    </aside>
  );
}
