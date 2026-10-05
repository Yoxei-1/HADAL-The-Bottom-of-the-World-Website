import { cn } from "../utils/cn";

/** Chapter marker: "ZONE III — MIDNIGHT ···· 1,000–4,000 M" over a hairline. */
export function ZoneTag({
  numeral,
  name,
  range,
  className,
}: {
  numeral: string;
  name: string;
  range: string;
  className?: string;
}) {
  return (
    <div className={cn("font-mono text-[9px] tracking-[0.3em]", className)}>
      <div className="flex items-baseline justify-between gap-6 pb-3">
        <span className="opacity-80">
          ZONE {numeral} — {name}
        </span>
        <span className="tnum opacity-50">{range}</span>
      </div>
      <div
        aria-hidden
        className="h-px w-full"
        style={{ background: "currentColor", opacity: 0.18 }}
      />
    </div>
  );
}
