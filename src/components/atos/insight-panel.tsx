import {
  Brain,
  AlertTriangle,
  Lightbulb,
  Search,
  ShieldAlert,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ATOSInsight } from "@/types";

/**
 * ATOS Insight Panel — The intelligence layer made visible.
 *
 * ATOS is not a chatbot. ATOS is a forensic guide.
 * This panel surfaces proactive insights that:
 * 1. Identify risks before they become problems
 * 2. Spot opportunities the user might miss
 * 3. Flag documentation gaps that weaken claims
 * 4. Recommend specific, actionable next steps
 *
 * Every insight must explain WHY it matters.
 */
interface ATOSInsightPanelProps {
  insights: ATOSInsight[];
  compact?: boolean;
}

const typeConfig: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  risk: {
    icon: ShieldAlert,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  opportunity: {
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  gap: {
    icon: Search,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  recommendation: {
    icon: Lightbulb,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  alert: {
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

const severityBadge: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

export function ATOSInsightPanel({ insights, compact = false }: ATOSInsightPanelProps) {
  return (
    <div className="bg-gradient-to-r from-violet-50/80 via-white to-violet-50/80 rounded-2xl border border-violet-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-violet-100">
          <Brain className="w-5 h-5 text-violet-600" />
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-violet-500 rounded-full atos-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            ATOS Intelligence
          </h3>
          <p className="text-[10px] text-slate-500">
            {insights.length} actionable insight{insights.length !== 1 ? "s" : ""} requiring your attention
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        {insights.map((insight) => {
          const config = typeConfig[insight.type] || typeConfig.recommendation;
          const Icon = config.icon;

          return (
            <div
              key={insight.id}
              className={cn(
                "p-4 rounded-xl border bg-white transition-all hover:shadow-sm",
                config.border
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg",
                    config.bg
                  )}
                >
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      {insight.title}
                    </h4>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 text-[9px] font-bold uppercase rounded",
                        severityBadge[insight.severity]
                      )}
                    >
                      {insight.severity}
                    </span>
                  </div>
                  {!compact && (
                    <>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {insight.description}
                      </p>
                      {/* Actionable steps */}
                      <div className="space-y-1.5">
                        {insight.actionableSteps.map((step, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-500"
                          >
                            <ChevronRight className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      {/* Why this matters */}
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-[11px] text-slate-400 italic">
                          <span className="font-semibold text-slate-500 not-italic">
                            Why this matters:
                          </span>{" "}
                          {insight.reasoning}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
