"use client";

import { useActionState, useMemo } from "react";
import type { AtosGuidance } from "@/server/atos/engine";
import { askAtosAction, type AskAtosState } from "@/app/app/intelligence/actions";

function Section(props: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
        {props.title}
      </div>
      <div className="mt-3 text-sm text-zinc-200">{props.children}</div>
    </div>
  );
}

function List(props: { items: string[]; empty: string }) {
  if (props.items.length === 0) {
    return <div className="text-sm text-zinc-400">{props.empty}</div>;
  }
  return (
    <ul className="space-y-2">
      {props.items.map((i, idx) => (
        <li key={`${idx}-${i}`} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
          {i}
        </li>
      ))}
    </ul>
  );
}

function NextActions(props: { actions: AtosGuidance["nextBestActions"] }) {
  if (props.actions.length === 0) {
    return <div className="text-sm text-zinc-400">No actions generated from current facts.</div>;
  }
  return (
    <ol className="space-y-2">
      {props.actions.map((a, idx) => (
        <li key={`${idx}-${a.action}`} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-zinc-100">
            {idx + 1}. {a.action}
          </div>
          <div className="mt-1 text-xs leading-5 text-zinc-300">{a.rationale}</div>
        </li>
      ))}
    </ol>
  );
}

export function AtosPanel(props: {
  propertyId: string;
  initialGuidance: AtosGuidance;
}) {
  const initial: AskAtosState = useMemo(
    () => ({ status: "ok", guidance: props.initialGuidance }),
    [props.initialGuidance],
  );
  const [state, action, pending] = useActionState(askAtosAction, initial);

  const guidance =
    state.status === "ok" ? state.guidance : props.initialGuidance;

  return (
    <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
            ATOS — Central Intelligence
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-50">
            Forensic guidance panel
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            ATOS provides proactive guidance with explicit limitations. It does
            not invent facts.
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/20">
          Explainable · Evidence-first
        </div>
      </div>

      {state.status === "error" ? (
        <div className="mt-6 rounded-2xl bg-red-500/10 p-4 text-sm text-red-200 ring-1 ring-red-500/20">
          {state.message}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        <Section title="Summary">
          <div className="text-sm text-zinc-200">{guidance.summary}</div>
          <div className="mt-2 text-xs leading-5 text-zinc-400">
            {guidance.whyThisMatters}
          </div>
        </Section>

        <div className="grid gap-4 md:grid-cols-2">
          <Section title="Risks">
            <List
              items={guidance.risks}
              empty="No explicit risks flagged from current facts."
            />
          </Section>
          <Section title="Gaps (missing evidence)">
            <List items={guidance.gaps} empty="No gaps detected from current facts." />
          </Section>
        </div>

        <Section title="Opportunities">
          <List
            items={guidance.opportunities}
            empty="No opportunities detected from current facts."
          />
        </Section>

        <Section title="Next best actions">
          <NextActions actions={guidance.nextBestActions} />
        </Section>

        <Section title="Facts used (citations)">
          <ul className="space-y-2 text-sm">
            {guidance.factsUsed.map((f, idx) => (
              <li
                key={`${idx}-${f.fact}`}
                className="rounded-xl bg-white/5 p-3 text-zinc-200 ring-1 ring-white/10"
              >
                {f.fact}
                {f.evidenceId ? (
                  <span className="ml-2 text-xs text-zinc-400">
                    (evidence: {f.evidenceId})
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="mt-3 text-xs leading-5 text-zinc-400">
            Limitations: {guidance.limitations.join(" ")}
          </div>
        </Section>
      </div>

      <div className="mt-6 rounded-3xl bg-black/30 p-5 ring-1 ring-white/10">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
          Ask ATOS (guided)
        </div>
        <form action={action} className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input type="hidden" name="propertyId" value={props.propertyId} />
          <input
            name="question"
            placeholder="e.g. What gaps are most likely to cause a claim dispute?"
            className="w-full flex-1 rounded-xl bg-black/40 px-3 py-2 text-sm text-zinc-100 ring-1 ring-white/10 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            required
          />
          <button
            disabled={pending}
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-300 disabled:opacity-60"
          >
            {pending ? "Thinking…" : "Get guidance"}
          </button>
        </form>

        {guidance.answer ? (
          <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-zinc-200 ring-1 ring-white/10">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
              Answer (bounded by evidence)
            </div>
            <div className="mt-2 leading-6">{guidance.answer}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

