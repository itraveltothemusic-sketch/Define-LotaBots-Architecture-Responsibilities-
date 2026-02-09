import Link from "next/link";
import { listPropertyCases } from "@/server/demo/property-cases";

export default async function PropertiesPage() {
  const cases = listPropertyCases();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
          Forensic Property Module
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
          Property profiles
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
          This area will own structured property profiles, inspection records,
          ingestion pipelines (photo/video/docs), and damage classification.
          For now, it links to the Intelligence Center’s demo cases.
        </p>
      </div>

      <div className="grid gap-3">
        {cases.map((c) => (
          <Link
            key={c.id}
            href={`/app/intelligence/${c.id}`}
            className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10 hover:bg-white/5"
          >
            <div className="text-sm font-semibold text-zinc-100">{c.name}</div>
            <div className="mt-1 text-xs text-zinc-400">{c.address}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

