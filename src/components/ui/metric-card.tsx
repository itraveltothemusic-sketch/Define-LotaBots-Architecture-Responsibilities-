import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * MetricCard — Primary KPI display component.
 *
 * Used on the dashboard and module-level overviews.
 * Every metric displayed must be:
 * 1. Clearly labeled
 * 2. Contextually meaningful (trend indicator)
 * 3. Actionable (what should the user do about this number?)
 */
interface MetricCardProps {
  title: string;
  value: string;
  /** Optional trend compared to previous period */
  trend?: {
    direction: "up" | "down" | "flat";
    value: string;
    /** Is this trend good or bad? "up" trend on errors = bad */
    isPositive: boolean;
  };
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  trend,
  subtitle,
  icon,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "relative p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {title}
        </span>
        {icon && (
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50">
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        {value}
      </div>
      <div className="flex items-center gap-2 mt-2">
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold",
              trend.isPositive ? "text-emerald-600" : "text-red-500"
            )}
          >
            {trend.direction === "up" && <TrendingUp className="w-3 h-3" />}
            {trend.direction === "down" && (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.direction === "flat" && <Minus className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-slate-400">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
