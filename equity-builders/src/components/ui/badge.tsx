/**
 * Badge component for status indicators.
 * 
 * Used throughout the platform to display property statuses,
 * claim statuses, severity levels, and categorizations.
 * The color system is tied to our forensic design language.
 */

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-brand-500/15 text-brand-300 border-brand-500/25",
  success: "bg-forensic-500/15 text-forensic-300 border-forensic-500/25",
  warning: "bg-alert-500/15 text-alert-300 border-alert-500/25",
  danger: "bg-danger-500/15 text-danger-300 border-danger-500/25",
  info: "bg-brand-400/15 text-brand-200 border-brand-400/25",
  neutral: "bg-navy-500/30 text-navy-200 border-navy-500/30",
};

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border rounded-full",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
