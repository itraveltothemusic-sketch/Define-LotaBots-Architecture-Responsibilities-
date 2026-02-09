/**
 * StatusBadge — Universal status indicator component.
 * 
 * Used across all modules to display entity statuses with
 * consistent color coding. The visual treatment helps users
 * instantly assess state without reading text.
 */

import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  label: string;
  color: string;
  bgColor: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export function StatusBadge({ label, color, bgColor, size = 'sm', pulse = false }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        color,
        bgColor,
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      )}
    >
      {pulse && (
        <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse', color.replace('text-', 'bg-'))} />
      )}
      {label}
    </span>
  );
}
