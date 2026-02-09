import {
  User,
  Shield,
  Bell,
  Database,
  Key,
  Building2,
  Users,
  Palette,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Settings Page
 *
 * Platform configuration for:
 * - User profile and preferences
 * - Organization settings
 * - Notification preferences
 * - API integrations
 * - Security settings
 */
export default function SettingsPage() {
  const settingSections = [
    {
      title: "Profile",
      description: "Manage your personal information and preferences",
      icon: User,
      fields: [
        { label: "Full Name", value: "Marcus Reid", type: "text" },
        { label: "Email", value: "marcus.reid@equitybuilders.com", type: "email" },
        { label: "Role", value: "Internal Team", type: "readonly" },
        { label: "Time Zone", value: "Central Time (CT)", type: "select" },
      ],
    },
    {
      title: "Organization",
      description: "Company and team settings",
      icon: Building2,
      fields: [
        { label: "Company Name", value: "Equity Builders", type: "text" },
        { label: "Industry", value: "Property Restoration & Insurance", type: "readonly" },
        { label: "Primary Region", value: "DFW Metropolitan Area", type: "text" },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Platform configuration and account preferences
        </p>
      </div>

      {/* Settings sections */}
      {settingSections.map((section) => (
        <Card
          key={section.title}
          title={section.title}
          description={section.description}
        >
          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  {field.label}
                </label>
                {field.type === "readonly" ? (
                  <div className="px-4 py-2.5 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg">
                    {field.value}
                  </div>
                ) : (
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                )}
              </div>
            ))}
            <div className="pt-2">
              <Button size="sm">Save Changes</Button>
            </div>
          </div>
        </Card>
      ))}

      {/* Quick settings cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: "Notifications",
            description: "Configure how and when you receive alerts",
            icon: Bell,
            action: "Configure",
          },
          {
            title: "Security",
            description: "Two-factor authentication and session management",
            icon: Shield,
            action: "Manage",
          },
          {
            title: "API Keys",
            description: "Manage integration tokens and webhooks",
            icon: Key,
            action: "View Keys",
          },
          {
            title: "Team Members",
            description: "Invite and manage team access",
            icon: Users,
            action: "Manage Team",
          },
          {
            title: "Database",
            description: "Connection status and data management",
            icon: Database,
            action: "View Status",
          },
          {
            title: "Appearance",
            description: "Theme and display preferences",
            icon: Palette,
            action: "Customize",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100">
              <item.icon className="w-5 h-5 text-slate-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {item.description}
              </p>
              <button className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                {item.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
