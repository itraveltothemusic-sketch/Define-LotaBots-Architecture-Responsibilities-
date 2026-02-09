/**
 * ATOS Intelligence Assistant store.
 * 
 * Manages the state of the AI assistant panel including:
 * - Conversation history
 * - Panel visibility
 * - Current context (what module/entity the user is viewing)
 * 
 * ATOS is NOT a generic chatbot. It reasons from provided data
 * and proactively surfaces insights relevant to the current context.
 */

import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type { AtosMessage } from '@/types';

interface AtosState {
  /** Whether the ATOS panel is open */
  isOpen: boolean;
  /** Conversation messages */
  messages: AtosMessage[];
  /** Whether ATOS is currently generating a response */
  isThinking: boolean;
  /** Current context for ATOS to reason about */
  context: {
    module: string;
    entityId?: string;
    entityType?: string;
  };

  /** Toggle the ATOS panel */
  toggle: () => void;
  /** Open the ATOS panel */
  open: () => void;
  /** Close the ATOS panel */
  close: () => void;
  /** Send a message to ATOS */
  sendMessage: (content: string) => Promise<void>;
  /** Update the context ATOS is reasoning about */
  setContext: (module: string, entityId?: string, entityType?: string) => void;
  /** Clear conversation history */
  clearMessages: () => void;
}

/**
 * Generate a contextual ATOS response.
 * In production, this would call an LLM API with the full context.
 * For now, we provide intelligent pre-built responses based on context.
 */
function generateAtosResponse(userMessage: string, context: AtosState['context']): string {
  const lowerMessage = userMessage.toLowerCase();

  // Context-aware responses based on module
  if (context.module === 'dashboard') {
    if (lowerMessage.includes('priority') || lowerMessage.includes('focus')) {
      return `Based on current data, here are your priorities:\n\n**Critical:**\n1. **Riverside Industrial** — The initial inspection flagged severity 9/10 with potential pre-existing foundation issues. A structural engineering assessment must be scheduled immediately, as this could affect claim eligibility.\n\n2. **Oakmont Business Park** — I've detected a scope discrepancy: the carrier's preliminary scope excludes ~$45,000 in documented facade damage. A supplemental claim should be filed with the inspection photos as evidence.\n\n**Action Required:**\n3. **Apex Roofing insurance** expires March 1. They have 2 active assignments. Request renewal documentation now.\n\n**Opportunity:**\n4. **Meridian Tower** shows potential for 15-22% equity gain if strategic material upgrades are included in the repair scope.\n\nWould you like me to draft the supplemental claim language for Oakmont?`;
    }
    if (lowerMessage.includes('status') || lowerMessage.includes('overview')) {
      return `Here's your portfolio status:\n\n**6 properties** in the pipeline:\n- 1 in inspection (Riverside Industrial — high severity)\n- 1 claim filed (Meridian Tower — $1.85M)\n- 1 under review (Oakmont — discrepancy detected)\n- 1 approved (Summit Ridge — awaiting contractor mobilization)\n- 1 in repair (Westfield — 62% complete, on track)\n- 1 complete (Heritage Plaza — $350K equity gain verified)\n\n**Total equity gained to date:** $350,000 verified, $1.5M projected\n**Avg claim approval rate:** 88.5%\n\nThe most time-sensitive item is the Riverside Industrial assessment. Delays there compound into claim timeline risk.`;
    }
  }

  if (context.module === 'properties') {
    return `I'm analyzing the property data in context.\n\nKey observations:\n- **Damage documentation** is the foundation of every successful claim. Ensure all photos are timestamped, geotagged, and cross-referenced with the inspection report.\n- **Classification accuracy** matters — carriers will challenge damage categories that don't align with the reported weather event.\n- Properties with **severity scores above 7** should be fast-tracked for supplemental documentation.\n\nWhat specific property would you like me to analyze?`;
  }

  if (context.module === 'insurance') {
    return `From an insurance intelligence perspective:\n\n**Key patterns I'm tracking:**\n1. National Property Insurance has been approving claims ~18 days faster than industry average for commercial properties\n2. Southwest Commercial Mutual (Oakmont claim) has a pattern of excluding facade damage in initial scopes — supplemental claims are effective 73% of the time\n3. Metropolitan Underwriters (Meridian claim) typically assigns adjusters within 10 business days of filing\n\n**Risk:** The Oakmont scope discrepancy needs to be addressed before the carrier finalizes their position. Once a final scope is issued, supplemental approval rates drop to 41%.\n\nShall I prepare the discrepancy analysis for the Oakmont claim?`;
  }

  if (context.module === 'contractors') {
    return `Contractor execution analysis:\n\n**Active performance:**\n- Apex Roofing: 62% complete on Westfield roof, compliance score 94%. Tracking well.\n- Metro Structural: 78% complete on Westfield facade, compliance score 97%. Exemplary.\n- ClearView Facade: Pending mobilization for Meridian Tower.\n\n**Attention needed:**\n- Apex Roofing's insurance expires March 1. This is a compliance blocker.\n- Lone Star Waterproofing application is pending verification — they could fill capacity gaps for water damage remediation.\n\nCompliance tracking prevents costly disputes downstream. Every missing document is a liability.`;
  }

  if (context.module === 'equity') {
    return `Equity intelligence:\n\n**Verified gains:** Heritage Plaza — $350,000 (12.5%). This was achieved through insurance-funded roof replacement with strategic material upgrades.\n\n**Projected gains:**\n- Westfield Commerce Center: $600,000 (18.75%) — in progress\n- Summit Ridge: $900,000 (14.5%) — pending contractor mobilization\n- Meridian Tower: $1.8M–$2.7M (15-22%) — highest opportunity\n\n**Key insight:** Properties where we specify upgraded materials in the repair scope consistently outperform. The incremental cost is typically 8-12% above standard, but the equity gain is 2-3x that premium.\n\nThis is where forensic documentation pays off — it justifies the upgrade path.`;
  }

  // Generic intelligent response
  return `I've noted your question. Let me provide context:\n\nAs your forensic intelligence guide, I analyze data across all platform modules — properties, inspections, claims, contractors, and equity outcomes — to surface what matters most.\n\nRight now, your most critical items are:\n1. **Schedule the Riverside Industrial structural assessment** (severity 9/10, potential claim impact)\n2. **Address the Oakmont scope discrepancy** ($45K in documented damage being excluded)\n3. **Verify Apex Roofing insurance renewal** (expires March 1, 2 active projects at risk)\n\nI'm always reasoning from your actual data — never assumptions. What would you like to explore?`;
}

