/**
 * Settings Page.
 * 
 * Platform configuration and user preferences.
 * Organized by section for easy navigation.
 */

'use client';

import { useAuthStore } from '@/stores/auth-store';
import { ROLE_CONFIG } from '@/lib/constants';
import { User, Bell, Brain } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();

  const sections = [
    {
      icon: User,
      title: 'Profile',
      description: 'Manage your personal information and preferences',
      fields: [
        { label: 'Name', value: user?.name || '—' },
        { label: 'Email', value: user?.email || '—' },
        { label: 'Role', value: user?.role ? ROLE_CONFIG[user.role]?.label : '—' },
        { label: 'Organization', value: user?.organization || '—' },
        { label: 'Phone', value: user?.phone || '—' },
      ],
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure how you receive alerts and updates',
      options: [
        { label: 'Critical ATOS insights', description: 'Immediate alerts for critical findings', enabled: true },
        { label: 'Claim status changes', description: 'Updates when claim statuses change', enabled: true },
        { label: 'Contractor milestones', description: 'Progress updates from active contractors', enabled: true },
        { label: 'Equity verifications', description: 'Notifications when equity outcomes are verified', enabled: false },
        { label: 'Weekly portfolio digest', description: 'Summary of all activity across your portfolio', enabled: true },
      ],
    },
    {
      icon: Brain,
      title: 'ATOS Intelligence',
      description: 'Configure the AI assistant behavior',
      options: [
        { label: 'Proactive insights', description: 'ATOS surfaces insights without being asked', enabled: true },
        { label: 'Auto-context switching', description: 'ATOS context updates as you navigate', enabled: true },
        { label: 'Detailed explanations', description: 'Include reasoning behind every recommendation', enabled: true },
      ],
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account and platform preferences.</p>
      </div>

      {sections.map((section, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
              <section.icon className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{section.title}</h3>
              <p className="text-xs text-slate-500">{section.description}</p>
            </div>
          </div>
          <div className="p-6">
            {section.fields && (
              <div className="space-y-4">
                {section.fields.map((field, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{field.label}</span>
                    <span className="text-sm font-medium text-slate-900">{field.value}</span>
                  </div>
                ))}
              </div>
            )}
            {section.options && (
              <div className="space-y-4">
                {section.options.map((option, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{option.label}</p>
                      <p className="text-xs text-slate-500">{option.description}</p>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        option.enabled ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          option.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
