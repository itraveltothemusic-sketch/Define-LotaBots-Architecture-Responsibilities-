import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm shadow-slate-950/50 backdrop-blur",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
    </header>
  );
}
