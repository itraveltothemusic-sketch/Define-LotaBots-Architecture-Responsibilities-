"use client";

/**
 * ATOS Panel Component
 * 
 * The primary interface for interacting with ATOS,
 * the forensic intelligence assistant. This panel can be
 * embedded in any page to provide context-aware AI guidance.
 * 
 * ATOS is NOT a chatbot. It's a forensic guide that:
 * - Proactively surfaces insights
 * - Explains "why this matters" 
 * - Translates complexity into confidence
 */
import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Lightbulb,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ATOSMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  insights?: ATOSInsightItem[];
}

interface ATOSInsightItem {
  type: "risk" | "opportunity" | "recommendation" | "alert";
  text: string;
}

interface ATOSPanelProps {
  /** The current context for ATOS to operate in */
  context?: string;
  /** Initial insights to display */
  initialInsights?: ATOSInsightItem[];
  /** Whether the panel is expanded */
  defaultExpanded?: boolean;
  /** Optional class name */
  className?: string;
}

/**
 * Preloaded conversational starters based on common user needs.
 * These help users understand what ATOS can do without requiring
 * them to know what questions to ask.
 */
const suggestedQuestions = [
  "What should I focus on today?",
  "Which claims have the largest discrepancies?",
  "Are any inspections overdue?",
  "Summarize the portfolio risk profile",
];

export function ATOSPanel({
  context = "GENERAL",
  initialInsights = [],
  defaultExpanded = true,
  className,
}: ATOSPanelProps) {
  const [messages, setMessages] = useState<ATOSMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "I'm ATOS, your forensic intelligence assistant. I analyze your property data, identify risks and opportunities, and guide you through complex insurance and construction processes. How can I help you today?",
      timestamp: new Date(),
      insights: initialInsights.length > 0 ? initialInsights : undefined,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: ATOSMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/atos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: ATOSMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.data?.message || "I'm currently unable to process that request. Please try again.",
        timestamp: new Date(),
        insights: data.data?.insights?.map((i: { type: string; description: string }) => ({
          type: i.type.toLowerCase(),
          text: i.description,
        })),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I encountered an issue processing your request. This could be a connectivity issue. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "risk":
      case "alert":
        return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
      case "opportunity":
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
      case "recommendation":
        return <Lightbulb className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl bg-slate-800/40 border border-slate-700/40 overflow-hidden flex flex-col",
        className
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-5 py-3 border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600/30 to-purple-600/30 flex items-center justify-center border border-brand-500/20">
            <Sparkles className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">ATOS</p>
            <p className="text-[10px] text-slate-500">
              Forensic Intelligence &middot; {context.replace("_", " ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-400">Active</span>
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px] min-h-[200px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-600/20 flex items-center justify-center mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                )}
                <div
                  className={cn(
                    "flex-1 rounded-lg p-3 max-w-[85%]",
                    message.role === "assistant"
                      ? "bg-slate-700/30 rounded-tl-none"
                      : "bg-brand-600/20 rounded-tr-none ml-auto"
                  )}
                >
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {/* Structured insights within the message */}
                  {message.insights && message.insights.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-slate-600/30 pt-3">
                      {message.insights.map((insight, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs"
                        >
                          {getInsightIcon(insight.type)}
                          <span className="text-slate-300">{insight.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-brand-600/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <div className="bg-slate-700/30 rounded-lg rounded-tl-none p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
                    <span className="text-sm text-slate-400">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSend(question)}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-700/30 border border-slate-600/30 text-slate-400 hover:text-white hover:border-slate-500/50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-slate-700/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask ATOS anything about your properties..."
                className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/50 transition-colors"
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!input.trim() || isLoading}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Send
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
