import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone =
  | "neutral"
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "success"
  | "warning";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-slate-700 bg-slate-800/80 text-slate-200",
  critical: "border-rose-600/40 bg-rose-950/60 text-rose-200",
  high: "border-orange-600/40 bg-orange-950/50 text-orange-200",
  medium: "border-amber-500/40 bg-amber-950/40 text-amber-200",
  low: "border-blue-500/40 bg-blue-950/40 text-blue-200",
  success: "border-emerald-500/40 bg-emerald-950/40 text-emerald-200",
  warning: "border-yellow-500/40 bg-yellow-950/40 text-yellow-200",
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
