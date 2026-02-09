import type { ReactNode } from "react";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-white text-zinc-950 dark:bg-black dark:text-zinc-50">
      <MarketingHeader />
      {children}
      <footer className="border-t border-zinc-200 py-10 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="font-medium text-zinc-900 dark:text-zinc-100">
            Equity Builders
          </div>
          <div>
            Forensic Property Intelligence Platform — evidence-first, audit-ready,
            explainable.
          </div>
        </div>
      </footer>
    </div>
  );
}

