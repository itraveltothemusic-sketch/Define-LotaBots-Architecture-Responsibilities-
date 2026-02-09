"use client";

/**
 * Settings Page — Platform configuration and user management.
 */

import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { currentUser } from "@/lib/mock-data";
import {
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Building2,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <Topbar
        title="Settings"
        subtitle="Platform configuration and account management"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-brand-400" />
              <h3 className="text-sm font-semibold text-white">Profile</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="name"
                label="Full Name"
                defaultValue={currentUser.name}
              />
              <Input
                id="email"
                label="Email"
                type="email"
                defaultValue={currentUser.email}
              />
              <Input
                id="organization"
                label="Organization"
                defaultValue={currentUser.organization}
              />
              <Input
                id="role"
                label="Role"
                defaultValue={currentUser.role}
                disabled
              />
            </div>
            <Button size="sm">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-brand-400" />
              <h3 className="text-sm font-semibold text-white">Security</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="current-password"
                label="Current Password"
                type="password"
                placeholder="Enter current password"
              />
              <Input
                id="new-password"
                label="New Password"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <Button size="sm">Update Password</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-400" />
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "ATOS Intelligence Alerts", description: "Receive alerts when ATOS identifies risks or opportunities" },
                { label: "Claim Status Updates", description: "Get notified when claim statuses change" },
                { label: "Contractor Progress", description: "Updates when contractors report progress milestones" },
                { label: "Document Uploads", description: "Notifications for new evidence and documentation" },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-navy-800/30 rounded-lg border border-navy-700/20">
                  <div>
                    <p className="text-sm font-medium text-white">{setting.label}</p>
                    <p className="text-xs text-navy-400 mt-0.5">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-navy-600 peer-focus:ring-2 peer-focus:ring-brand-500/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-400" />
              <h3 className="text-sm font-semibold text-white">System Information</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-navy-500 text-xs">Platform Version</p>
                <p className="text-navy-200 font-medium">1.0.0</p>
              </div>
              <div>
                <p className="text-navy-500 text-xs">Environment</p>
                <p className="text-navy-200 font-medium">Development</p>
              </div>
              <div>
                <p className="text-navy-500 text-xs">AI Engine</p>
                <p className="text-navy-200 font-medium">ATOS v1.0</p>
              </div>
              <div>
                <p className="text-navy-500 text-xs">Database</p>
                <p className="text-navy-200 font-medium">Neon Postgres</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
