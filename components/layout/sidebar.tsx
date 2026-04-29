"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Target,
  Settings,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Target },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Clients", href: "/clients", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-ink text-white rounded-full shadow-lg"
      >
        {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-ink/20 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-surface border-r border-line flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-ink flex items-center justify-center">
              <ShieldCheck className="size-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-ink">
                VR Ethiopia
              </div>
              <div className="text-[10px] uppercase tracking-widest font-semibold text-ink-subtle">
                Internal Ops
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all",
                  isActive
                    ? "bg-neutral-100 text-ink"
                    : "text-ink-muted hover:text-ink hover:bg-neutral-50",
                )}
              >
                <item.icon
                  className={cn(
                    "size-4.5",
                    isActive ? "text-ink" : "text-ink-subtle",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 mt-auto">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink hover:bg-neutral-50 rounded-md transition-all"
          >
            <Settings className="size-4.5 text-ink-subtle" />
            Settings
          </Link>
        </div>
      </aside>
    </>
  );
}
