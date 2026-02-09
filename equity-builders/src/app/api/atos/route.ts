/**
 * ATOS API Route
 * 
 * Handles requests to the ATOS intelligence system.
 * Wraps the AI layer with request validation and response formatting.
 */
import { NextRequest, NextResponse } from "next/server";
import { generateATOSResponse } from "@/lib/ai/atos";
import type { ATOSContextType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context, contextData, conversationHistory } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const validContexts: ATOSContextType[] = [
      "PROPERTY_OVERVIEW",
      "INSPECTION_GUIDANCE",
      "CLAIM_STRATEGY",
      "CONTRACTOR_REVIEW",
      "EQUITY_ANALYSIS",
      "GENERAL",
    ];

    const atosContext: ATOSContextType = validContexts.includes(context)
      ? context
      : "GENERAL";

    const response = await generateATOSResponse({
      message,
      context: atosContext,
      contextData,
      conversationHistory,
    });

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("ATOS API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process ATOS request" },
      { status: 500 }
    );
  }
}
