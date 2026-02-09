export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">
          Platform principles & documentation
        </h1>
        <p className="mt-4 text-sm leading-6 text-zinc-300">
          Equity Builders is engineered for forensic credibility. The platform
          treats evidence, provenance, and explainability as first-class product
          requirements—not afterthoughts.
        </p>

        <div className="mt-10 grid gap-4">
          <a
            href="/docs/architecture"
            className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 hover:bg-white/10"
          >
            <div className="text-sm font-semibold text-zinc-100">
              Architecture (high level)
            </div>
            <div className="mt-1 text-sm text-zinc-300">
              Trust model, module boundaries, and how ATOS stays explainable.
            </div>
          </a>
        </div>

        <div className="mt-10">
          <a
            href="/"
            className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
          >
            ← Back to landing
          </a>
        </div>
      </main>
    </div>
  );
}

