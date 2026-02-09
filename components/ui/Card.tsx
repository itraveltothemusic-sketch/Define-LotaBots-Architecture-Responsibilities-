/**
 * Reusable Card Component
 * 
 * Implements forensic design system for consistent card layouts
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'forensic-card',
        hover && 'hover:shadow-forensic transition-all cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div className={cn('forensic-card-header', action && 'flex items-center justify-between', className)}>
      {children}
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function CardBody({ children, className, padding = true }: CardBodyProps) {
  return (
    <div className={cn('forensic-card-body', !padding && 'p-0', className)}>
      {children}
    </div>
  );
}
