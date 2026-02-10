import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/80",
        className,
      )}
    >
      {children}
    </section>
  );
}

interface CardTitleProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
}

export function CardTitle({ title, subtitle, trailing }: CardTitleProps) {
  return (
    <header className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        ) : null}
      </div>
      {trailing}
    </header>
  );
}
