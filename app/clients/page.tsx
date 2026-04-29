"use client";

import { useMemo, useState } from "react";
import { Phone, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { clients as seedClients } from "@/lib/mock-data";
import type { Client } from "@/lib/types";
import { cn, formatETB, formatDateShort } from "@/lib/utils";

const STATUS_LABEL: Record<Client["rebookingStatus"], string> = {
  active: "Active",
  follow_up: "Follow up",
  cold: "Cold",
  churned: "Churned",
};

const STATUS_TONE: Record<
  Client["rebookingStatus"],
  "neutral" | "accent" | "positive" | "warn" | "danger"
> = {
  active: "positive",
  follow_up: "warn",
  cold: "neutral",
  churned: "danger",
};

const TYPE_LABEL: Record<Client["type"], string> = {
  festival: "Festival",
  school: "School",
  corporate: "Corporate",
  ngo: "NGO / institution",
};

type SortKey = "revenue" | "events" | "recent";

export default function ClientsPage() {
  const [sort, setSort] = useState<SortKey>("revenue");
  const [filterStatus, setFilterStatus] = useState<
    "all" | Client["rebookingStatus"]
  >("all");

  const sorted = useMemo(() => {
    const filtered =
      filterStatus === "all"
        ? seedClients
        : seedClients.filter((c) => c.rebookingStatus === filterStatus);

    return [...filtered].sort((a, b) => {
      if (sort === "revenue") return b.lifetimeRevenue - a.lifetimeRevenue;
      if (sort === "events") return b.totalEvents - a.totalEvents;
      const aDate = a.lastEventAt ? +new Date(a.lastEventAt) : 0;
      const bDate = b.lastEventAt ? +new Date(b.lastEventAt) : 0;
      return bDate - aDate;
    });
  }, [sort, filterStatus]);

  const totalRevenue = seedClients.reduce(
    (sum, c) => sum + c.lifetimeRevenue,
    0,
  );
  const repeatClients = seedClients.filter((c) => c.totalEvents > 1).length;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Clients"
        description="Past organizers — your repeat-booking list. Sort to find who to call next."
        actions={
          <Button>
            <Plus className="size-4" />
            Add client
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <Mini label="Total clients" value={seedClients.length} />
        <Mini label="Repeat clients" value={`${repeatClients}`} />
        <Mini label="Lifetime revenue" value={formatETB(totalRevenue)} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <SortPills sort={sort} onChange={setSort} />
        <div className="ml-auto flex items-center gap-1 rounded-md border border-line bg-surface p-1">
          {(["all", "active", "follow_up", "cold"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium rounded capitalize",
                filterStatus === s
                  ? "bg-ink text-white"
                  : "text-ink-muted hover:bg-neutral-50",
              )}
            >
              {s === "follow_up" ? "Follow up" : s}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-ink-subtle border-b border-line">
                <th className="text-left font-medium px-5 py-3">Client</th>
                <th className="text-left font-medium px-2 py-3 hidden sm:table-cell">
                  Type
                </th>
                <th className="text-right font-medium px-2 py-3">Lifetime ETB</th>
                <th className="text-right font-medium px-2 py-3 hidden md:table-cell">
                  Events
                </th>
                <th className="text-left font-medium px-2 py-3 hidden md:table-cell">
                  Last event
                </th>
                <th className="text-left font-medium px-2 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sorted.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-ink">{c.name}</div>
                    <div className="text-xs text-ink-subtle">
                      {c.primaryContactName}
                    </div>
                  </td>
                  <td className="px-2 py-3.5 text-ink-muted hidden sm:table-cell">
                    {TYPE_LABEL[c.type]}
                  </td>
                  <td className="px-2 py-3.5 text-right font-semibold text-ink">
                    {formatETB(c.lifetimeRevenue)}
                  </td>
                  <td className="px-2 py-3.5 text-right text-ink-muted hidden md:table-cell">
                    {c.totalEvents}
                  </td>
                  <td className="px-2 py-3.5 text-ink-muted hidden md:table-cell">
                    {c.lastEventAt ? formatDateShort(c.lastEventAt) : "—"}
                  </td>
                  <td className="px-2 py-3.5">
                    <Badge tone={STATUS_TONE[c.rebookingStatus]}>
                      {STATUS_LABEL[c.rebookingStatus]}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <a
                      href={`tel:${c.primaryContactPhone}`}
                      className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
                    >
                      <Phone className="size-3.5" />
                      <span className="hidden lg:inline">Call</span>
                    </a>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-ink-subtle"
                  >
                    No clients match this filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-surface px-4 py-3">
      <div className="text-xs text-ink-subtle">{label}</div>
      <div className="text-lg font-semibold text-ink mt-0.5">{value}</div>
    </div>
  );
}

function SortPills({
  sort,
  onChange,
}: {
  sort: SortKey;
  onChange: (s: SortKey) => void;
}) {
  const opts: { key: SortKey; label: string }[] = [
    { key: "revenue", label: "By lifetime revenue" },
    { key: "events", label: "By event count" },
    { key: "recent", label: "By most recent" },
  ];
  return (
    <div className="flex items-center gap-1 rounded-md border border-line bg-surface p-1">
      {opts.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            "px-2.5 py-1 text-[11px] font-medium rounded",
            sort === o.key
              ? "bg-ink text-white"
              : "text-ink-muted hover:bg-neutral-50",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
