/**
 * ProgressBar — Visual progress indicator.
 * 
 * Used in contractor assignments and claim tracking to show
 * completion percentage. Color automatically adjusts based
 * on progress level for intuitive visual feedback.
 */

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ value, max = 100, size = 'sm', showLabel = true, className }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const barColor = percent >= 80
    ? 'bg-emerald-500'
    : percent >= 50
    ? 'bg-blue-500'
    : percent >= 25
    ? 'bg-amber-500'
    : 'bg-slate-400';

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'md' ? 'h-2.5' : 'h-4';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className={cn('flex-1 bg-slate-100 rounded-full overflow-hidden', heightClass)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-600 tabular-nums w-10 text-right">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}
