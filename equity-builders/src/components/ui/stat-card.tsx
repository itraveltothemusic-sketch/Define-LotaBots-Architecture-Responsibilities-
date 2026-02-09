/**
 * Stat Card Component
 * 
 * Displays a key metric with label, value, and optional trend indicator.
 * Used throughout the dashboard for KPIs like total equity gain,
 * active claims, and property counts.
 */
import React from "react";
import { cn } from "@/lib/utils/cn";
import { Card } from "./card";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card variant="default" padding="md" className={cn("relative overflow-hidden", className)}>
      {/* Subtle gradient accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full -translate-y-8 translate-x-8" />
      
      <div className="flex items-start justify-between relative">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5 mt-1">
              {trend === "up" && (
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              )}
              {trend === "down" && (
                <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                </svg>
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up" && "text-emerald-400",
                  trend === "down" && "text-red-400",
                  trend === "neutral" && "text-slate-400"
                )}
              >
                {change.value > 0 ? "+" : ""}
                {change.value}% {change.label}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
