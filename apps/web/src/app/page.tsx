export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-zinc-100">
              Equity Builders
            </div>
            <div className="text-xs text-zinc-400">
              Forensic Property Intelligence Platform
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <a
            href="/login"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-zinc-100 ring-1 ring-white/10 hover:bg-white/15"
          >
            Sign in
          </a>
          <a
            href="/app"
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-300"
          >
            Go to Intelligence Center
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <section className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Evidence-first. Explainable. Audit-ready.
            </div>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              Turn storm-damaged commercial property into{" "}
              <span className="text-emerald-300">verified equity gains</span>.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-zinc-300">
              Equity Builders operationalizes forensic inspections, insurance
              intelligence, and verified contractor execution. Every claim
              decision is traceable to evidence, documented actions, and
              explainable guidance.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-300"
              >
                Sign in (Demo Mode enabled by default)
              </a>
              <a
                href="/docs"
                className="inline-flex items-center justify-center rounded-xl bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 ring-1 ring-white/10 hover:bg-white/10"
              >
                Read the platform principles
              </a>
            </div>

            <dl className="mt-10 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <dt className="text-xs font-semibold text-zinc-200">
                  Forensic workflow
                </dt>
                <dd className="mt-2 text-sm text-zinc-300">
                  Evidence timeline, chain-of-custody mindset, and structured
                  inspection capture.
                </dd>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <dt className="text-xs font-semibold text-zinc-200">
                  Insurance intelligence
                </dt>
                <dd className="mt-2 text-sm text-zinc-300">
                  Claim lifecycle tracking, scope delta detection, and carrier
                  interaction logs.
                </dd>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <dt className="text-xs font-semibold text-zinc-200">
                  ATOS guidance
                </dt>
                <dd className="mt-2 text-sm text-zinc-300">
                  Proactive risk flags and next actions—only from your data,
                  never invented facts.
                </dd>
              </div>
            </dl>
          </section>

          <aside className="md:col-span-5">
            <div className="rounded-3xl bg-gradient-to-b from-white/10 to-white/5 p-6 ring-1 ring-white/10">
              <div className="text-sm font-semibold text-zinc-100">
                What makes this platform different
              </div>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li className="rounded-xl bg-black/20 p-3 ring-1 ring-white/10">
                  <span className="font-semibold text-zinc-100">
                    Explainability
                  </span>{" "}
                  is mandatory: every recommendation includes “facts used” and
                  “gaps detected”.
                </li>
                <li className="rounded-xl bg-black/20 p-3 ring-1 ring-white/10">
                  <span className="font-semibold text-zinc-100">
                    Verification
                  </span>{" "}
                  over vibes: progress and compliance are measured, not assumed.
                </li>
                <li className="rounded-xl bg-black/20 p-3 ring-1 ring-white/10">
                  <span className="font-semibold text-zinc-100">
                    Authority
                  </span>{" "}
                  through documentation: timelines, logs, and defensible reports.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
