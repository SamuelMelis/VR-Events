"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/shell";
import { useAuth } from "@/lib/user-context";
import { preloadCoreData } from "@/lib/app-data";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, loaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loaded && !currentUser) {
      router.replace("/login");
    }
    if (loaded && currentUser) {
      preloadCoreData();
    }
  }, [loaded, currentUser, router]);

  // Show spinner whenever we don't have a confirmed user — covers both the
  // initial load and the brief gap while router.replace("/login") completes.
  if (!loaded || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <div className="size-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
