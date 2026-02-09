/**
 * Badge Component
 * 
 * Used for status indicators, labels, and tags throughout the platform.
 * Status colors are semantically meaningful — green for positive states,
 * amber for warnings, red for critical issues.
 */
import React from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-brand-500/20 text-brand-300 border-brand-500/30",
    success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    danger: "bg-red-500/20 text-red-300 border-red-500/30",
    info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    neutral: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  };

  const dotColors = {
    default: "bg-brand-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    danger: "bg-red-400",
    info: "bg-blue-400",
    neutral: "bg-slate-400",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}

/**
 * Map property/claim status to badge variant for consistent visual language.
 */
export function getStatusVariant(
  status: string
): BadgeProps["variant"] {
  const statusMap: Record<string, BadgeProps["variant"]> = {
    // Property statuses
    INTAKE: "neutral",
    INSPECTION: "info",
    CLAIM_FILED: "info",
    UNDER_REVIEW: "warning",
    APPROVED: "success",
    IN_REPAIR: "info",
    COMPLETED: "success",
    EQUITY_VERIFIED: "success",
    // Claim statuses
    DRAFT: "neutral",
    SUBMITTED: "info",
    ACKNOWLEDGED: "info",
    ADDITIONAL_INFO_REQUESTED: "warning",
    PARTIALLY_APPROVED: "warning",
    DENIED: "danger",
    APPEALED: "warning",
    SETTLED: "success",
    // General
    ACTIVE: "success",
    PENDING: "warning",
    SUSPENDED: "danger",
    INACTIVE: "neutral",
    PASSED: "success",
    FAILED: "danger",
  };

  return statusMap[status] || "neutral";
}
