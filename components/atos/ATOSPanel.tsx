/**
 * ATOS Intelligence Panel
 * 
 * Displays AI-powered insights, recommendations, and guidance
 */

import { Brain, AlertTriangle, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface Insight {
  id: string;
  insightType: string;
  priority: string;
  title: string;
  description: string;
  suggestedActions: any;
  contextType: string;
  contextId: string | null;
  createdAt: Date;
}

interface ATOSPanelProps {
  insights: Insight[];
  userRole: string;
}

export function ATOSPanel({ insights, userRole }: ATOSPanelProps) {
  if (insights.length === 0) {
    return (
      <div className="atos-panel">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-forensic-600 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-forensic-900">ATOS Intelligence</h2>
            <p className="text-sm text-forensic-600">Your Forensic Strategist</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center">
          <Lightbulb className="h-12 w-12 text-forensic-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            All systems nominal. ATOS is monitoring your properties and will surface insights as needed.
          </p>
          <Link href="/atos" className="text-forensic-600 hover:text-forensic-700 font-medium inline-flex items-center">
            Open ATOS Assistant
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'risk':
        return AlertTriangle;
      case 'opportunity':
        return TrendingUp;
      default:
        return Lightbulb;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-critical-500 bg-critical-50';
      case 'high':
        return 'border-warning-500 bg-warning-50';
      case 'medium':
        return 'border-primary-500 bg-primary-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="atos-panel">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-forensic-600 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-forensic-900">ATOS Intelligence</h2>
            <p className="text-sm text-forensic-600">
              {insights.length} active insight{insights.length !== 1 ? 's' : ''} detected
            </p>
          </div>
        </div>
        <Link 
          href="/atos" 
          className="text-sm font-medium text-forensic-700 hover:text-forensic-800 inline-flex items-center"
        >
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {insights.slice(0, 3).map((insight) => {
          const Icon = getInsightIcon(insight.insightType);
          
          return (
            <div
              key={insight.id}
              className={`bg-white rounded-lg p-4 border-l-4 ${getPriorityColor(insight.priority)} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5 text-forensic-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{insight.title}</h3>
                    <Badge 
                      variant={
                        insight.priority === 'critical' ? 'danger' :
                        insight.priority === 'high' ? 'warning' : 'info'
                      }
                      className="text-xs"
                    >
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  
                  {insight.suggestedActions && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">Recommended Actions:</p>
                      <ul className="space-y-1">
                        {(Array.isArray(insight.suggestedActions) ? insight.suggestedActions : []).slice(0, 2).map((action: any, idx: number) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start">
                            <span className="text-forensic-600 mr-1">→</span>
                            <span>{typeof action === 'string' ? action : action.action || action.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-forensic-200">
        <p className="text-xs text-forensic-700 italic">
          ATOS analyzes property data in real-time and surfaces actionable intelligence 
          to maximize equity outcomes and minimize claim processing delays.
        </p>
      </div>
    </div>
  );
}
