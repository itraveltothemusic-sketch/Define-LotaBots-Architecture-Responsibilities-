/**
 * AtosQuickActions — Pre-built prompts for common ATOS interactions.
 * 
 * These quick actions reduce friction by letting users ask common
 * questions with a single click. They're context-aware — different
 * actions appear based on what module the user is in.
 */

'use client';

import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  BarChart3,
  Lightbulb,
  FileSearch,
  Target,
  Shield,
} from 'lucide-react';
import { useAtosStore } from '@/stores/atos-store';

const quickActionsByModule: Record<string, Array<{
  label: string;
  prompt: string;
  icon: typeof AlertTriangle;
}>> = {
  dashboard: [
    { label: 'What needs my attention?', prompt: 'What are my top priorities right now?', icon: AlertTriangle },
    { label: 'Portfolio status', prompt: 'Give me a complete portfolio status overview.', icon: BarChart3 },
    { label: 'Biggest opportunity', prompt: 'What is the highest-value opportunity in my portfolio?', icon: Lightbulb },
  ],
  properties: [
    { label: 'Risk assessment', prompt: 'Analyze the risk profile of this property.', icon: AlertTriangle },
    { label: 'Documentation gaps', prompt: 'Are there any documentation gaps for this property?', icon: FileSearch },
    { label: 'Next steps', prompt: 'What are the recommended next steps for this property?', icon: Target },
  ],
  insurance: [
    { label: 'Claim analysis', prompt: 'Analyze this claim and identify any issues.', icon: Shield },
    { label: 'Scope gaps', prompt: 'Are there scope discrepancies I should address?', icon: AlertTriangle },
    { label: 'Carrier patterns', prompt: 'What patterns do you see with this carrier?', icon: BarChart3 },
  ],
  contractors: [
    { label: 'Compliance check', prompt: 'Are there any compliance issues with active contractors?', icon: Shield },
    { label: 'Performance review', prompt: 'How are current contractors performing?', icon: BarChart3 },
    { label: 'Capacity analysis', prompt: 'Do we have capacity for upcoming projects?', icon: Target },
  ],
  equity: [
    { label: 'Gain analysis', prompt: 'Break down the equity gain drivers for this property.', icon: BarChart3 },
    { label: 'Optimization tips', prompt: 'How can we maximize equity gain on current projects?', icon: Lightbulb },
    { label: 'Portfolio summary', prompt: 'Give me the full equity portfolio summary.', icon: Target },
  ],
  intelligence: [
    { label: 'Full briefing', prompt: 'Give me a complete intelligence briefing on my portfolio.', icon: BarChart3 },
    { label: 'Risk matrix', prompt: 'What are all the active risks across my portfolio?', icon: AlertTriangle },
    { label: 'Opportunities', prompt: 'What are the highest-value opportunities right now?', icon: Lightbulb },
  ],
};

export function AtosQuickActions() {
  const { context, sendMessage, isThinking } = useAtosStore();
  const actions = quickActionsByModule[context.module] || quickActionsByModule.dashboard;

  return (
    <div className="px-4 py-2 space-y-1.5">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Actions</p>
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <button
            key={i}
            onClick={() => !isThinking && sendMessage(action.prompt)}
            disabled={isThinking}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all',
              'text-xs font-medium text-slate-600',
              isThinking
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-violet-50 hover:text-violet-700'
            )}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
