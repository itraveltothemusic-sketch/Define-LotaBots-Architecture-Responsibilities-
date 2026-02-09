"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import type { AtosGuidance, AtosModuleId } from "@/types/domain";

interface AtosQuestionResponse {
  answer: string;
  evidenceRefs: string[];
  confidence: number;
  limitations: string;
}

interface AtosPanelProps {
  module: AtosModuleId;
  summary: string;
  guidance: AtosGuidance[];
}

interface AtosApiPayload {
  summary: string;
  guidance: AtosGuidance[];
  questionResponse: AtosQuestionResponse | null;
}

function priorityToTone(priority: AtosGuidance["priority"]) {
  if (priority === "CRITICAL") return "critical";
  if (priority === "HIGH") return "high";
  if (priority === "MEDIUM") return "medium";
  return "low";
}

export function AtosAssistantPanel({ module, summary, guidance }: AtosPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AtosQuestionResponse | null>(null);
  const [latestSummary, setLatestSummary] = useState(summary);
  const [latestGuidance, setLatestGuidance] = useState(guidance);

  async function onAsk(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const result = await fetch("/api/atos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, question: prompt }),
      });

      if (!result.ok) {
        throw new Error("ATOS request failed.");
      }

      const payload = (await result.json()) as AtosApiPayload;
      setLatestSummary(payload.summary);
      setLatestGuidance(payload.guidance);
      setResponse(payload.questionResponse);
      setPrompt("");
    } catch {
      setError("Unable to retrieve ATOS response. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardTitle
          title="ATOS Guidance"
          subtitle="ATOS reasons only from verified platform records and evidence state."
        />
        <p className="text-sm text-slate-200">{latestSummary}</p>
        <ul className="mt-4 space-y-3">
          {latestGuidance.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">{item.insight}</p>
                <Badge tone={priorityToTone(item.priority)}>{item.priority}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.whyItMatters}</p>
              <p className="mt-2 text-sm text-sky-200">Action: {item.recommendedAction}</p>
              <p className="mt-2 text-xs text-slate-500">
                Evidence refs: {item.evidenceRefs.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle
          title="Ask ATOS"
          subtitle="Forensic strategist mode. Ask for risks, next actions, or explanation."
        />
        <form onSubmit={onAsk} className="space-y-3">
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Example: What is the highest risk in this module and why does it matter?"
            className="h-24 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 outline-none ring-sky-500/30 transition focus:ring-2"
            required
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Analyzing..." : "Run ATOS analysis"}
          </button>
        </form>

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

        {response ? (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-sm text-slate-100">{response.answer}</p>
            <p className="mt-2 text-xs text-slate-400">
              Confidence: {(response.confidence * 100).toFixed(0)}%
            </p>
            <p className="mt-1 text-xs text-slate-500">Limitations: {response.limitations}</p>
            <p className="mt-1 text-xs text-slate-500">
              Evidence refs: {response.evidenceRefs.join(", ")}
            </p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
