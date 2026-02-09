import Link from "next/link";

export default function NotAuthorizedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-6 dark:bg-slate-950">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Access constrained</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Module not available</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Your current role does not have access to this module. If this is unexpected, contact platform
          administration.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          Return to Intelligence Center
        </Link>
      </div>
    </main>
  );
}
