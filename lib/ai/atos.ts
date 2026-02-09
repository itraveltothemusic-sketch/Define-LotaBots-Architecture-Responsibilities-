/**
 * ATOS - Automated Tactical Operations System
 * 
 * AI-powered forensic guide, strategist, and explainer for the Equity Builders platform.
 * ATOS is NOT a chatbot - it's a proactive intelligence assistant that provides
 * guidance, risk detection, and opportunity identification.
 */

import type { ATOSContextType, ATOSGuidance, ATOSMessage } from '@/types';

// ============================================
// CONFIGURATION
// ============================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gpt-4-turbo-preview';

// ============================================
// SYSTEM PROMPTS
// ============================================

const SYSTEM_PROMPTS: Record<ATOSContextType, string> = {
  property_overview: `You are ATOS, a forensic property intelligence assistant. 
    Analyze property data and provide strategic insights on damage assessment, 
    inspection priorities, and claim preparation. Focus on accuracy and verification.`,
  
  inspection_analysis: `You are ATOS, a forensic inspection expert. 
    Analyze inspection data, identify damage patterns, and suggest proper 
    documentation strategies. Ensure all damage is properly categorized and estimated.`,
  
  claim_strategy: `You are ATOS, an insurance claim strategist. 
    Review claim details and provide guidance on submission strategy, 
    required documentation, and potential challenges. Maximize legitimate claim value.`,
  
  scope_comparison: `You are ATOS, a forensic scope comparison analyst. 
    Compare forensic assessments with insurance estimates. Identify discrepancies, 
    explain their significance, and recommend actions. Be precise with dollar amounts.`,
  
  contractor_selection: `You are ATOS, a contractor qualification analyst. 
    Evaluate contractor qualifications, specialties, and track records. 
    Recommend best matches for specific repair scopes.`,
  
  risk_assessment: `You are ATOS, a risk detection specialist. 
    Identify gaps, compliance issues, timeline risks, and potential claim complications. 
    Prioritize risks by severity and provide mitigation strategies.`,
  
  equity_forecast: `You are ATOS, an equity outcome forecaster. 
    Analyze financial data to project equity gains and ROI. 
    Explain calculations clearly and highlight optimization opportunities.`,
  
  general: `You are ATOS, the forensic intelligence assistant for Equity Builders. 
    Provide clear, actionable guidance on property damage claims and restoration. 
    Always base responses on provided data - never hallucinate facts.`,
};

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Generate AI response using OpenAI
 */
async function generateAIResponse(
  context: ATOSContextType,
  userQuery: string,
  contextData?: Record<string, unknown>
): Promise<{ response: string; confidence: number }> {
  if (!OPENAI_API_KEY) {
    // Fallback for development without API key
    return {
      response: `ATOS: I'm currently in development mode. In production, I would analyze your query "${userQuery}" in the context of ${context} and provide detailed forensic guidance.`,
      confidence: 0.5,
    };
  }

  try {
    const systemPrompt = SYSTEM_PROMPTS[context];
    const contextString = contextData 
      ? `\n\nContext Data:\n${JSON.stringify(contextData, null, 2)}`
      : '';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt + contextString },
          { role: 'user', content: userQuery },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';

    return {
      response: aiResponse,
      confidence: 0.85, // Mock confidence score
    };
  } catch (error) {
    console.error('AI response generation failed:', error);
    return {
      response: 'I apologize, but I encountered an error processing your request. Please try again.',
      confidence: 0,
    };
  }
}

/**
 * Generate proactive guidance based on context
 */
