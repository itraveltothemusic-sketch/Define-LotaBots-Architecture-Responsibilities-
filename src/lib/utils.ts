/**
 * Utility functions used across the platform.
 * Each utility is pure, well-typed, and tested-ready.
 */

import { clsx, type ClassValue } from 'clsx';

/**
 * Merge Tailwind CSS classes with proper precedence.
 * Uses clsx for conditional class merging.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format a number as USD currency.
 * Used extensively in equity calculations and claim amounts.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as a compact representation (e.g., $1.2M).
 * Used in dashboard metrics where space is limited.
 */
export function formatCurrencyCompact(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Format a percentage value.
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a date string into a human-readable format.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Format a date string into a relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

/**
 * Generate a deterministic color from a string.
 * Used for avatar backgrounds and tag colors.
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
    'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-orange-500',
  ];
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get initials from a name string.
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Calculate the severity color based on a 1-10 score.
 * Used in inspections and risk assessments.
 */
export function severityColor(score: number): string {
  if (score <= 3) return 'text-emerald-600';
  if (score <= 5) return 'text-amber-600';
  if (score <= 7) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Calculate the severity background based on a 1-10 score.
 */
export function severityBg(score: number): string {
  if (score <= 3) return 'bg-emerald-100';
  if (score <= 5) return 'bg-amber-100';
  if (score <= 7) return 'bg-orange-100';
  return 'bg-red-100';
}
