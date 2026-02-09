import { cn } from "@/lib/utils";

/**
 * StatusBadge — Universal status indicator.
 *
 * Used across all modules for consistent status communication.
 * Color coding is unambiguous and follows a single system-wide convention.
 */

type StatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "purple";

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  size?: "sm" | "md";
  pulse?: boolean;
}

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  neutral: "bg-slate-50 text-slate-600 border-slate-200",
  purple: "bg-violet-50 text-violet-700 border-violet-200",
};

const dotStyles: Record<StatusVariant, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  neutral: "bg-slate-400",
  purple: "bg-violet-500",
};

export function StatusBadge({
  label,
  variant = "neutral",
  size = "sm",
  pulse = false,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border rounded-full font-medium",
        variantStyles[variant],
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          dotStyles[variant],
          pulse && "animate-pulse"
        )}
      />
      {label}
    </span>
  );
}

/**
 * Map common status values to badge variants.
 * This ensures consistent color coding across the platform.
 */
export function getPropertyStatusVariant(
  status: string
): { label: string; variant: StatusVariant } {
  const map: Record<string, { label: string; variant: StatusVariant }> = {
    intake: { label: "Intake", variant: "neutral" },
    inspection_scheduled: { label: "Inspection Scheduled", variant: "info" },
    inspection_complete: { label: "Inspection Complete", variant: "info" },
    documentation_review: { label: "Documentation Review", variant: "purple" },
    claim_filed: { label: "Claim Filed", variant: "warning" },
    claim_in_progress: { label: "Claim In Progress", variant: "warning" },
    restoration_active: { label: "Restoration Active", variant: "info" },
    restoration_complete: { label: "Restoration Complete", variant: "success" },
    equity_realized: { label: "Equity Realized", variant: "success" },
  };
  return map[status] || { label: status, variant: "neutral" };
}

export function getClaimStatusVariant(
  status: string
): { label: string; variant: StatusVariant } {
  const map: Record<string, { label: string; variant: StatusVariant }> = {
    draft: { label: "Draft", variant: "neutral" },
    filed: { label: "Filed", variant: "info" },
    acknowledged: { label: "Acknowledged", variant: "info" },
    under_review: { label: "Under Review", variant: "warning" },
    additional_info_requested: { label: "Info Requested", variant: "danger" },
    approved: { label: "Approved", variant: "success" },
    partially_approved: { label: "Partially Approved", variant: "warning" },
    denied: { label: "Denied", variant: "danger" },
    appealed: { label: "Appealed", variant: "purple" },
    settled: { label: "Settled", variant: "success" },
    closed: { label: "Closed", variant: "neutral" },
  };
  return map[status] || { label: status, variant: "neutral" };
}
