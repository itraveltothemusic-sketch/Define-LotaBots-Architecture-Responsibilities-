import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10">
        {children}
      </div>
    </div>
  );
}

