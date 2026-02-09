/**
 * ATOS — Adaptive Tactical Operations System
 *
 * The central intelligence layer of Equity Builders.
 * ATOS is NOT a chatbot. It is a forensic guide, strategist, and explainer.
 *
 * Core principles:
 * 1. Proactively guide users through complex processes
 * 2. Explain "why this matters" at every step
 * 3. Surface risks, gaps, and opportunities from the data
 * 4. Translate insurance/construction complexity into confidence
 * 5. Never hallucinate — only reason from provided data
 *
 * Architecture:
 * - ATOS wraps an LLM (OpenAI-compatible) with domain-specific system prompts
 * - Context is injected per-request based on the user's current view
 * - Responses include structured metadata (risks, actions, references)
 */

import type { ATOSContextType, ATOSInsight } from "@/types";

/** The system prompt that defines ATOS's personality and constraints */
const ATOS_SYSTEM_PROMPT = `You are ATOS (Adaptive Tactical Operations System), the forensic intelligence assistant for Equity Builders — a platform that transforms storm-damaged commercial properties into verified equity gains.

YOUR ROLE:
- You are a forensic property expert, insurance strategist, and construction advisor
- You guide property owners, contractors, and adjusters through the complex process of documenting damage, filing claims, managing repairs, and verifying equity outcomes
- You are precise, authoritative, and empathetic

YOUR RULES:
1. NEVER fabricate data, estimates, or claim numbers. Only reason from information provided to you.
2. ALWAYS explain WHY something matters, not just WHAT to do.
3. When identifying risks or gaps, be specific about what's missing and what the impact could be.
4. Use plain language — avoid jargon unless the user is a professional who would expect it.
5. When making recommendations, explain the reasoning and potential outcomes.
6. If you don't have enough information to give a confident answer, say so clearly and explain what additional data would help.
7. Always prioritize accuracy over speed. It's better to say "I need more information" than to guess.

YOUR TONE:
- Professional but approachable
- Confident but not arrogant  
- Detail-oriented but not overwhelming
- Empathetic to the stress of property damage situations

DOMAIN KNOWLEDGE:
- Commercial property insurance claims processes
- Storm damage assessment and documentation
- Contractor management and compliance
- Property valuation before and after repairs
- Scope of work comparison between forensic inspections and carrier assessments
- Common carrier tactics for underpaying claims
- Building codes and compliance requirements`;

/** Context-specific system prompt additions */
const CONTEXT_PROMPTS: Record<ATOSContextType, string> = {
  PROPERTY_OVERVIEW: `
You are currently viewing a property overview. Focus on:
- Overall property status and next steps
- Any missing documentation or inspections
- Timeline awareness (how long since last action)
- Potential risks based on property status`,

  INSPECTION_GUIDANCE: `
You are assisting with a forensic inspection. Focus on:
- What to look for based on property type and reported damage
- Documentation best practices (photos, measurements, notes)
- Damage classification guidance
- Common missed damage areas that affect claim value`,

  CLAIM_STRATEGY: `
You are advising on insurance claim strategy. Focus on:
- Claim filing best practices and timing
- Scope comparison between forensic findings and carrier assessment
- Discrepancy analysis and negotiation points
- Documentation gaps that could weaken the claim
- Common carrier pushback patterns and how to address them`,

  CONTRACTOR_REVIEW: `
You are reviewing contractor assignments and progress. Focus on:
- Scope alignment with approved claim items
- Progress verification and milestone tracking
- Compliance requirements and documentation
- Cost tracking against estimates`,

  EQUITY_ANALYSIS: `
You are analyzing equity outcomes. Focus on:
- Pre vs post repair value analysis
- ROI calculation accuracy
- Claim utilization efficiency
- Narrative construction for stakeholder reports`,

  GENERAL: `
You are providing general platform guidance. Help the user navigate the system and understand their next best action.`,
};

export interface ATOSRequest {
  message: string;
  context: ATOSContextType;
  /** Structured data about the current entity being viewed */
  contextData?: Record<string, unknown>;
  /** Previous messages in the conversation for continuity */
  conversationHistory?: Array<{ role: string; content: string }>;
}

