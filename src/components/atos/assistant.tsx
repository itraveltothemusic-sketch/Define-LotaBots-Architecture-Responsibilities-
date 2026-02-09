"use client";

import { useState, useRef, useEffect } from "react";
import {
  Brain,
  Send,
  Sparkles,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ATOSMessageRole, ATOSContext } from "@/types";

/**
 * ATOS Assistant — The forensic intelligence interface.
 *
 * ATOS is NOT a chatbot. ATOS is a forensic guide, strategist,
 * and explainer. It reasons from provided data, surfaces insights,
 * and always explains WHY.
 *
 * Design principles:
 * - Every response includes reasoning
 * - Confidence levels are always shown
 * - Entity references link back to source data
 * - Never speaks beyond its data
 */

interface Message {
  id: string;
  role: ATOSMessageRole;
  content: string;
  reasoning?: string;
  confidence?: number;
  timestamp: Date;
}

const suggestedQueries = [
  "What's the biggest risk in my portfolio right now?",
  "Summarize the claim discrepancy on Commerce Parkway",
  "What documentation am I missing for the Industrial Blvd claim?",
  "How does my recovery rate compare to industry benchmarks?",
];

// Pre-built responses that demonstrate ATOS's analytical capabilities
const atosResponses: Record<string, { content: string; reasoning: string; confidence: number }> = {
  default: {
    content:
      "Based on your current portfolio, I've identified 3 areas requiring attention:\n\n1. **Commerce Parkway Claim** — The $149K discrepancy with National Insurance Group represents your highest-value open negotiation. HVAC documentation is the critical lever.\n\n2. **Industrial Blvd Documentation** — The carrier's request for interior water damage photos remains unfulfilled. Each day of delay increases the risk of scope reduction.\n\n3. **Storm Season Preparation** — Your Richardson property is the most exposed. Pre-storm baseline documentation should be prioritized before March.\n\nWould you like me to detail the specific actions for any of these?",
    reasoning:
      "Analysis based on: 4 active properties, 3 insurance claims (2 open), current documentation completeness scores, and DFW storm season forecasting data. Priority ranking considers financial impact × time sensitivity.",
    confidence: 0.92,
  },
  risk: {
    content:
      "**Highest portfolio risk: Commerce Parkway HVAC claim dispute.**\n\nThe $149,000 discrepancy on claim NI-2025-78432 is your most financially significant open item. Here's my analysis:\n\n- **Current state**: Carrier approved $245K of $394K. HVAC scope ($142K) is the primary dispute.\n- **Risk factor**: The carrier's 15-business-day review window expires February 5th. Without a proactive follow-up, this could default to their current position.\n- **Historical pattern**: This carrier approves HVAC claims 73% of the time when efficiency testing data is provided. Your documentation is uploaded but the supplement hasn't been formally linked to the efficiency test results.\n\n**Recommended action**: File a formal supplement addendum linking the HVAC efficiency test results (uploaded Nov 20) directly to each disputed line item. This correlates efficiency loss to hail impact, which is their documented approval criteria.",
    reasoning:
      "Risk scoring model: (discrepancy amount × probability of non-recovery × time urgency). Commerce Parkway scores 94/100. Next highest risk is Industrial Blvd at 67/100. Portfolio-level VaR is $197K on open claims.",
    confidence: 0.89,
  },
  documentation: {
    content:
      "**Documentation gap analysis for 890 Industrial Blvd (SW-2025-91205):**\n\nThe carrier (Southwest Mutual) has specifically requested:\n\n1. **Interior water damage photographs** — MISSING\n   - They need ceiling staining patterns in the warehouse section\n   - Wall moisture evidence along the north perimeter\n   - Timestamp and GPS-tagged images for forensic validity\n\n2. **Moisture meter readings** — MISSING\n   - Readings at 6+ points along the water intrusion path\n   - Comparative readings in unaffected areas (control samples)\n\n3. **HVAC testing results** — NOT YET REQUESTED but recommended\n   - Proactively including this prevents a secondary request cycle\n   - Adds estimated $45K to supportable scope\n\n**Impact of inaction**: Without items 1-2, the carrier can legitimately reduce scope by $85K-$120K. Current claim: $520K. At-risk amount: up to 23% of total claim value.\n\n**Recommendation**: Schedule an interior documentation session within 48 hours. I can generate the photo documentation checklist for the inspector.",
    reasoning:
      "Gap analysis cross-references: carrier's written request (received Jan 28), current evidence library (exterior photos only for this property), and claim scope line items that lack supporting documentation.",
    confidence: 0.95,
  },
  recovery: {
    content:
      "**Portfolio recovery rate analysis:**\n\n**Your rate: 67.4%** (across all claims, including open)\n**Settled claims only: 94.6%** (significantly above benchmark)\n\nIndustry comparison:\n- Average commercial restoration recovery: 72-78%\n- Top-quartile performers: 85-92%\n- Your settled-claim rate of 94.6% exceeds top-quartile by 2.6 points\n\n**Why the gap between overall and settled rates?**\nTwo open claims (Commerce Parkway and Industrial Blvd) are in early-to-mid negotiation stages. If both achieve outcomes consistent with your historical pattern:\n- Projected overall recovery: 88-92%\n- Projected additional recovery: $142K-$197K\n\n**Key driver of your outperformance**: Forensic documentation completeness. Your settled claim (Oak Lawn Ave) had a 97% documentation score vs. industry average of 61%. Documentation quality is the #1 predictor of recovery rate.",
    reasoning:
      "Benchmarks sourced from: industry loss ratio reports, claim settlement databases, and internal performance tracking. Projection model assumes documentation improvements on open claims reach 85%+ completeness.",
    confidence: 0.87,
  },
};

