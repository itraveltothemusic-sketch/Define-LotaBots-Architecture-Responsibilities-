"use client";

/**
 * useAtos — Custom hook for interacting with the ATOS intelligence API.
 * 
 * Provides a clean interface for components to:
 * - Send queries to ATOS
 * - Receive structured responses
 * - Track loading/error states
 * - Maintain conversation context
 * 
 * WHY a hook: ATOS interactions are stateful (conversation history)
 * and need consistent error handling across all modules. A hook
 * centralizes this logic and prevents duplicate API call patterns.
 */

import { useState, useCallback } from "react";
import type { AtosMessage, AtosContext } from "@/types";
import { generateId } from "@/lib/utils";

interface UseAtosOptions {
  context?: AtosContext;
  contextId?: string;
}

interface UseAtosReturn {
  messages: AtosMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useAtos(options: UseAtosOptions = {}): UseAtosReturn {
  const { context = "general", contextId } = options;
  const [messages, setMessages] = useState<AtosMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Add user message immediately for optimistic UI
      const userMessage: AtosMessage = {
        id: generateId(),
        role: "user",
        content,
        context,
        contextId,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/atos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            context,
            contextId,
            history: messages.slice(-10), // Send last 10 messages for context
          }),
        });

        if (!response.ok) {
          throw new Error(`ATOS responded with ${response.status}`);
        }

        const data = await response.json();

        const assistantMessage: AtosMessage = {
          id: data.id || generateId(),
          role: "assistant",
          content: data.content,
          context: data.context || context,
          contextId: data.contextId || contextId,
          timestamp: data.timestamp || new Date().toISOString(),
          metadata: data.metadata,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to communicate with ATOS";
        setError(errorMessage);

        // Add error message to conversation for visibility
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "system",
            content: `ATOS encountered an error: ${errorMessage}. Please try again.`,
            context,
            contextId,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [context, contextId, messages],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
