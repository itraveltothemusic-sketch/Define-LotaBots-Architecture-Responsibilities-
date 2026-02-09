import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto max-w-2xl px-6 py-20">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
          Not found
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          This page doesn’t exist.
        </h1>
        <p className="mt-4 text-sm leading-6 text-zinc-300">
          If you expected to see a module here, it may not be wired yet.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/"
            className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 ring-1 ring-white/10 hover:bg-white/10"
          >
            Go to landing
          </Link>
          <Link
            href="/app"
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-300"
          >
            Go to app
          </Link>
        </div>
      </main>
    </div>
  );
}

