"use client";

import { useMemo, useState } from "react";

import type { ModuleKey } from "@/types/domain";

interface AssistantPanelProps {
  module: ModuleKey;
  title?: string;
  propertyId?: string;
}

interface AtosResponse {
  summary: string;
  whyThisMatters: string;
  nextBestAction: string;
  confidenceScore: number;
}

const starterPrompts: Record<ModuleKey, string[]> = {
  intelligence: [
    "What is the highest risk this week?",
    "Where is evidence confidence dropping?",
    "What should leadership escalate next?",
  ],
  "forensic-property": [
    "Which damage class should be prioritized?",
    "What evidence gap weakens causation?",
    "What inspection follow-up is urgent?",
  ],
  "insurance-intelligence": [
    "Where is carrier under-scoping most severe?",
    "What claim milestone is at risk?",
    "How do we defend our submitted scope?",
  ],
  "contractor-execution": [
    "What is blocking execution velocity?",
    "Which contractor compliance issue is critical?",
    "Where should QA verification focus next?",
  ],
  "equity-outcome": [
    "What is suppressing payout capture?",
    "How should we frame equity gains for investors?",
    "Which property has the largest upside gap?",
  ],
};

export function AssistantPanel({
  module,
  propertyId,
  title = "ATOS Intelligence Assistant",
}: AssistantPanelProps) {
  const prompts = useMemo(() => starterPrompts[module], [module]);
  const [prompt, setPrompt] = useState(prompts[0] ?? "");
  const [response, setResponse] = useState<AtosResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runPrompt = async (value: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetch("/api/atos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module,
          propertyId,
          prompt: value,
        }),
      });

      if (!result.ok) {
        throw new Error("ATOS request failed.");
      }

      const payload = (await result.json()) as AtosResponse;
      setResponse(payload);
    } catch {
      setError("ATOS could not complete this request. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs text-slate-600">
            Forensic guide and strategist reasoning only from your platform data.
          </p>
        </div>
        <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] font-semibold uppercase text-indigo-700">
          explainable
        </span>
      </header>

      <div className="mt-4 space-y-2">
        {prompts.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setPrompt(suggestion);
              void runPrompt(suggestion);
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-xs text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form
        className="mt-4"
        onSubmit={(event) => {
          event.preventDefault();
          void runPrompt(prompt);
        }}
      >
        <label className="text-xs font-medium text-slate-600" htmlFor={`atos-${module}`}>
          Ask ATOS for a guided recommendation
        </label>
        <textarea
          id={`atos-${module}`}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-300 focus:ring"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isLoading ? "Reasoning..." : "Generate strategic guidance"}
        </button>
      </form>

      {error ? (
        <p className="mt-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      {response ? (
        <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-medium text-slate-900">{response.summary}</p>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Why this matters
            </p>
            <p className="mt-1">{response.whyThisMatters}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Next best action
            </p>
            <p className="mt-1">{response.nextBestAction}</p>
          </div>
          <p className="text-xs text-slate-500">
            Confidence: {(response.confidenceScore * 100).toFixed(0)}%
          </p>
        </div>
      ) : null}
    </aside>
  );
}
