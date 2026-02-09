/**
 * Badge Component
 * 
 * Status badges with semantic colors
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-forensic-100 text-forensic-800',
        success: 'bg-equity-100 text-equity-800',
        warning: 'bg-warning-100 text-warning-800',
        danger: 'bg-critical-100 text-critical-800',
        info: 'bg-primary-100 text-primary-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

/**
 * Get badge variant based on status
 */
export function getStatusBadgeVariant(status: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  const statusMap: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    // Property statuses
    pending: 'warning',
    inspecting: 'info',
    documented: 'primary',
    claim_submitted: 'primary',
    in_negotiation: 'warning',
    approved: 'success',
    in_repair: 'info',
    completed: 'success',
    closed: 'default',
    
    // Task statuses
    in_progress: 'info',
    blocked: 'danger',
    cancelled: 'default',
    
    // Severity
    minor: 'success',
    moderate: 'warning',
    major: 'warning',
    critical: 'danger',
  };
  
  return statusMap[status] || 'default';
}
