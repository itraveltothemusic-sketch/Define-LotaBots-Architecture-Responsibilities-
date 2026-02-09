"use client";

/**
 * ATOS Intelligence Panel — the forensic AI assistant interface.
 * 
 * ATOS (Adaptive Tactical Operations System) is NOT a chatbot.
 * It is a forensic guide that:
 * - Proactively surfaces risks, gaps, and opportunities
 * - Explains WHY each insight matters
 * - Provides data-backed recommendations
 * - Never guesses — only reasons from provided evidence
 * 
 * The panel can be expanded/collapsed and contextually adapts
 * based on which page/property the user is viewing.
 */

import { useState } from "react";
import {
  Brain,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Lightbulb,
  Target,
  CheckCircle2,
  Info,
  Send,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { atosInsights } from "@/lib/mock-data";
import type { AtosInsight } from "@/types";

const categoryIcons: Record<string, React.ReactNode> = {
  risk: <AlertTriangle className="w-4 h-4" />,
  opportunity: <Lightbulb className="w-4 h-4" />,
  gap: <Target className="w-4 h-4" />,
  recommendation: <Sparkles className="w-4 h-4" />,
  milestone: <CheckCircle2 className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  risk: "text-danger-400 bg-danger-400/10 border-danger-400/20",
  opportunity: "text-forensic-400 bg-forensic-400/10 border-forensic-400/20",
  gap: "text-alert-400 bg-alert-400/10 border-alert-400/20",
  recommendation: "text-brand-400 bg-brand-400/10 border-brand-400/20",
  milestone: "text-forensic-400 bg-forensic-400/10 border-forensic-400/20",
};

const severityBadgeVariant: Record<string, "info" | "success" | "warning" | "danger" | "neutral"> = {
  info: "info",
  low: "success",
  medium: "warning",
  high: "warning",
  critical: "danger",
};

function InsightCard({ insight }: { insight: AtosInsight }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "border rounded-lg p-3 transition-all duration-200",
        categoryColors[insight.category],
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex-shrink-0">
            {categoryIcons[insight.category]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={severityBadgeVariant[insight.severity]} size="sm">
                {insight.severity}
              </Badge>
              {insight.actionRequired && (
                <Badge variant="warning" size="sm">Action Required</Badge>
              )}
            </div>
            <h4 className="text-sm font-medium text-white leading-snug">
              {insight.title}
            </h4>
          </div>
          <div className="flex-shrink-0 mt-1">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-navy-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-navy-400" />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pl-6 space-y-3 animate-fade-in">
          <p className="text-sm text-navy-200 leading-relaxed">
            {insight.description}
          </p>
          {insight.suggestedAction && (
            <div className="bg-navy-900/50 rounded-lg p-3 border border-navy-700/30">
              <p className="text-xs font-semibold text-brand-300 uppercase tracking-wider mb-1">
                Suggested Action
              </p>
              <p className="text-sm text-navy-200">{insight.suggestedAction}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AtosPanelProps {
  propertyId?: string;
  className?: string;
}

export function AtosPanel({ propertyId, className }: AtosPanelProps) {
  const [query, setQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Filter insights based on context
  const relevantInsights = propertyId
    ? atosInsights.filter((i) => i.propertyId === propertyId || !i.propertyId)
    : atosInsights;

  const actionRequired = relevantInsights.filter((i) => i.actionRequired && !i.acknowledged);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Simulate ATOS thinking
    setIsThinking(true);
    setTimeout(() => setIsThinking(false), 2000);
    setQuery("");
  };

  return (
    <Card className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-navy-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand-500/15 rounded-lg">
            <Brain className="w-4 h-4 text-brand-400 animate-pulse-subtle" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">ATOS Intelligence</h3>
            <p className="text-[10px] text-navy-400">Forensic AI Guidance System</p>
          </div>
        </div>
        {actionRequired.length > 0 && (
          <Badge variant="danger" size="sm">
            {actionRequired.length} action{actionRequired.length !== 1 ? "s" : ""} needed
          </Badge>
        )}
      </div>

      {/* Insights List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[500px]">
        {isThinking && (
          <div className="flex items-center gap-2 p-3 bg-brand-500/10 border border-brand-500/20 rounded-lg animate-pulse-subtle">
            <Brain className="w-4 h-4 text-brand-400" />
            <span className="text-sm text-brand-300">ATOS is analyzing...</span>
          </div>
        )}

        {relevantInsights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}

        {relevantInsights.length === 0 && (
          <div className="text-center py-8">
            <Brain className="w-8 h-8 text-navy-600 mx-auto mb-2" />
            <p className="text-sm text-navy-400">No active insights for this context</p>
            <p className="text-xs text-navy-500 mt-1">ATOS is monitoring for changes</p>
          </div>
        )}
      </div>

      {/* Query Input */}
      <div className="p-3 border-t border-navy-700/50">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask ATOS about this property..."
            className="flex-1 px-3 py-2 bg-navy-800/60 border border-navy-700/50 rounded-lg text-sm text-navy-200 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 transition-colors"
          />
          <Button type="submit" size="sm" disabled={!query.trim()}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
        <p className="text-[10px] text-navy-500 mt-1.5 px-1">
          ATOS reasons only from verified evidence — never speculates
        </p>
      </div>
    </Card>
  );
}
