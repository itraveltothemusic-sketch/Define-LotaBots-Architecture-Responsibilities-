/**
 * Utility functions used across the Equity Builders platform.
 * 
 * Design decision: We use `clsx` for conditional class joining because
 * it's lightweight, well-tested, and works seamlessly with Tailwind.
 */

import { clsx, type ClassValue } from "clsx";

/** Merge Tailwind classes with conflict resolution via clsx */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format currency with USD conventions */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format large numbers with abbreviations (e.g., 1.2M, 450K) */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return formatCurrency(value);
}

/** Format a percentage with one decimal place */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** Get a human-readable status label from a snake_case status */
export function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Get the appropriate color class for a property status */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    intake: "bg-navy-600 text-navy-100",
    inspection: "bg-brand-600 text-white",
    assessment: "bg-brand-500 text-white",
    claim_filed: "bg-alert-500 text-white",
    negotiation: "bg-alert-600 text-white",
    approved: "bg-forensic-500 text-white",
    in_repair: "bg-brand-700 text-white",
    completed: "bg-forensic-600 text-white",
    equity_verified: "bg-forensic-700 text-white",
    // Insurance claim statuses
    draft: "bg-navy-600 text-navy-100",
    submitted: "bg-brand-500 text-white",
    under_review: "bg-alert-500 text-white",
    additional_info_requested: "bg-alert-600 text-white",
    partially_approved: "bg-forensic-400 text-white",
    denied: "bg-danger-500 text-white",
    appealed: "bg-alert-700 text-white",
    settled: "bg-forensic-600 text-white",
    // Contractor statuses
    pending: "bg-navy-600 text-navy-100",
    active: "bg-forensic-500 text-white",
    suspended: "bg-danger-500 text-white",
    assigned: "bg-brand-500 text-white",
    in_progress: "bg-brand-600 text-white",
    inspection_needed: "bg-alert-500 text-white",
    disputed: "bg-danger-600 text-white",
  };

  return colors[status] || "bg-navy-500 text-white";
}

/** Get severity color for ATOS insights */
export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    info: "text-brand-400 bg-brand-400/10 border-brand-400/20",
    low: "text-forensic-400 bg-forensic-400/10 border-forensic-400/20",
    medium: "text-alert-400 bg-alert-400/10 border-alert-400/20",
    high: "text-alert-500 bg-alert-500/10 border-alert-500/20",
    critical: "text-danger-400 bg-danger-400/10 border-danger-400/20",
  };

  return colors[severity] || colors.info;
}

/** Generate a unique ID (for client-side use, not for DB primary keys) */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/** Calculate days between two dates */
export function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Format a date relative to now (e.g., "3 days ago") */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
