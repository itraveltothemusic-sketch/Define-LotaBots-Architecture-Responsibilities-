"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function UserMenu({
  name,
  email,
  role,
}: {
  name: string | null | undefined;
  email: string | null | undefined;
  role: string | null | undefined;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900/40"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-xs font-semibold text-white">
          {(name || email || "U").slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden max-w-[180px] truncate md:inline">
          {name || email || "User"}
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <div className="space-y-1 px-4 py-3">
            <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {name || "—"}
            </div>
            <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">
              {email || "—"}
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Role:{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {role || "—"}
              </span>
            </div>
          </div>
          <div className="border-t border-zinc-200 p-2 dark:border-zinc-800">
            <Button
              variant="secondary"
              className="w-full"
              onClick={async () => {
                setOpen(false);
                await signOut({ callbackUrl: "/" });
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

