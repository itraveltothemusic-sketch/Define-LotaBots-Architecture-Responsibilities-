import Link from "next/link";
import { listPropertyCases } from "@/server/demo/property-cases";

export default async function IntelligenceCenterIndexPage() {
  const cases = listPropertyCases();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
          Intelligence Center
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
          Forensic command dashboard
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
          This module is the heart of the platform: property overview,
          evidence timeline, and ATOS guidance—designed to convert storm damage
          into a defensible claim and a verified equity outcome.
        </p>
      </div>

      <div className="rounded-3xl bg-black/30 p-6 ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
              Properties in motion
            </div>
            <div className="mt-2 text-sm text-zinc-300">
              Select a property to open its intelligence file.
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 ring-1 ring-white/10">
            Demo data
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {cases.map((c) => (
            <Link
              key={c.id}
              href={`/app/intelligence/${c.id}`}
              className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 hover:bg-white/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-100">
                    {c.name}
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">{c.address}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/20">
                    {c.event.peril}
                  </span>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-zinc-200 ring-1 ring-white/10">
                    {c.status}
                  </span>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-zinc-200 ring-1 ring-white/10">
                    {c.evidence.length} evidence
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

