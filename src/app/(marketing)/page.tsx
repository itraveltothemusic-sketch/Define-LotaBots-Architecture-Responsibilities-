import Link from "next/link";
import { Check, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main>
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16">
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <Shield className="h-4 w-4" />
              Evidence-first. Audit-ready. Explainable.
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Forensic property intelligence that converts storm damage into{" "}
              <span className="text-zinc-600 dark:text-zinc-300">
                verified equity gains.
              </span>
            </h1>
            <p className="text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Equity Builders combines forensic inspections, insurance intelligence,
              and guided execution into a single trusted system of record—designed
              for owners, contractors, adjusters, and internal teams.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/sign-up">
                <Button size="lg">Request access</Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="secondary">
                  Sign in
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 pt-2 text-sm text-zinc-700 dark:text-zinc-300">
              {[
                "Forensic evidence timeline with integrity signals",
                "Claim lifecycle truth + scope discrepancy detection",
                "ATOS guidance that explains “why this matters”",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  ATOS Intelligence Panel
                </CardTitle>
                <CardDescription>
                  Proactive, data-bound guidance—never fabricated facts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    Next best actions
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>
                      Create an inspection record and attach time-stamped photos.
                    </li>
                    <li>
                      Document roof and envelope damage categories for scope
                      defensibility.
                    </li>
                    <li>
                      Start a claim record and log carrier interactions in one
                      timeline.
                    </li>
                  </ul>
                </div>
                <div className="rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    Why this matters
                  </div>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Insurance outcomes depend on evidence quality, provenance, and
                    narrative coherence. The platform structures proof so decision
                    makers can’t ignore it.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Verification",
                  body: "Evidence items capture timestamps, provenance, and integrity signals to support defensibility.",
                },
                {
                  title: "Explainability",
                  body: "Every recommendation has an explicit rationale tied to your data and claim strategy.",
                },
              ].map((x) => (
                <Card key={x.title}>
                  <CardHeader>
                    <CardTitle>{x.title}</CardTitle>
                    <CardDescription>{x.body}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Platform</h2>
          <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-400">
            A unified system of record for storm-damaged commercial assets:
            inspections, evidence, claims, execution, and equity outcomes—designed
            for precision and authority.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Intelligence Center",
                body: "Central dashboard, property overview, evidence timeline, and ATOS guidance.",
              },
              {
                title: "Forensic Property",
                body: "Profiles, inspections, ingestion pipeline, and damage classification scaffolding.",
              },
              {
                title: "Insurance Intelligence",
                body: "Claim lifecycle, carrier interactions, and scope comparison groundwork.",
              },
            ].map((m) => (
              <Card key={m.title}>
                <CardHeader>
                  <CardTitle>{m.title}</CardTitle>
                  <CardDescription>{m.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Trust</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Audit trail",
                body: "Key events are recorded for defensibility and operational integrity.",
              },
              {
                title: "Least surprise",
                body: "RBAC is explicit. Access decisions are centralized and reviewable.",
              },
              {
                title: "Data-bound guidance",
                body: "ATOS does not invent facts. It reasons from the data available in the platform.",
              },
            ].map((x) => (
              <Card key={x.title}>
                <CardHeader>
                  <CardTitle>{x.title}</CardTitle>
                  <CardDescription>{x.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Modules</h2>
          <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-400">
            The platform is built in ordered modules. Each module is documented,
            integrated, and verified to support enterprise operations.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              "Intelligence Center",
              "Forensic Property",
              "Insurance Intelligence",
              "Contractor Execution",
              "Equity Outcome",
            ].map((m) => (
              <Card key={m}>
                <CardHeader>
                  <CardTitle>{m}</CardTitle>
                  <CardDescription>
                    Enterprise-ready scaffolding with clear boundaries and
                    auditability.
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

