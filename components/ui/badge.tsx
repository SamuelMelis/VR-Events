import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "accent" | "positive" | "warn" | "danger";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-neutral-100 text-ink-muted",
  accent: "bg-accent-soft text-accent",
  positive: "bg-emerald-50 text-positive",
  warn: "bg-amber-50 text-warn",
  danger: "bg-rose-50 text-danger",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
