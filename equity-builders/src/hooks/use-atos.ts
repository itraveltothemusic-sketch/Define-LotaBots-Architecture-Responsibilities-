/**
 * useATOS Hook
 * 
 * Custom hook for interacting with the ATOS intelligence system
 * from any component. Manages conversation state and API calls.
 */
"use client";

import { useState, useCallback } from "react";

interface ATOSMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseATOSOptions {
  context?: string;
  contextData?: Record<string, unknown>;
}

interface UseATOSReturn {
  messages: ATOSMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
}

export function useATOS(options: UseATOSOptions = {}): UseATOSReturn {
  const { context = "GENERAL", contextData } = options;
  const [messages, setMessages] = useState<ATOSMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      const userMessage: ATOSMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/atos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            context,
            contextData,
            conversationHistory: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get ATOS response");
        }

        const assistantMessage: ATOSMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.data?.message || "Unable to process request.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [context, contextData, messages]
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearConversation,
  };
}
