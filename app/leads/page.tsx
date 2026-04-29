"use client";

import { useState } from "react";
import { Plus, Phone, Calendar, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { leads as seedLeads } from "@/lib/mock-data";
import type { Lead, LeadStage, TargetType } from "@/lib/types";
import { cn, relativeDay } from "@/lib/utils";

const COLUMNS: { key: LeadStage; label: string; description: string }[] = [
  {
    key: "prospecting",
    label: "Prospecting",
    description: "Spotted from calendar scan",
  },
  {
    key: "contacted",
    label: "Contacted",
    description: "First in-person visit done",
  },
  {
    key: "qualifying",
    label: "Qualifying",
    description: "Asking the 4 questions",
  },
  {
    key: "qualified",
    label: "Qualified",
    description: "Ready to close",
  },
];

const TARGET_LABEL: Record<TargetType, string> = {
  festival: "Festival",
  school: "School",
  corporate: "Corporate",
  ngo: "NGO / institution",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = leads.find((l) => l.id === selectedId) ?? null;

  function moveStage(id: string, stage: LeadStage) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));
  }

  function updateLead(id: string, patch: Partial<Lead>) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function addLead(input: Omit<Lead, "id" | "createdAt" | "ownerId">) {
    const newLead: Lead = {
      ...input,
      id: `l_${Math.random().toString(36).slice(2, 8)}`,
      ownerId: "u_sam",
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    setAddOpen(false);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Leads"
        description="Pipeline of event opportunities. Move cards across stages as you progress."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Add lead
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.key);
          return (
            <div key={col.key} className="min-w-0">
              <div className="px-1 mb-2 flex items-baseline justify-between">
                <div>
                  <div className="text-sm font-semibold text-ink">
                    {col.label}
                  </div>
                  <div className="text-xs text-ink-subtle">{col.description}</div>
                </div>
                <span className="text-xs font-medium text-ink-muted bg-neutral-100 rounded-full px-2 py-0.5">
                  {colLeads.length}
                </span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {colLeads.map((l) => (
                  <LeadCard
                    key={l.id}
                    lead={l}
                    onClick={() => setSelectedId(l.id)}
                  />
                ))}
                {colLeads.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-line bg-surface-alt px-3 py-6 text-center text-xs text-ink-subtle">
                    No leads here yet
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-xs text-ink-subtle">
        Lost / archived leads:{" "}
        <span className="text-ink-muted font-medium">
          {leads.filter((l) => l.stage === "lost").length}
        </span>
      </div>

      {addOpen ? (
        <AddLeadDialog onClose={() => setAddOpen(false)} onSubmit={addLead} />
      ) : null}

      {selected ? (
        <LeadDetailDrawer
          lead={selected}
          onClose={() => setSelectedId(null)}
          onMove={(stage) => moveStage(selected.id, stage)}
          onUpdate={(patch) => updateLead(selected.id, patch)}
        />
      ) : null}
    </div>
  );
}

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const tone =
    lead.stage === "qualified"
      ? "positive"
      : lead.stage === "qualifying"
        ? "accent"
        : "neutral";

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg border border-line bg-surface shadow-card hover:border-neutral-300 transition-colors p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-semibold text-ink">
          {lead.organizationName}
        </div>
        <Badge tone={tone}>{TARGET_LABEL[lead.targetType]}</Badge>
      </div>
      <div className="text-xs text-ink-muted mt-0.5">{lead.contactName}</div>

      {lead.qualification?.crowdSize || lead.qualification?.eventDate ? (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-subtle">
          {lead.qualification?.crowdSize ? (
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {lead.qualification.crowdSize.toLocaleString()}
            </span>
          ) : null}
          {lead.qualification?.eventDate ? (
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {relativeDay(lead.qualification.eventDate)}
            </span>
          ) : null}
        </div>
      ) : null}

      {lead.notes ? (
        <p className="mt-2 text-xs text-ink-muted line-clamp-2">{lead.notes}</p>
      ) : null}
    </button>
  );
}

function AddLeadDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (lead: Omit<Lead, "id" | "createdAt" | "ownerId">) => void;
}) {
  const [form, setForm] = useState({
    organizationName: "",
    contactName: "",
    contactPhone: "",
    targetType: "school" as TargetType,
    notes: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.organizationName.trim()) return;
    onSubmit({
      organizationName: form.organizationName.trim(),
      contactName: form.contactName.trim(),
      contactPhone: form.contactPhone.trim(),
      targetType: form.targetType,
      stage: "prospecting",
      notes: form.notes.trim(),
      firstContactAt: undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-40 bg-ink/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-line bg-surface shadow-lg">
        <div className="px-5 py-4 border-b border-line flex items-center justify-between">
          <div className="text-sm font-semibold">Add lead</div>
          <button
            onClick={onClose}
            className="text-ink-subtle text-sm hover:text-ink"
          >
            Close
          </button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <Field label="Organization">
            <Input
              required
              value={form.organizationName}
              onChange={(e) =>
                setForm({ ...form, organizationName: e.target.value })
              }
              placeholder="e.g. Hillside Academy"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact name">
              <Input
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                placeholder="e.g. Mr. Bekele"
              />
            </Field>
            <Field label="Phone">
              <Input
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                placeholder="+251 …"
              />
            </Field>
          </div>
          <Field label="Target type">
            <Select
              value={form.targetType}
              onChange={(e) =>
                setForm({ ...form, targetType: e.target.value as TargetType })
              }
            >
              <option value="festival">Festival</option>
              <option value="school">School</option>
              <option value="corporate">Corporate</option>
              <option value="ngo">NGO / institution</option>
            </Select>
          </Field>
          <Field label="Notes">
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Why this lead, what's next…"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add lead</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LeadDetailDrawer({
  lead,
  onClose,
  onMove,
  onUpdate,
}: {
  lead: Lead;
  onClose: () => void;
  onMove: (stage: LeadStage) => void;
  onUpdate: (patch: Partial<Lead>) => void;
}) {
  const q = lead.qualification ?? {};

  function setQual<K extends keyof NonNullable<Lead["qualification"]>>(
    key: K,
    value: NonNullable<Lead["qualification"]>[K],
  ) {
    onUpdate({ qualification: { ...q, [key]: value } });
  }

  const passes =
    (q.crowdSize ?? 0) >= 300 && q.hasShade && q.hasPower && q.eventDate;

  return (
    <div className="fixed inset-0 z-40 bg-ink/30 flex justify-end">
      <div className="w-full max-w-md bg-surface h-full overflow-y-auto border-l border-line shadow-lg">
        <div className="px-5 py-4 border-b border-line flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-ink">
              {lead.organizationName}
            </div>
            <div className="text-xs text-ink-subtle">
              {TARGET_LABEL[lead.targetType]}
              {lead.contactName ? ` · ${lead.contactName}` : ""}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink-subtle text-sm hover:text-ink"
          >
            Close
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <div className="text-xs font-medium text-ink-muted mb-2">Stage</div>
            <div className="flex flex-wrap gap-1.5">
              {COLUMNS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => onMove(c.key)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full border",
                    lead.stage === c.key
                      ? "bg-ink text-white border-ink"
                      : "border-line text-ink-muted hover:bg-neutral-50",
                  )}
                >
                  {c.label}
                </button>
              ))}
              <button
                onClick={() => onMove("lost")}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-full border",
                  lead.stage === "lost"
                    ? "bg-danger text-white border-danger"
                    : "border-line text-ink-muted hover:bg-neutral-50",
                )}
              >
                Lost
              </button>
            </div>
          </div>

          {lead.contactPhone ? (
            <div className="text-sm flex items-center gap-2 text-ink-muted">
              <Phone className="size-4" />
              <a
                href={`tel:${lead.contactPhone}`}
                className="hover:text-ink"
              >
                {lead.contactPhone}
              </a>
            </div>
          ) : null}

          <Card>
            <CardBody>
              <div className="text-xs font-medium text-ink-muted mb-3">
                Qualification — the 4 questions
              </div>
              <div className="space-y-3">
                <Field label="Crowd size">
                  <Input
                    type="number"
                    value={q.crowdSize ?? ""}
                    placeholder="Expected attendees (300+ to qualify)"
                    onChange={(e) =>
                      setQual(
                        "crowdSize",
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                </Field>
                <Field label="Confirmed event date">
                  <Input
                    type="date"
                    value={q.eventDate ? q.eventDate.slice(0, 10) : ""}
                    onChange={(e) =>
                      setQual(
                        "eventDate",
                        e.target.value
                          ? new Date(e.target.value).toISOString()
                          : undefined,
                      )
                    }
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <CheckRow
                    label="Shaded / covered area"
                    checked={!!q.hasShade}
                    onChange={(v) => setQual("hasShade", v)}
                  />
                  <CheckRow
                    label="Power available"
                    checked={!!q.hasPower}
                    onChange={(v) => setQual("hasPower", v)}
                  />
                </div>
              </div>

              <div
                className={cn(
                  "mt-4 rounded-md px-3 py-2 text-xs font-medium",
                  passes
                    ? "bg-emerald-50 text-positive border border-emerald-200"
                    : "bg-amber-50 text-warn border border-amber-200",
                )}
              >
                {passes
                  ? "✓ Lead qualifies. Move to Qualified and proceed to Phase 2."
                  : "Missing one or more minimums. Capture remaining answers before committing."}
              </div>
            </CardBody>
          </Card>

          <Field label="Notes">
            <Textarea
              value={lead.notes}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              rows={4}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-left",
        checked
          ? "bg-emerald-50 border-emerald-200 text-positive"
          : "bg-surface border-line text-ink-muted hover:border-neutral-300",
      )}
    >
      <span
        className={cn(
          "size-4 rounded border flex items-center justify-center text-[10px]",
          checked
            ? "bg-positive border-positive text-white"
            : "border-line bg-white",
        )}
      >
        {checked ? "✓" : ""}
      </span>
      {label}
    </button>
  );
}
