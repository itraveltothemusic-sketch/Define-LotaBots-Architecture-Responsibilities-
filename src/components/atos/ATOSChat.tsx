/**
 * ATOS Chat Interface
 * 
 * Interactive chat interface for asking ATOS questions and receiving
 * contextual guidance. This is supplementary to the proactive guidance panel.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ATOSGuidance } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'atos';
  content: string;
  timestamp: Date;
}

interface ATOSChatProps {
  propertyId?: string;
  currentModule: string;
}

export function ATOSChat({ propertyId, currentModule }: ATOSChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'atos',
      content: 'I\'m here to guide you through the property restoration process. Ask me anything about documentation, claims, or execution strategy.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // In production, this would call the ATOS API
    // For now, we'll simulate a response
    setTimeout(() => {
      const atosMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'atos',
        content: 'Based on your current context and property status, I recommend focusing on complete documentation before filing your claim. This ensures maximum recovery potential.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, atosMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">AI</span>
        </div>
        <div>
          <h3 className="font-semibold text-brand-primary text-sm">ATOS Assistant</h3>
          <p className="text-xs text-brand-muted">Ask me anything</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={clsx(
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'atos' && (
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
            )}
            <div
              className={clsx(
                'max-w-[80%] rounded-lg px-4 py-2',
                message.role === 'user'
                  ? 'bg-brand-secondary text-white'
                  : 'bg-slate-100 text-slate-800'
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <div className="bg-slate-100 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ATOS for guidance..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
            disabled={loading}
          />
          <Button type="submit" loading={loading} disabled={!input.trim()}>
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
}

import clsx from 'clsx';