export async function generateGuidance(
  context: ATOSContextType,
  contextId: string,
  contextData: Record<string, unknown>
): Promise<ATOSGuidance[]> {
  const guidance: ATOSGuidance[] = [];

  // Analyze context data and generate appropriate guidance
  // This is a simplified version - production would have more sophisticated analysis

  if (context === 'scope_comparison' && contextData.discrepancies) {
    const discrepancies = contextData.discrepancies as Array<{ delta: number; severity: string }>;
    const totalDelta = discrepancies.reduce((sum, d) => sum + d.delta, 0);

    if (totalDelta > 10000) {
      guidance.push({
        type: 'action_required',
        priority: 'high',
        title: 'Significant Scope Discrepancy Detected',
        message: `Insurance estimate is $${totalDelta.toLocaleString()} lower than forensic assessment.`,
        explanation: 'This discrepancy may result in underpayment. A supplement request should be prepared with supporting documentation.',
        suggestedActions: [
          { label: 'Generate Supplement', action: 'generate_supplement', url: `/dashboard/insurance/${contextId}/supplement` },
          { label: 'Review Discrepancies', action: 'review_discrepancies', url: `/dashboard/insurance/${contextId}/comparison` },
        ],
        contextType: context,
        contextId,
        dismissable: false,
      });
    }
  }

  if (context === 'inspection_analysis' && contextData.damageItems) {
    const items = contextData.damageItems as Array<{ severity: string }>;
    const severeCount = items.filter(i => i.severity === 'severe' || i.severity === 'catastrophic').length;

    if (severeCount > 0) {
      guidance.push({
        type: 'warning',
        priority: 'high',
        title: 'Severe Damage Detected',
        message: `${severeCount} severe or catastrophic damage items identified during inspection.`,
        explanation: 'Severe damage requires immediate attention and comprehensive documentation to support insurance claims.',
        suggestedActions: [
          { label: 'Review Damage', action: 'review_damage', url: `/dashboard/inspections/${contextId}` },
          { label: 'Prepare Claim', action: 'prepare_claim', url: `/dashboard/insurance/new?inspection=${contextId}` },
        ],
        contextType: context,
        contextId,
        dismissable: true,
      });
    }
  }

  return guidance;
}

/**
 * Process user query to ATOS
 */
export async function queryATOS(
  userId: string,
  context: ATOSContextType,
  query: string,
  contextId?: string,
  contextData?: Record<string, unknown>
): Promise<ATOSMessage> {
  const { response, confidence } = await generateAIResponse(context, query, contextData);

  const message: ATOSMessage = {
    id: generateId(),
    userId,
    context,
    contextId,
    userQuery: query,
    aiResponse: response,
    confidence,
    actionable: response.toLowerCase().includes('recommend') || response.toLowerCase().includes('should'),
    timestamp: new Date(),
  };

  // In production, save message to database
  // await saveATOSMessage(message);

  return message;
}

/**
 * Get contextual help text
 */
export function getContextHelp(context: ATOSContextType): string {
  const help: Record<ATOSContextType, string> = {
    property_overview: 'Ask about property damage assessment, inspection priorities, or claim preparation strategies.',
    inspection_analysis: 'Ask about damage identification, photo documentation, or measurement techniques.',
    claim_strategy: 'Ask about claim submission timing, required documentation, or negotiation strategies.',
    scope_comparison: 'Ask about specific discrepancies, justification language, or supplement requests.',
    contractor_selection: 'Ask about contractor qualifications, specialty matching, or performance history.',
    risk_assessment: 'Ask about potential complications, compliance requirements, or risk mitigation.',
    equity_forecast: 'Ask about valuation methodologies, ROI calculations, or equity optimization.',
    general: 'Ask any question about property damage claims, insurance processes, or restoration.',
  };

  return help[context];
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId(): string {
  return `atos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Analyze property data for risks and opportunities
 */
export function analyzePropertyData(propertyData: Record<string, unknown>): {
  risks: string[];
  opportunities: string[];
  actionItems: string[];
} {
  const risks: string[] = [];
  const opportunities: string[] = [];
  const actionItems: string[] = [];

  // Example analysis logic
  if (propertyData.incidentDate) {
    const incidentDate = new Date(propertyData.incidentDate as string);
    const daysSinceIncident = Math.floor((Date.now() - incidentDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceIncident > 30 && !propertyData.inspectionCompleted) {
      risks.push('Inspection not completed within 30 days of incident');
      actionItems.push('Schedule forensic inspection immediately');
    }
  }

  if (propertyData.estimatedRepairCost && propertyData.preIncidentValue) {
    const repairCost = propertyData.estimatedRepairCost as number;
    const propertyValue = propertyData.preIncidentValue as number;
    const repairRatio = repairCost / propertyValue;

    if (repairRatio > 0.5) {
      opportunities.push('High repair-to-value ratio may justify total loss claim');
      actionItems.push('Request total loss evaluation from carrier');
    }
  }

  return { risks, opportunities, actionItems };
}
