"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  MapPin,
  Users,
  Clock,
  Calendar,
  Wallet,
  Receipt,
  Minus,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field, Input } from "@/components/ui/input";
import { events, userById } from "@/lib/mock-data";
import type { DealType, EventStatus, VrEvent } from "@/lib/types";
import { cn, formatETB, formatDate, formatDateShort } from "@/lib/utils";

const DEAL_LABEL: Record<DealType, string> = {
  pay_per_play: "Pay per play",
  flat_fee: "Flat fee",
  rev_split: "70 / 30 revenue split",
};

const STATUS_TONE: Record<
  EventStatus,
  "neutral" | "accent" | "positive" | "warn" | "danger"
> = {
  scheduled: "neutral",
  confirmed: "accent",
  in_progress: "warn",
  completed: "positive",
  cancelled: "danger",
};

const DEFAULT_SESSION_PRICE = 250;

interface SessionEntry {
  id: string;
  amountETB: number;
  loggedAt: string;
}

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const event = useMemo(
    () => events.find((e) => e.id === params.id),
    [params.id],
  );

  const [sessions, setSessions] = useState<SessionEntry[]>(
    event && event.status === "completed" && event.sessionsLogged > 0
      ? // Synthesize a few entries so the past event detail isn't empty
        Array.from({ length: event.sessionsLogged }).map((_, i) => ({
          id: `s_${i}`,
          amountETB: Math.round(event.cashCollectedETB / event.sessionsLogged),
          loggedAt: new Date().toISOString(),
        }))
      : [],
  );
  const [price, setPrice] = useState(DEFAULT_SESSION_PRICE);
  const [expenses, setExpenses] = useState(event?.expensesETB ?? 0);
  const [expenseInput, setExpenseInput] = useState("");

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto">
        <PageHeader title="Event not found" />
        <Link href="/events" className="text-sm text-accent hover:underline">
          ← Back to events
        </Link>
      </div>
    );
  }

  const cash = sessions.reduce((s, e) => s + e.amountETB, 0);

  function addSession() {
    setSessions((prev) => [
      {
        id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        amountETB: price,
        loggedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  function undoLast() {
    setSessions((prev) => prev.slice(1));
  }

  function addExpense() {
    const amt = Number(expenseInput);
    if (!isFinite(amt) || amt <= 0) return;
    setExpenses((e) => e + amt);
    setExpenseInput("");
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href="/events"
        className="inline-flex items-center gap-1 text-xs text-ink-subtle hover:text-ink mb-3"
      >
        <ArrowLeft className="size-3" />
        All events
      </Link>

      <PageHeader
        title={event.clientName}
        description={event.title}
        actions={
          <Badge tone={STATUS_TONE[event.status]}>{event.status}</Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Day-of session tracker</CardTitle>
            <div className="text-xs text-ink-subtle mt-0.5">
              One tap per session — designed for use on phone at the booth.
            </div>
          </CardHeader>
          <CardBody className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Sessions" value={sessions.length} />
              <Stat label="Cash collected" value={formatETB(cash)} />
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <Field label="Price per session (ETB)">
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                />
              </Field>
              <Button
                onClick={undoLast}
                variant="outline"
                disabled={sessions.length === 0}
                className="h-9"
              >
                <Minus className="size-4" />
                Undo last
              </Button>
            </div>

            <button
              onClick={addSession}
              className={cn(
                "w-full rounded-lg bg-ink text-white py-7 text-lg font-semibold",
                "active:bg-neutral-700 transition-colors",
                "flex items-center justify-center gap-2",
              )}
            >
              <Plus className="size-6" />
              Log session — +{formatETB(price)}
            </button>

            <div>
              <div className="text-xs font-medium text-ink-muted mb-2 flex items-center justify-between">
                <span>Recent sessions</span>
                <span>{sessions.length} total</span>
              </div>
              <div className="rounded-md border border-line max-h-56 overflow-y-auto divide-y divide-line">
                {sessions.slice(0, 12).map((s, i) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <span className="text-ink-muted">
                      Session #{sessions.length - i}
                    </span>
                    <span className="font-medium text-ink">
                      {formatETB(s.amountETB)}
                    </span>
                  </div>
                ))}
                {sessions.length === 0 ? (
                  <div className="px-3 py-6 text-center text-xs text-ink-subtle">
                    No sessions logged yet. Tap the button above when a player
                    pays.
                  </div>
                ) : null}
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking details</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <DetailRow icon={<Calendar className="size-4" />} label="Date">
                {formatDate(event.date)}
              </DetailRow>
              <DetailRow icon={<Clock className="size-4" />} label="Hours">
                {new Date(event.startsAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                –{" "}
                {new Date(event.endsAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </DetailRow>
              <DetailRow icon={<MapPin className="size-4" />} label="Venue">
                {event.venue}
              </DetailRow>
              <DetailRow icon={<Users className="size-4" />} label="Crowd">
                ~{event.expectedCrowd.toLocaleString()} expected
              </DetailRow>
              <DetailRow icon={<Wallet className="size-4" />} label="Deal">
                {DEAL_LABEL[event.dealType]}
                {event.flatFeeETB ? ` · ${formatETB(event.flatFeeETB)}` : ""}
              </DetailRow>

              <div>
                <div className="text-xs font-medium text-ink-muted mt-3 mb-1.5">
                  Operators
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {event.assignedOperatorIds.map((id) => {
                    const u = userById(id);
                    if (!u) return null;
                    return (
                      <Badge key={id} tone="neutral">
                        {u.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              {event.notes ? (
                <div className="pt-3 border-t border-line">
                  <div className="text-xs font-medium text-ink-muted mb-1">
                    Notes
                  </div>
                  <div className="text-xs text-ink-muted">{event.notes}</div>
                </div>
              ) : null}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
              <div className="text-xs text-ink-subtle mt-0.5">
                Transport, food, generator…
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-ink-muted">Total spent</span>
                <span className="text-lg font-semibold text-ink">
                  {formatETB(expenses)}
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Amount in ETB"
                  type="number"
                  value={expenseInput}
                  onChange={(e) => setExpenseInput(e.target.value)}
                />
                <Button onClick={addExpense} variant="outline" size="md">
                  <Receipt className="size-4" />
                  Add
                </Button>
              </div>
              <div className="pt-2 border-t border-line text-xs text-ink-muted flex justify-between">
                <span>Net (cash − expenses)</span>
                <span className="font-semibold text-ink">
                  {formatETB(cash - expenses)}
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-7 rounded-md bg-neutral-100 text-ink-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-ink-subtle">{label}</div>
        <div className="text-sm text-ink">{children}</div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-surface-alt px-4 py-3">
      <div className="text-xs text-ink-subtle">{label}</div>
      <div className="text-2xl font-semibold text-ink tracking-tight">
        {value}
      </div>
    </div>
  );
}
