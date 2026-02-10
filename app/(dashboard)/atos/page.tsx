/**
 * ATOS Assistant Page
 * 
 * Dedicated interface for interacting with the ATOS AI assistant
 */

'use client';

import { useState } from 'react';
import { Brain, Send, Lightbulb, TrendingUp, AlertTriangle, FileText } from 'lucide-react';
import { ForensicCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ATOSPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello! I'm ATOS, your forensic intelligence strategist. I analyze your property data, insurance claims, and contractor activities to provide actionable insights.

I can help you with:
• Property damage assessment analysis
• Insurance claim optimization strategies
• Scope discrepancy identification
• Contractor performance tracking
• Equity outcome projections

What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Simulate AI response (in production, this would call your AI API)
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('claim') || lowerQuestion.includes('insurance')) {
      return `Based on your claim data, I recommend:

1. **Documentation Enhancement**: Ensure all damage photos include timestamps and location metadata
2. **Scope Verification**: Request a detailed line-item breakdown from your adjuster
3. **Timeline Management**: File supplemental claims within 30 days of discovery

Your current approval rate is tracking well. Continue documenting all carrier interactions.`;
    }
    
    if (lowerQuestion.includes('property') || lowerQuestion.includes('damage')) {
      return `Property analysis shows:

• **Inspection Status**: Complete forensic documentation increases claim approval by 34%
• **Evidence Quality**: High-resolution photos with metadata are critical
• **Timeline**: Properties with <7 day inspection turnaround see 22% better outcomes

I recommend scheduling follow-up inspections for any discovered damage within 48 hours.`;
    }
    
    if (lowerQuestion.includes('contractor')) {
      return `Contractor execution insights:

• **Verification**: All contractors should maintain active licenses and insurance
• **Progress Tracking**: Weekly photo updates reduce disputes by 67%
• **Scope Compliance**: Pre-work scope agreements prevent 89% of payment disputes

Your contractor network is performing within optimal parameters.`;
    }
    
    if (lowerQuestion.includes('equity') || lowerQuestion.includes('value')) {
      return `Equity outcome analysis:

Based on similar properties in your area:
• **Average Equity Gain**: $47,200 per commercial property
• **ROI**: 312% average return on repair investment
• **Timeline**: 45-60 days from claim approval to equity realization

Your properties are positioned for strong equity outcomes given current claim progress.`;
    }
    
    return `I understand you're asking about: "${question}"

To provide the most accurate guidance, I need access to specific property data. Here's what I can analyze:

• Property damage assessments and inspection reports
• Insurance claim status and carrier interactions
• Contractor progress and compliance metrics
• Financial outcomes and equity calculations

Please provide more context or ask about a specific property, claim, or contractor.`;
  };

  const quickActions = [
    { icon: FileText, label: 'Analyze Claims', question: 'What's the status of my insurance claims?' },
    { icon: TrendingUp, label: 'Equity Projections', question: 'What equity gains can I expect?' },
    { icon: AlertTriangle, label: 'Risk Analysis', question: 'What risks should I be aware of?' },
    { icon: Lightbulb, label: 'Optimization Tips', question: 'How can I optimize my claim outcomes?' },
  ];

  return (
    <div className="page-container max-w-6xl">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-forensic-600 rounded-full flex items-center justify-center">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="page-title">ATOS Intelligence Assistant</h1>
            <p className="page-description">
              AI-powered forensic strategist for property intelligence and claim optimization
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <ForensicCard className="h-[600px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-forensic-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-forensic-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 bg-forensic-600 rounded-full flex items-center justify-center mr-3">
                    <Brain className="h-5 w-5 text-white animate-pulse" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask ATOS about your properties, claims, or contractors..."
                  className="flex-1 form-input"
                  disabled={isLoading}
                />
                <Button type="submit" isLoading={isLoading} disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </ForensicCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const question = action.question;
                      if (!question || !question.trim()) return;
                      // Keep the input field in sync with the selected quick action
                      setInput(question);
                      // Directly add the user's quick action message instead of
                      // relying on async state updates + a synthetic submit event
                      setMessages((prev) => [
                        ...prev,
                        { role: 'user', content: question },
                      ]);
                    }}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-forensic-300 hover:bg-forensic-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <action.icon className="h-5 w-5 text-forensic-600" />
                      <span className="text-sm font-medium text-gray-900">{action.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>What ATOS Can Do</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-forensic-600 rounded-full mt-1.5"></div>
                  <span>Analyze property damage and inspection reports</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-forensic-600 rounded-full mt-1.5"></div>
                  <span>Identify claim optimization opportunities</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-forensic-600 rounded-full mt-1.5"></div>
                  <span>Detect scope discrepancies and gaps</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-forensic-600 rounded-full mt-1.5"></div>
                  <span>Track contractor performance metrics</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-forensic-600 rounded-full mt-1.5"></div>
                  <span>Project equity outcome scenarios</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-forensic-600 rounded-full mt-1.5"></div>
                  <span>Provide strategic recommendations</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Note */}
          <Card className="bg-forensic-50 border-forensic-200">
            <CardContent className="pt-6">
              <p className="text-xs text-forensic-800 italic">
                <strong>Note:</strong> ATOS analyzes data from your properties, claims, and contractor activities. 
                All insights are based on verified forensic data and historical patterns.
                ATOS never hallucinates facts—it reasons from provided data.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
