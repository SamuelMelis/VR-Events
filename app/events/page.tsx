"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, MapPin, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { events as seedEvents } from "@/lib/mock-data";
import type { DealType, EventStatus } from "@/lib/types";
import { cn, formatETB, relativeDay, formatDateShort } from "@/lib/utils";

const DEAL_LABEL: Record<DealType, string> = {
  pay_per_play: "Pay per play",
  flat_fee: "Flat fee",
  rev_split: "70 / 30 split",
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

type View = "upcoming" | "past";

export default function EventsPage() {
  const [view, setView] = useState<View>("upcoming");

  const filtered = useMemo(() => {
    const now = Date.now();
    if (view === "upcoming") {
      return seedEvents
        .filter((e) => new Date(e.date).getTime() >= now - 24 * 3600_000)
        .sort((a, b) => +new Date(a.date) - +new Date(b.date));
    }
    return seedEvents
      .filter((e) => new Date(e.date).getTime() < now - 24 * 3600_000)
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [view]);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Events"
        description="All confirmed bookings — past and upcoming."
        actions={
          <Button>
            <Plus className="size-4" />
            New event
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-1 rounded-md border border-line bg-surface p-1 w-fit">
        {(["upcoming", "past"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded capitalize",
              view === v
                ? "bg-ink text-white"
                : "text-ink-muted hover:bg-neutral-50",
            )}
          >
            {v}
          </button>
        ))}
      </div>

      <Card>
        <CardBody className="p-0 divide-y divide-line">
          {filtered.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.id}`}
              className="block px-5 py-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="text-center w-12 shrink-0">
                  <div className="text-xs text-ink-subtle uppercase tracking-wide">
                    {new Date(e.date).toLocaleDateString("en-GB", {
                      month: "short",
                    })}
                  </div>
                  <div className="text-lg font-semibold text-ink leading-none">
                    {new Date(e.date).getDate()}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-sm font-semibold text-ink">
                      {e.clientName}
                    </div>
                    <Badge tone={STATUS_TONE[e.status]}>{e.status}</Badge>
                    <Badge>{DEAL_LABEL[e.dealType]}</Badge>
                  </div>
                  <div className="text-xs text-ink-muted mt-0.5">{e.title}</div>
                  <div className="text-xs text-ink-subtle mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {e.venue}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {e.expectedCrowd.toLocaleString()} expected
                    </span>
                    <span>{relativeDay(e.date)}</span>
                  </div>
                </div>

                <div className="text-right shrink-0 hidden sm:block">
                  {e.status === "completed" ? (
                    <>
                      <div className="text-sm font-semibold text-ink">
                        {formatETB(e.cashCollectedETB)}
                      </div>
                      <div className="text-xs text-ink-subtle">
                        {e.sessionsLogged} sessions
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-ink-subtle">
                      {formatDateShort(e.date)}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-ink-subtle">
              No {view} events.
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
