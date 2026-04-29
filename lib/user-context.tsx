"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "./types";

interface AuthContextValue {
  currentUser: User | null;
  loaded: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  email: string,
): Promise<User | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id, name, role, username")
    .eq("id", userId)
    .single();

  if (!data) return null;
  return {
    id:       data.id,
    name:     data.name,
    email,
    role:     data.role,
    username: data.username ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loaded, setLoaded]           = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // onAuthStateChange fires with INITIAL_SESSION immediately on mount —
    // this replaces the old async IIFE which raced against this listener and
    // could call signOut() while the listener had already resolved the user.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(supabase, session.user.id, session.user.email ?? "");
          if (profile) {
            setCurrentUser(profile);
          } else {
            // Profile row missing — clear the dangling auth session
            await supabase.auth.signOut();
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
        setLoaded(true);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? "Invalid email or password." : null };
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, loaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
