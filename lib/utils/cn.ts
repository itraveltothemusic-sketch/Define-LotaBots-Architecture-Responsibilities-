/**
 * Class Name Utility
 * 
 * Combines clsx and class-variance-authority for flexible
 * and type-safe class name composition.
 */

import { type ClassValue, clsx } from "clsx";

/**
 * Merge multiple class names with automatic deduplication
 * Handles conditional classes, arrays, and objects
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