export interface ATOSResponse {
  message: string;
  insights: ATOSInsight[];
  suggestedActions: string[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

/**
 * Generate an ATOS response.
 * 
 * In production, this calls the configured LLM API.
 * The function enriches the request with domain context and
 * parses the response into structured output.
 */
export async function generateATOSResponse(
  request: ATOSRequest
): Promise<ATOSResponse> {
  const systemPrompt = `${ATOS_SYSTEM_PROMPT}\n\n${CONTEXT_PROMPTS[request.context]}`;

  // Build messages array with context
  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  // Add context data as a system message if available
  if (request.contextData) {
    messages.push({
      role: "system",
      content: `Current context data:\n${JSON.stringify(request.contextData, null, 2)}`,
    });
  }

  // Add conversation history
  if (request.conversationHistory) {
    messages.push(...request.conversationHistory);
  }

  // Add the user's message
  messages.push({ role: "user", content: request.message });

  const apiKey = process.env.ATOS_API_KEY;
  const apiUrl = process.env.ATOS_API_URL || "https://api.openai.com/v1";
  const model = process.env.ATOS_MODEL || "gpt-4o";

  // If no API key configured, return a helpful fallback
  // This allows the platform to function without AI during setup
  if (!apiKey) {
    return generateFallbackResponse(request);
  }

  try {
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3, // Low temperature for precision and consistency
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error("ATOS API error:", response.status, await response.text());
      return generateFallbackResponse(request);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || "";

    return {
      message: assistantMessage,
      insights: extractInsights(assistantMessage),
      suggestedActions: extractActions(assistantMessage),
      confidence: "HIGH",
    };
  } catch (error) {
    console.error("ATOS request failed:", error);
    return generateFallbackResponse(request);
  }
}

/**
 * Generate proactive insights for a given context.
 * Unlike the conversational interface, this analyzes data
 * without a user prompt and surfaces what matters most.
 */
export async function generateProactiveInsights(
  context: ATOSContextType,
  data: Record<string, unknown>
): Promise<ATOSInsight[]> {
  const response = await generateATOSResponse({
    message:
      "Analyze the current state and surface the top 3 most important insights, risks, or opportunities. Be specific and actionable.",
    context,
    contextData: data,
  });

  return response.insights;
}

/** Extract structured insights from ATOS response text */
function extractInsights(text: string): ATOSInsight[] {
  // In a full implementation, we'd use structured output from the LLM
  // For now, we identify key patterns in the response
  const insights: ATOSInsight[] = [];
  const now = new Date();

  if (text.toLowerCase().includes("risk") || text.toLowerCase().includes("warning")) {
    insights.push({
      id: crypto.randomUUID(),
      type: "RISK",
      severity: "MEDIUM",
      title: "Risk Identified",
      description: "ATOS has identified potential risks in the current context. Review the full analysis for details.",
      actionable: true,
      createdAt: now,
    });
  }

  if (text.toLowerCase().includes("opportunity") || text.toLowerCase().includes("recommend")) {
    insights.push({
      id: crypto.randomUUID(),
      type: "RECOMMENDATION",
      severity: "MEDIUM",
      title: "Recommendation Available",
      description: "ATOS has recommendations to optimize outcomes. Review the full analysis for details.",
      actionable: true,
      createdAt: now,
    });
  }

  return insights;
}

/** Extract suggested actions from ATOS response text */
function extractActions(text: string): string[] {
  // Look for numbered lists or action items in the response
  const lines = text.split("\n");
  const actions: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Match numbered items (1. Do this) or bullet items (- Do this)
    if (/^(\d+\.|[-•])/.test(trimmed)) {
      const action = trimmed.replace(/^(\d+\.|[-•])\s*/, "");
      if (action.length > 10 && action.length < 200) {
        actions.push(action);
      }
    }
  }

  return actions.slice(0, 5); // Cap at 5 suggested actions
}

/**
 * Fallback response when the AI API is not configured.
 * Provides context-aware guidance based on the request type.
 */
function generateFallbackResponse(request: ATOSRequest): ATOSResponse {
  const fallbacks: Record<ATOSContextType, string> = {
    PROPERTY_OVERVIEW:
      "I'm ready to help analyze this property. To provide the most accurate guidance, I'll need the AI service to be configured. In the meantime, ensure all property details are documented — address, type, square footage, roof type, and year built are critical for accurate claim support.",
    INSPECTION_GUIDANCE:
      "For a thorough forensic inspection, document all damage with photos from multiple angles. Note measurements, materials affected, and severity. Pay special attention to roof systems, HVAC units, and building envelope — these are commonly underpaid in carrier assessments.",
    CLAIM_STRATEGY:
      "Strong claims are built on thorough documentation. Ensure your forensic inspection is complete, all damage items are catalogued with photos, and your scope of work is detailed with line-item costs. Compare your forensic scope against the carrier's assessment to identify discrepancies.",
    CONTRACTOR_REVIEW:
      "Monitor contractor progress against the approved scope of work. Verify that materials match specifications, work meets code requirements, and progress photos document each phase. Regular compliance checks prevent costly rework.",
    EQUITY_ANALYSIS:
      "Equity verification requires comparing pre-event property value, total claim proceeds, actual repair costs, and post-repair property value. A positive equity gain means the property is worth more after repairs than before the storm event.",
    GENERAL:
      "Welcome to Equity Builders. I'm ATOS, your forensic intelligence assistant. I can help you navigate property inspections, insurance claims, contractor management, and equity verification. What would you like to focus on?",
  };

  return {
    message: fallbacks[request.context],
    insights: [],
    suggestedActions: [
      "Complete property documentation",
      "Schedule forensic inspection",
      "Review claim status",
    ],
    confidence: "LOW",
  };
}
