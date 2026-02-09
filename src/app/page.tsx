import Link from "next/link";
import { ArrowRight, FileCheck, Radar, Shield, Waypoints } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth/session";

const valuePillars = [
  {
    title: "Forensic Accuracy",
    detail: "Structured inspections, chain-of-custody evidence, and defensible classification workflow.",
    icon: FileCheck,
  },
  {
    title: "Insurance Intelligence",
    detail: "Claim strategy with discrepancy detection and explainable payout optimization.",
    icon: Shield,
  },
  {
    title: "Execution Control",
    detail: "Contractor verification, progress compliance, and outcome assurance at every milestone.",
    icon: Waypoints,
  },
];

export default async function LandingPage() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">Equity Builders</p>
            <h1 className="mt-2 text-2xl font-semibold">Forensic Property Intelligence Platform</h1>
          </div>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            {session ? "Enter Dashboard" : "Secure Sign In"}
            <ArrowRight className="size-4" />
          </Link>
        </header>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Badge label="Enterprise-grade forensic operations" variant="info" />
            <h2 className="max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">
              Transform storm-damaged commercial assets into{" "}
              <span className="text-sky-300">verified equity gains</span>.
            </h2>
            <p className="max-w-3xl text-lg text-slate-300">
              Equity Builders unifies forensic inspections, insurance intelligence, and guided execution in one
              explainable operating system powered by ATOS.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-2xl shadow-sky-900/20">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
              <Radar className="size-4" />
              ATOS Central Intelligence
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              ATOS is embedded across every module to explain why each step matters, surface risks before they
              compound, and guide next actions based only on verified record data.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>• Evidence-grounded recommendations</li>
              <li>• Role-aware operational guidance</li>
              <li>• Confidence labels for every advisory output</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 md:grid-cols-3">
        {valuePillars.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700"
          >
            <pillar.icon className="size-5 text-sky-300" />
            <h3 className="mt-3 text-lg font-semibold">{pillar.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{pillar.detail}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
