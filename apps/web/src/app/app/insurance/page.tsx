export default async function InsuranceIntelligencePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
          Insurance Intelligence Module
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
          Claim lifecycle + discrepancy detection
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
          This module will track claims end-to-end: carrier interactions, scope
          comparison, and discrepancy surfacing with evidence citations.
        </p>
      </div>

      <div className="rounded-3xl bg-black/30 p-6 ring-1 ring-white/10">
        <div className="text-sm font-semibold text-zinc-100">
          Coming next
        </div>
        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
          <li className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            Claim file: parties, policy identifiers, key dates, and required documents.
          </li>
          <li className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            Carrier interaction log: calls/emails/letters with attachments and attribution.
          </li>
          <li className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            Scope delta engine: line-item comparison with explainable discrepancy flags.
          </li>
        </ul>
      </div>
    </div>
  );
}

