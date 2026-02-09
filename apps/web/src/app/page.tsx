import Link from "next/link";
import { ArrowRight, ShieldCheck, FileCheck2, Radar, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Equity Builders
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Forensic Property Intelligence
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <ButtonLink variant="ghost" href="/sign-in">
            Sign in
          </ButtonLink>
          <ButtonLink href="/dashboard">
            Open dashboard <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="grid gap-10 py-14 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Evidence-first workflows • Explainable guidance • Enterprise-ready
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
              Turn storm damage into verified equity outcomes.
            </h1>
            <p className="max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Equity Builders organizes inspections, documentation, insurance intelligence, and execution
              into a defensible case file — with ATOS guiding every decision using only verified data.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/dashboard">
                Enter Intelligence Center <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink variant="secondary" href="/sign-in">
                Sign in
              </ButtonLink>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Built for Owners, Contractors, Adjusters, and Internal operators. Every action is documented
              and attributable.
            </p>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck2 className="size-4" aria-hidden="true" />
                  Evidence & Timeline
                </CardTitle>
                <CardDescription>
                  Photos, documents, notes, and provenance — structured like a forensic case file.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                Every artifact is timestamped, attributable, and trackable through verification.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radar className="size-4" aria-hidden="true" />
                  Insurance Intelligence
                </CardTitle>
                <CardDescription>
                  Track claim lifecycle and scope deltas with explainable discrepancy detection.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                ATOS highlights missing documents, coverage risks, and leverage points — grounded in data.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Trust is a feature</CardTitle>
              <CardDescription>Verification, audit trails, and explainability are not optional.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              The platform is designed to withstand scrutiny from insurers, investors, and legal review.
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Start with the Intelligence Center</CardTitle>
              <CardDescription>
                One place to see property health, evidence completeness, risks, and next actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <div>1) Create / select a property case file.</div>
              <div>2) Ingest evidence; verify provenance.</div>
              <div>3) Track claim scope and carrier interactions.</div>
              <div>4) Execute scope with compliance checkpoints.</div>
              <div>5) Generate outcome reports: valuation deltas and equity narrative.</div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
