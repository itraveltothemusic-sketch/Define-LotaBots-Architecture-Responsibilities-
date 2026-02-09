import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '$0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

/**
 * Format date with options
 */
export function formatDate(date: Date | string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    ...options,
  }).format(dateObj);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(dateObj);
}

/**
 * Calculate time ago from date
 */
export function timeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);
  
  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };
  
  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `${interval} ${name}${interval === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'just now';
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Generate initials from name
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
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a random ID (for client-side temp IDs)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Safely parse JSON with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Get status color based on status type
 */
export function getStatusColor(status: string): string {
  const statusColors: { [key: string]: string } = {
    // Property statuses
    pending: 'bg-yellow-100 text-yellow-800',
    inspecting: 'bg-blue-100 text-blue-800',
    documented: 'bg-indigo-100 text-indigo-800',
    claim_submitted: 'bg-purple-100 text-purple-800',
    in_negotiation: 'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    in_repair: 'bg-cyan-100 text-cyan-800',
    completed: 'bg-emerald-100 text-emerald-800',
    closed: 'bg-gray-100 text-gray-800',
    
    // Task statuses
    in_progress: 'bg-blue-100 text-blue-800',
    blocked: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    
    // Severity
    minor: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    major: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}
