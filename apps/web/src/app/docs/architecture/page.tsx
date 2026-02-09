import { readFile } from "node:fs/promises";
import path from "node:path";

async function loadDoc(): Promise<string> {
  // In production builds, the server runtime has access to the repo files.
  // We deliberately render docs from source to keep them authoritative.
  const docPath = path.join(process.cwd(), "..", "..", "docs", "ARCHITECTURE.md");
  return await readFile(docPath, "utf8");
}

export default async function ArchitectureDocPage() {
  const content = await loadDoc();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto max-w-4xl px-6 py-14">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Architecture (source)
          </h1>
          <a
            href="/docs"
            className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
          >
            Back to docs
          </a>
        </div>

        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Rendered directly from <code className="text-zinc-100">docs/ARCHITECTURE.md</code>.
        </p>

        <pre className="mt-8 overflow-x-auto rounded-2xl bg-black/40 p-6 text-sm leading-6 text-zinc-200 ring-1 ring-white/10">
          {content}
        </pre>
      </main>
    </div>
  );
}