export const useAtosStore = create<AtosState>((set, get) => ({
  isOpen: false,
  messages: [
    {
      id: 'atos-welcome',
      role: 'assistant',
      content: `Welcome to the Intelligence Center. I'm ATOS — your forensic intelligence guide.\n\nI've analyzed your current portfolio and identified **2 critical items** and **1 high-value opportunity** that need your attention. You can see them in your insights panel, or ask me for a detailed briefing.\n\nWhat would you like to focus on?`,
      timestamp: new Date().toISOString(),
    },
  ],
  isThinking: false,
  context: {
    module: 'dashboard',
  },

  toggle: () => set(state => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  sendMessage: async (content: string) => {
    const { context, messages } = get();

    // Add user message
    const userMessage: AtosMessage = {
      id: uuid(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      context,
    };

    set({ messages: [...messages, userMessage], isThinking: true });

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    // Generate response based on context
    const responseContent = generateAtosResponse(content, context);

    const assistantMessage: AtosMessage = {
      id: uuid(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString(),
      context,
    };

    set(state => ({
      messages: [...state.messages, assistantMessage],
      isThinking: false,
    }));
  },

  setContext: (module: string, entityId?: string, entityType?: string) => {
    set({ context: { module, entityId, entityType } });
  },

  clearMessages: () => {
    set({
      messages: [
        {
          id: 'atos-welcome',
          role: 'assistant',
          content: 'Conversation cleared. How can I assist you?',
          timestamp: new Date().toISOString(),
        },
      ],
    });
  },
}));
