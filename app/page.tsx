import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import { Stat } from "@/components/ui/stat";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { events, leads, clients } from "@/lib/mock-data";
import { formatETB, relativeDay, formatDateShort } from "@/lib/utils";
import type { LeadStage } from "@/lib/types";

const STAGE_ORDER: LeadStage[] = [
  "prospecting",
  "contacted",
  "qualifying",
  "qualified",
];

const STAGE_LABELS: Record<LeadStage, string> = {
  prospecting: "Prospecting",
  contacted: "Contacted",
  qualifying: "Qualifying",
  qualified: "Qualified",
  lost: "Lost",
};

export default function DashboardPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const completedThisMonth = events.filter(
    (e) =>
      e.status === "completed" &&
      new Date(e.date).getTime() >= monthStart.getTime(),
  );

  const revenueThisMonth = completedThisMonth.reduce(
    (sum, e) => sum + e.cashCollectedETB,
    0,
  );

  const upcoming = events
    .filter((e) => new Date(e.date).getTime() >= now.getTime())
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  const repeatEvents = events.filter((e) => {
    const c = clients.find((c) => c.id === e.clientId);
    return c && c.totalEvents > 1 && e.status === "completed";
  }).length;
  const completedTotal = events.filter((e) => e.status === "completed").length;
  const repeatPct =
    completedTotal === 0
      ? 0
      : Math.round((repeatEvents / completedTotal) * 100);

  const pipelineCount = leads.filter((l) => l.stage !== "lost").length;

  const stageCounts = STAGE_ORDER.map((stage) => ({
    stage,
    count: leads.filter((l) => l.stage === stage).length,
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Dashboard"
        description="What's happening across leads, events, and clients."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Stat
          label="Upcoming events"
          value={upcoming.length}
          hint={
            upcoming[0]
              ? `Next: ${upcoming[0].clientName} — ${relativeDay(upcoming[0].date)}`
              : "No events scheduled"
          }
        />
        <Stat
          label="Revenue this month"
          value={formatETB(revenueThisMonth)}
          hint={`From ${completedThisMonth.length} completed event${completedThisMonth.length === 1 ? "" : "s"}`}
        />
        <Stat
          label="Leads in pipeline"
          value={pipelineCount}
          hint={`${stageCounts.find((s) => s.stage === "qualified")?.count ?? 0} qualified, ready to close`}
        />
        <Stat
          label="Repeat-client share"
          value={`${repeatPct}%`}
          hint="Goal: 40–50% by month 6"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between flex-row">
            <div>
              <CardTitle>Upcoming events</CardTitle>
              <div className="text-xs text-ink-subtle mt-0.5">
                Next {Math.min(upcoming.length, 4)} bookings on the calendar
              </div>
            </div>
            <Link
              href="/events"
              className="text-xs font-medium text-accent flex items-center gap-1 hover:underline"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardBody className="p-0 divide-y divide-line">
            {upcoming.slice(0, 4).map((e) => (
              <Link
                key={e.id}
                href={`/events/${e.id}`}
                className="block px-5 py-3.5 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center w-12 shrink-0">
                    <div className="text-xs text-ink-subtle uppercase tracking-wide">
                      {new Date(e.date).toLocaleDateString("en-GB", { month: "short" })}
                    </div>
                    <div className="text-lg font-semibold text-ink leading-none">
                      {new Date(e.date).getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-ink truncate">
                        {e.clientName}
                      </div>
                      <Badge tone={e.status === "confirmed" ? "positive" : "neutral"}>
                        {e.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-ink-subtle mt-0.5 flex items-center gap-3 truncate">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {e.venue}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {e.expectedCrowd.toLocaleString()} expected
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-ink-subtle shrink-0 hidden sm:block">
                    {relativeDay(e.date)}
                  </div>
                </div>
              </Link>
            ))}
            {upcoming.length === 0 ? (
              <div className="p-8 text-center text-sm text-ink-subtle">
                No upcoming events. Add a confirmed booking from the leads page.
              </div>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline by stage</CardTitle>
            <div className="text-xs text-ink-subtle mt-0.5">
              Leads currently in flight
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {stageCounts.map(({ stage, count }) => {
              const max = Math.max(...stageCounts.map((s) => s.count), 1);
              const pct = (count / max) * 100;
              return (
                <div key={stage}>
                  <div className="flex justify-between text-xs text-ink-muted mb-1">
                    <span>{STAGE_LABELS[stage]}</span>
                    <span className="font-medium text-ink">{count}</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ink rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-2 mt-2 border-t border-line">
              <Link
                href="/leads"
                className="text-xs font-medium text-accent flex items-center gap-1 hover:underline"
              >
                Open pipeline
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top repeat clients</CardTitle>
            <div className="text-xs text-ink-subtle mt-0.5">
              Sorted by lifetime revenue
            </div>
          </CardHeader>
          <CardBody className="p-0 divide-y divide-line">
            {[...clients]
              .sort((a, b) => b.lifetimeRevenue - a.lifetimeRevenue)
              .slice(0, 4)
              .map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink truncate">
                      {c.name}
                    </div>
                    <div className="text-xs text-ink-subtle">
                      {c.totalEvents} event{c.totalEvents === 1 ? "" : "s"} •{" "}
                      {c.lastEventAt
                        ? `last ${formatDateShort(c.lastEventAt)}`
                        : "no events yet"}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-ink shrink-0">
                    {formatETB(c.lifetimeRevenue)}
                  </div>
                </div>
              ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Things to follow up on</CardTitle>
            <div className="text-xs text-ink-subtle mt-0.5">
              Post-event messages and re-bookings
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {clients
              .filter((c) => c.rebookingStatus === "follow_up")
              .map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="mt-1 size-2 rounded-full bg-warn shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-ink">{c.name}</div>
                    <div className="text-xs text-ink-subtle">
                      Last event{" "}
                      {c.lastEventAt ? formatDateShort(c.lastEventAt) : "—"} ·{" "}
                      send re-booking message
                    </div>
                  </div>
                </div>
              ))}
            {clients.filter((c) => c.rebookingStatus === "follow_up").length ===
            0 ? (
              <div className="text-sm text-ink-subtle">
                Nothing pending. You're caught up.
              </div>
            ) : null}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