export function ATOSAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "sys_1",
      role: "assistant",
      content:
        "I'm ATOS, your forensic intelligence assistant. I analyze your property portfolio, insurance claims, and restoration data to surface risks, opportunities, and actionable guidance.\n\nI currently see **4 properties**, **2 open claims**, and **2 unacknowledged insights** in your portfolio. How can I help?",
      reasoning: "Initial portfolio scan completed. No critical alerts requiring immediate escalation.",
      confidence: 0.99,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showReasoning, setShowReasoning] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const query = text || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));

    // Select response based on query content
    let responseKey = "default";
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("risk") || lowerQuery.includes("biggest")) {
      responseKey = "risk";
    } else if (lowerQuery.includes("documentation") || lowerQuery.includes("missing")) {
      responseKey = "documentation";
    } else if (lowerQuery.includes("recovery") || lowerQuery.includes("benchmark") || lowerQuery.includes("compare")) {
      responseKey = "recovery";
    }

    const response = atosResponses[responseKey];
    const assistantMsg: Message = {
      id: `atos_${Date.now()}`,
      role: "assistant",
      content: response.content,
      reasoning: response.reasoning,
      confidence: response.confidence,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMsg]);
  };

  const toggleReasoning = (msgId: string) => {
    setShowReasoning((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-violet-100">
          <Brain className="w-5 h-5 text-violet-600" />
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-violet-500 rounded-full atos-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">ATOS Assistant</h3>
          <p className="text-[10px] text-slate-400">
            Forensic Intelligence & Strategy
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[85%] px-4 py-3 bg-slate-900 text-white text-sm rounded-2xl rounded-br-md">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg bg-violet-100 mt-0.5">
                    <Brain className="w-3.5 h-3.5 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="px-4 py-3 bg-slate-50 rounded-2xl rounded-tl-md">
                      <div
                        className="text-sm text-slate-700 leading-relaxed prose prose-sm prose-slate max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: msg.content
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\n/g, "<br />"),
                        }}
                      />
                    </div>
                    {/* Confidence & Reasoning toggle */}
                    {msg.confidence !== undefined && (
                      <div className="flex items-center gap-3 mt-1.5 px-1">
                        <span className="text-[10px] text-slate-400">
                          Confidence: {Math.round(msg.confidence * 100)}%
                        </span>
                        {msg.reasoning && (
                          <button
                            onClick={() => toggleReasoning(msg.id)}
                            className="flex items-center gap-1 text-[10px] text-violet-500 hover:text-violet-700 font-medium"
                          >
                            <Lightbulb className="w-3 h-3" />
                            {showReasoning[msg.id] ? "Hide" : "Show"} reasoning
                            {showReasoning[msg.id] ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                    {/* Reasoning panel */}
                    {msg.reasoning && showReasoning[msg.id] && (
                      <div className="mt-2 mx-1 px-3 py-2 bg-violet-50 border border-violet-100 rounded-lg">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Lightbulb className="w-3 h-3 text-violet-500" />
                          <span className="text-[10px] font-semibold text-violet-700 uppercase tracking-wide">
                            Reasoning Chain
                          </span>
                        </div>
                        <p className="text-[11px] text-violet-600 leading-relaxed">
                          {msg.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg bg-violet-100">
              <Brain className="w-3.5 h-3.5 text-violet-600" />
            </div>
            <div className="px-4 py-3 bg-slate-50 rounded-2xl rounded-tl-md">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
                <span className="text-xs text-slate-400">
                  ATOS is analyzing...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested queries */}
      {messages.length <= 1 && (
        <div className="px-5 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {suggestedQueries.map((query) => (
              <button
                key={query}
                onClick={() => handleSend(query)}
                className="px-3 py-1.5 text-[11px] font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg border border-violet-100 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-5 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask ATOS about your portfolio..."
            className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-slate-400 transition-all"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="flex items-center justify-center w-10 h-10 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-slate-400 text-center">
          ATOS reasons only from your documented data. Confidence levels indicate analytical certainty.
        </p>
      </div>
    </div>
  );
}
