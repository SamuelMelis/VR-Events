import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/user-context";

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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
