"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/user-context";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Card, CardBody } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await login(email, password);

    if (loginError) {
      setError(loginError);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center">
          <div className="size-12 rounded-xl bg-ink flex items-center justify-center mb-4 shadow-lg shadow-ink/10">
            <ShieldCheck className="size-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="text-sm text-ink-subtle mt-1.5">
            Internal Platform — VR Ethiopia
          </p>
        </div>

        <Card className="shadow-xl border-line/60">
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Email address">
                <Input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@vr-ethiopia.com"
                  className="h-11"
                />
              </Field>

              <Field label="Password">
                <Input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11"
                />
              </Field>

              {error && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-sm font-semibold shadow-md shadow-ink/5"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Sign in to platform"
                )}
              </Button>
            </form>
          </CardBody>
        </Card>

        <p className="text-center text-[11px] text-ink-subtle px-6">
          Authorized personnel only. All access and modifications are logged for audit purposes.
        </p>
      </div>
    </div>
  );
}
