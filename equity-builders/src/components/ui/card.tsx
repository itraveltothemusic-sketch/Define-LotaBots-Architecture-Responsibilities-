/**
 * Card component — the primary container pattern in the platform.
 * 
 * Design decision: Cards use a subtle glass-morphism effect with
 * semi-transparent backgrounds and borders. This creates visual depth
 * while maintaining the dark forensic aesthetic.
 */

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        "bg-navy-900/60 border border-navy-700/50 rounded-xl backdrop-blur-sm",
        hover && "hover:border-brand-500/30 hover:bg-navy-800/60 transition-all duration-200 cursor-pointer",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4 border-b border-navy-700/50", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4 border-t border-navy-700/50", className)}>
      {children}
    </div>
  );
}
