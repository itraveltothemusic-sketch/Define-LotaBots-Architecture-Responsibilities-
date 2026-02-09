import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind-safe className merge.
 *
 * WHY: A forensic platform needs UI consistency and predictable styling.
 * `twMerge` prevents conflicting utilities from silently producing odd layouts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

