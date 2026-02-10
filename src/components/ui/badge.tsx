import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
        danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
        info: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  label: string;
}

export function Badge({ className, variant, label }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{label}</span>;
}
