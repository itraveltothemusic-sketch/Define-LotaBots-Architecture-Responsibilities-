export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.24em] text-indigo-300">
          Equity Builders
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          Forensic Property Intelligence that converts storm loss into verified equity.
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          A trust-first operating system for owners, adjusters, and contractors to
          inspect damage, defend claims, orchestrate execution, and prove financial
          outcomes with explainable AI guidance.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/login"
            className="rounded-lg bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Enter command center
          </a>
          <a
            href="/dashboard/intelligence"
            className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View intelligence workspace
          </a>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-12 md:grid-cols-3">
          {[
            {
              title: "Evidence certainty",
              body: "Every artifact carries chain-of-custody context and verification state.",
            },
            {
              title: "Insurance intelligence",
              body: "Claim stage, discrepancy deltas, and carrier response risk are continuously surfaced.",
            },
            {
              title: "Equity accountability",
              body: "Before/after value, recovery efficiency, and narrative reporting stay linked.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-white/10 bg-slate-900 p-5"
            >
              <h2 className="text-base font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-xl font-semibold text-white">Platform modules</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Intelligence Center",
            "Forensic Property",
            "Insurance Intelligence",
            "Contractor Execution",
            "Equity Outcome",
            "ATOS Assistant",
          ].map((module) => (
            <div
              key={module}
              className="rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-200"
            >
              {module}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
