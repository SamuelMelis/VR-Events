import { cn } from "@/lib/utils";

export function Stat({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-surface p-4 shadow-card",
        className,
      )}
    >
      <div className="text-xs font-medium text-ink-subtle">{label}</div>
      <div className="text-xl sm:text-2xl font-bold tracking-tight text-ink mt-1">
        {value}
      </div>
      {hint ? <div className="text-[11px] text-ink-subtle mt-1.5">{hint}</div> : null}
    </div>
  );
}
