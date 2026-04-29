import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/shell";

export const metadata: Metadata = {
  title: "VR Events — Internal Platform",
  description: "Lead, event, and client management for VR Ethiopia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
