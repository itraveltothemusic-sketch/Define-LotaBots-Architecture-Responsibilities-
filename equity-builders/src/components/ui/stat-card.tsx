/**
 * StatCard — displays a key metric with icon and trend indicator.
 * Used in the Intelligence Center dashboard for at-a-glance metrics.
 */

import { cn } from "@/lib/utils";
import { Card } from "./card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  description?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendValue,
  description,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-navy-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          {(trend || description) && (
            <div className="flex items-center gap-1.5 mt-2">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium",
                    trend === "up" && "text-forensic-400",
                    trend === "down" && "text-danger-400",
                    trend === "neutral" && "text-navy-400",
                  )}
                >
                  {trend === "up" && <TrendingUp className="w-3 h-3" />}
                  {trend === "down" && <TrendingDown className="w-3 h-3" />}
                  {trend === "neutral" && <Minus className="w-3 h-3" />}
                  {trendValue}
                </span>
              )}
              {description && (
                <span className="text-xs text-navy-400">{description}</span>
              )}
            </div>
          )}
        </div>
        <div className="p-2.5 bg-brand-500/10 rounded-lg border border-brand-500/20 text-brand-400">
          {icon}
        </div>
      </div>
    </Card>
  );
}
