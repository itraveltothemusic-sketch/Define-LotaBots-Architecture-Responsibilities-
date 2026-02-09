/**
 * AtosPanel — The ATOS Intelligence Assistant interface.
 * 
 * This is NOT a chatbot UI. This is a forensic intelligence panel.
 * 
 * Design decisions:
 * - Fixed right panel (not a modal) so users can reference it while working
 * - Messages are rendered with markdown-like formatting for readability
 * - The thinking indicator shows ATOS is processing, building trust
 * - Context badge shows what ATOS is currently analyzing
 * - Clear separation between user questions and ATOS guidance
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Brain, Send, X, Trash2, Sparkles } from 'lucide-react';
import { useAtosStore } from '@/stores/atos-store';

export function AtosPanel() {
  const {
    isOpen,
    close,
    messages,
    isThinking,
    sendMessage,
    clearMessages,
    context,
  } = useAtosStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;
    setInput('');
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        'fixed top-0 right-0 bottom-0 w-96 bg-white border-l border-slate-200 shadow-xl z-50',
        'transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">ATOS</h3>
            <p className="text-[10px] text-slate-500">Forensic Intelligence Guide</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearMessages}
            className="p-1.5 rounded-md hover:bg-slate-200/50 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={close}
            className="p-1.5 rounded-md hover:bg-slate-200/50 transition-colors"
            title="Close ATOS"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Context Badge */}
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Sparkles className="w-3 h-3 text-violet-500" />
          <span>Analyzing: <span className="font-medium text-slate-700 capitalize">{context.module}</span></span>
          {context.entityId && (
            <span className="text-slate-400">/ {context.entityId}</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100vh - 170px)' }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            className={cn(
              'flex',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-800 rounded-bl-sm'
              )}
            >
              {/* Render message with basic formatting */}
              {msg.content.split('\n').map((line, i) => {
                // Bold text
                const formatted = line.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong>$1</strong>'
                );

                if (line.trim() === '') return <br key={i} />;

                // Numbered list items
                if (/^\d+\./.test(line.trim())) {
                  return (
                    <p
                      key={i}
                      className="ml-2 my-0.5"
                      dangerouslySetInnerHTML={{ __html: formatted }}
                    />
                  );
                }

                // Bullet points
                if (line.trim().startsWith('- ')) {
                  return (
                    <p
                      key={i}
                      className="ml-2 my-0.5"
                      dangerouslySetInnerHTML={{ __html: '• ' + formatted.replace(/^- /, '') }}
                    />
                  );
                }

                return (
                  <p
                    key={i}
                    className="my-0.5"
                    dangerouslySetInnerHTML={{ __html: formatted }}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-xl rounded-bl-sm px-4 py-3 text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs">ATOS is analyzing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ATOS for guidance..."
            className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
            disabled={isThinking}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className={cn(
              'p-2.5 rounded-lg transition-all',
              input.trim() && !isThinking
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-400 text-center">
          ATOS reasons from your data — never assumptions
        </p>
      </div>
    </div>
  );
}
