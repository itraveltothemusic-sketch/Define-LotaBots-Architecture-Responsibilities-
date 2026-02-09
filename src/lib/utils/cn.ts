import { clsx, type ClassValue } from "clsx";

/**
 * Utility for conditionally joining class names.
 * Uses clsx for conditional classes.
 *
 * Usage: cn("base-class", condition && "conditional-class", "another-class")
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
