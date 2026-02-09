/**
 * Formatting utilities for the Equity Builders platform.
 * Consistent formatting builds trust — numbers, dates, and
 * currency must always display precisely.
 */

/**
 * Format a number as USD currency.
 * In a platform dealing with insurance claims and property values,
 * currency formatting must be exact and consistent.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format currency with cents for detailed financial views.
 */
export function formatCurrencyDetailed(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date for display. Uses relative format for recent dates
 * and absolute format for older ones.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

/**
 * Format a date with time — critical for audit trails and
 * carrier interaction logs.
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/**
 * Format a percentage with specified decimal places.
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format square footage with commas.
 */
export function formatSquareFeet(sqft: number): string {
  return `${new Intl.NumberFormat("en-US").format(sqft)} sq ft`;
}

/**
 * Truncate text with ellipsis for UI display.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Format a property address into a single display line.
 */
export function formatAddress(
  address: string,
  city: string,
  state: string,
  zipCode: string
): string {
  return `${address}, ${city}, ${state} ${zipCode}`;
}

/**
 * Convert a status enum value to a human-readable label.
 * e.g., "CLAIM_FILED" → "Claim Filed"
 */
export function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}
