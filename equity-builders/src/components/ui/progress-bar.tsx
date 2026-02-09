/**
 * ProgressBar — visual progress indicator for repair tracking,
 * claim lifecycle, and equity outcome visualization.
 */

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "brand" | "forensic" | "alert" | "danger";
  className?: string;
}

const colorMap: Record<string, string> = {
  brand: "bg-brand-500",
  forensic: "bg-forensic-500",
  alert: "bg-alert-500",
  danger: "bg-danger-500",
};

const sizeMap: Record<string, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  label,
  showPercentage = true,
  size = "md",
  color = "brand",
  className,
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm text-navy-300">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-navy-200">{clampedValue}%</span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-navy-700/50 rounded-full overflow-hidden", sizeMap[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorMap[color],
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
