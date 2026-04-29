"use client";

import { Bell, Search, User } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-14 border-b border-line bg-surface flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-ink-subtle group-focus-within:text-ink transition-colors" />
          <input
            type="text"
            placeholder="Search leads, events, or clients..."
            className="w-full bg-surface-alt border border-line rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent/20 focus:border-accent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <button className="p-2 text-ink-subtle hover:text-ink hover:bg-neutral-100 rounded-md transition-colors relative">
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-1.5 bg-accent rounded-full border border-white" />
        </button>
        <div className="h-4 w-px bg-line" />
        <button className="flex items-center gap-2 px-1.5 py-1 text-sm font-medium text-ink-muted hover:text-ink rounded-md hover:bg-neutral-100 transition-colors">
          <div className="size-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs text-ink-subtle">
            <User className="size-3.5" />
          </div>
          <span className="hidden lg:inline">Samuel Melis</span>
        </button>
      </div>
    </header>
  );
}
