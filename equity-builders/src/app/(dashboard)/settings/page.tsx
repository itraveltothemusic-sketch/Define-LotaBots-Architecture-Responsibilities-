/**
 * Settings Page
 * 
 * Platform configuration, team management, and user preferences.
 */
"use client";

import React from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Key,
  Building2,
  Palette,
  Database,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const settingsSections = [
  {
    title: "Profile",
    description: "Your personal information and preferences",
    icon: <User className="w-5 h-5" />,
    fields: [
      { label: "Full Name", value: "Alex Morgan", type: "text" },
      { label: "Email", value: "demo@equitybuilders.com", type: "email" },
      { label: "Phone", value: "(214) 555-0100", type: "tel" },
      { label: "Organization", value: "Equity Builders", type: "text" },
    ],
  },
  {
    title: "Security",
    description: "Password and authentication settings",
    icon: <Key className="w-5 h-5" />,
    fields: [
      { label: "Current Password", value: "", type: "password" },
      { label: "New Password", value: "", type: "password" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-500/10">
            <Settings className="w-5 h-5 text-brand-400" />
          </div>
          Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account, team, and platform preferences
        </p>
      </div>

      {/* Profile & Security */}
      {settingsSections.map((section) => (
        <Card key={section.title} variant="default" padding="md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{section.icon}</span>
              <div>
                <CardTitle className="text-base">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.fields.map((field) => (
              <Input
                key={field.label}
                label={field.label}
                type={field.type}
                defaultValue={field.value}
                placeholder={field.label}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="primary" size="sm">Save Changes</Button>
          </div>
        </Card>
      ))}

      {/* Notifications */}
      <Card variant="default" padding="md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-400" />
            <div>
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription>Configure how you receive alerts and updates</CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="space-y-4">
          {[
            { label: "ATOS Intelligence Alerts", description: "Proactive insights and risk notifications", enabled: true },
            { label: "Claim Status Updates", description: "When claim status changes or carrier responds", enabled: true },
            { label: "Contractor Progress", description: "Assignment updates and compliance alerts", enabled: true },
            { label: "Equity Milestones", description: "When equity verification is complete", enabled: true },
            { label: "Weekly Portfolio Summary", description: "Digest of portfolio-wide metrics", enabled: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
              <button
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  item.enabled ? "bg-brand-600" : "bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    item.enabled ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* ATOS Configuration */}
      <Card variant="default" padding="md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <div>
              <CardTitle className="text-base">ATOS Configuration</CardTitle>
              <CardDescription>AI intelligence system settings</CardDescription>
            </div>
          </div>
          <Badge variant="success" dot size="sm">Connected</Badge>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="AI Provider"
            defaultValue="OpenAI"
            disabled
            helperText="Contact support to change AI provider"
          />
          <Input
            label="Model"
            defaultValue="GPT-4o"
            disabled
            helperText="Uses latest available model"
          />
        </div>
        <p className="text-xs text-slate-500 mt-4">
          ATOS uses your configured AI provider to generate forensic insights, 
          risk analysis, and strategic recommendations. All data is processed 
          securely and never used for model training.
        </p>
      </Card>

      {/* Danger Zone */}
      <Card variant="default" padding="md" className="border-red-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            <div>
              <CardTitle className="text-base text-red-400">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-white">Delete Account</p>
            <p className="text-xs text-slate-500">
              Permanently delete your account and all associated data
            </p>
          </div>
          <Button variant="danger" size="sm">Delete Account</Button>
        </div>
      </Card>
    </div>
  );
}
