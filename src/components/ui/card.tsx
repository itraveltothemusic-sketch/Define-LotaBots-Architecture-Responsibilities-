import { cn } from "@/lib/utils";

/**
 * Card — Base container component.
 *
 * Provides consistent elevation, border radius, and spacing
 * across all dashboard content areas.
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Optional section header */
  title?: string;
  /** Optional description under the title */
  description?: string;
  /** Optional action in the header */
  action?: React.ReactNode;
  /** Remove padding for full-bleed content */
  noPadding?: boolean;
}

export function Card({
  children,
  className,
  title,
  description,
  action,
  noPadding = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-100 shadow-sm",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-start justify-between px-6 pt-6 pb-0">
          <div>
            {title && (
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn(noPadding ? "" : "p-6", title && !noPadding && "pt-4")}>
        {children}
      </div>
    </div>
  );
}
