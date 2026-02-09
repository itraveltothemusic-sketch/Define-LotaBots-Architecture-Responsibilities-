"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-sm font-semibold text-white">
            EB
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Equity Builders
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/#platform"
            className={cn(
              "text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
              pathname === "/" && "text-zinc-900 dark:text-zinc-100",
            )}
          >
            Platform
          </Link>
          <Link
            href="/#trust"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Trust
          </Link>
          <Link
            href="/#modules"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Modules
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Sign in
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Request access</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

