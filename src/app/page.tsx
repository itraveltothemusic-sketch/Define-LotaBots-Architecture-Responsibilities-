import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <header className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
            Equity Builders
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Forensic Property Intelligence built to convert storm damage into verified equity gain.
          </h1>
          <p className="max-w-3xl text-lg text-slate-300">
            An enterprise platform for property owners, contractors, adjusters, and internal
            operators to run forensic inspections, carrier strategy, execution control, and equity
            outcome verification from one intelligence surface.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Access Platform
            </Link>
            <Link
              href="/platform/intelligence"
              className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-600"
            >
              Open Intelligence Center
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: "Intelligence Center",
              body: "Unified forensic and strategic command for every recovery decision.",
            },
            {
              title: "Forensic Property Module",
              body: "Inspection records, media ingestion, damage taxonomy, and documentation chain.",
            },
            {
              title: "Insurance Intelligence Module",
              body: "Claim lifecycle command with discrepancy detection across scope negotiations.",
            },
            {
              title: "Contractor Execution Module",
              body: "Onboarding integrity, assignment tracking, and compliance verification at field pace.",
            },
            {
              title: "Equity Outcome Module",
              body: "Before/after value analytics and narrative reporting for investors and executives.",
            },
            {
              title: "ATOS Assistant",
              body: "Embedded forensic strategist that explains why each action matters.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{item.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
