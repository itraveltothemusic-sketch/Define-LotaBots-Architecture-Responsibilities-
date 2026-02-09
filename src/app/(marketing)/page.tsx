import Link from "next/link";

const pillars = [
  {
    title: "Forensic certainty",
    description:
      "Evidence-first inspections with verification controls that support insurer-grade decisioning.",
  },
  {
    title: "Insurance intelligence",
    description:
      "Lifecycle visibility, discrepancy detection, and defensible claim escalation workflows.",
  },
  {
    title: "Equity execution",
    description:
      "Contractor governance and milestone verification that translate recovery into measurable value.",
  },
];

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Equity Builders
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          Forensic Property Intelligence for Verified Equity Recovery
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Equity Builders transforms storm-damaged commercial properties into
          documented, defensible value gains. The platform unifies forensic
          evidence, claim intelligence, contractor performance, and equity
          outcomes in one command surface.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/login"
            className="rounded-md bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Enter platform
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            View command surface
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 md:grid-cols-3">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <h2 className="text-lg font-semibold text-white">{pillar.title}</h2>
            <p className="mt-3 text-sm text-slate-300">{pillar.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
