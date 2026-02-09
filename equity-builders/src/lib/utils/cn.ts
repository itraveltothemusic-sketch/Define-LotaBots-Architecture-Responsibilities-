/**
 * Utility for conditionally joining class names.
 * Wraps clsx for Tailwind CSS class merging.
 */
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
