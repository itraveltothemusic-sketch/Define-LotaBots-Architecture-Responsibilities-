'use client';

import { useState, FormEvent } from 'react';
import { Brain, Send, Lightbulb, AlertTriangle, TrendingUp, FileSearch } from 'lucide-react';

type ContextType = 'general' | 'property_overview' | 'inspection_analysis' | 'claim_strategy' | 'scope_comparison' | 'equity_forecast';

interface Message {
  id: string;
  type: 'user' | 'atos';
  content: string;
  timestamp: Date;
}

const contextOptions: { value: ContextType; label: string; icon: typeof Brain; description: string }[] = [
  { value: 'general', label: 'General Guidance', icon: Brain, description: 'Ask anything about property claims' },
  { value: 'property_overview', label: 'Property Assessment', icon: FileSearch, description: 'Damage assessment and priorities' },
  { value: 'inspection_analysis', label: 'Inspection Analysis', icon: FileSearch, description: 'Damage documentation strategies' },
  { value: 'claim_strategy', label: 'Claim Strategy', icon: Lightbulb, description: 'Submission and negotiation guidance' },
  { value: 'scope_comparison', label: 'Scope Analysis', icon: AlertTriangle, description: 'Discrepancy detection and resolution' },
  { value: 'equity_forecast', label: 'Equity Forecast', icon: TrendingUp, description: 'ROI and equity optimization' },
];

export default function ATOSPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'atos',
      content: 'Hello! I'm ATOS, your forensic intelligence assistant. I'm here to guide you through property damage assessment, insurance claims, and equity optimization. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState<ContextType>('general');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate ATOS response (in production, this would call the AI API)
    setTimeout(() => {
      const atosMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'atos',
        content: getContextualResponse(context, input),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, atosMessage]);
      setLoading(false);
    }, 1500);
  };

  const getContextualResponse = (ctx: ContextType, query: string): string => {
    // Mock responses based on context
    const responses: Record<ContextType, string> = {
      general: `Based on your query about "${query}", I recommend reviewing your property documentation to ensure all damage is properly recorded. Would you like me to analyze a specific property or claim?`,
      property_overview: `For property assessment, I suggest prioritizing areas with structural damage first. Storm damage often has cascading effects - water intrusion following roof damage, for example. Would you like me to analyze inspection priorities for a specific property?`,
      inspection_analysis: `When documenting damage, ensure you capture: 1) Wide-angle context shots, 2) Close-ups of specific damage, 3) Measurements with reference points, 4) Before photos if available. This creates a defensible evidence chain for your claim.`,
      claim_strategy: `For optimal claim outcomes, submit within 30 days of incident with comprehensive documentation. Include: forensic inspection report, photo/video evidence, independent contractor estimates, and detailed scope of work. I can help you identify any gaps in your documentation.`,
      scope_comparison: `I've detected that insurance estimates often undervalue: 1) Concealed damage, 2) Code compliance upgrades, 3) Project management costs, 4) Extended business interruption. Would you like me to analyze a specific claim for discrepancies?`,
      equity_forecast: `Equity optimization requires: 1) Accurate pre-loss valuation, 2) Complete damage documentation, 3) Competitive contractor bids, 4) Efficient project management. I estimate an average 15-25% equity gain is achievable with proper execution. Shall we analyze a specific property?`,
    };

    return responses[ctx];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="forensic-card">
        <div className="forensic-card-body p-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-dark-900 mb-2">ATOS Assistant</h1>
              <p className="text-dark-600">
                Your forensic intelligence guide. ATOS provides strategic guidance, risk detection, 
                and opportunity identification based on your property and claim data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Context Selection */}
      <div className="forensic-card">
        <div className="forensic-card-header">
          <h2 className="text-lg font-bold text-dark-900">Conversation Context</h2>
        </div>
        <div className="forensic-card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {contextOptions.map((option) => {
              const Icon = option.icon;
              const isActive = context === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setContext(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isActive
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-dark-200 hover:border-dark-300 bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      isActive ? 'text-primary-600' : 'text-dark-400'
                    }`} />
                    <div>
                      <div className={`font-semibold text-sm ${
                        isActive ? 'text-primary-900' : 'text-dark-900'
                      }`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-dark-600 mt-0.5">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="forensic-card">
        <div className="forensic-card-body p-0">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4 scrollbar-thin">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gradient-to-br from-primary-50 to-accent-50 text-dark-900 border border-primary-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className={`text-xs text-dark-500 mt-1 ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl px-4 py-3 border border-primary-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-dark-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask ATOS anything about your properties, claims, or strategy..."
                className="flex-1 forensic-input"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="forensic-button forensic-button-primary px-6"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="forensic-card forensic-card-body p-4 hover:shadow-forensic transition-all text-left">
          <AlertTriangle className="w-6 h-6 text-warning-500 mb-2" />
          <h3 className="font-semibold text-dark-900 mb-1">Analyze Discrepancies</h3>
          <p className="text-sm text-dark-600">Review scope comparison for active claims</p>
        </button>

        <button className="forensic-card forensic-card-body p-4 hover:shadow-forensic transition-all text-left">
          <TrendingUp className="w-6 h-6 text-accent-500 mb-2" />
          <h3 className="font-semibold text-dark-900 mb-1">Forecast Equity</h3>
          <p className="text-sm text-dark-600">Project outcomes for all properties</p>
        </button>

        <button className="forensic-card forensic-card-body p-4 hover:shadow-forensic transition-all text-left">
          <Lightbulb className="w-6 h-6 text-primary-500 mb-2" />
          <h3 className="font-semibold text-dark-900 mb-1">Generate Strategy</h3>
          <p className="text-sm text-dark-600">Get recommendations for next steps</p>
        </button>
      </div>
    </div>
  );
}
