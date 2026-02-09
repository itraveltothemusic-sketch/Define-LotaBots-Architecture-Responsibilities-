/**
 * Settings Page
 * 
 * User profile and account settings
 */

import { auth } from '@/lib/auth/config';
import { ForensicCard, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { User, Bell, Shield, Key } from 'lucide-react';

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  return (
    <div className="page-container max-w-4xl">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <ForensicCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-forensic-600" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={session.user.name}
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  defaultValue={session.user.email}
                  disabled
                />
              </div>
              <div>
                <label className="form-label">Role</label>
                <input
                  type="text"
                  className="form-input"
                  value={session.user.role}
                  disabled
                />
              </div>
              <button className="btn-primary">
                Save Changes
              </button>
            </div>
          </CardContent>
        </ForensicCard>

        {/* Notifications */}
        <ForensicCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-forensic-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Email Notifications</div>
                  <div className="text-sm text-gray-600">Receive updates about claims and properties</div>
                </div>
                <input type="checkbox" className="h-5 w-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">ATOS Insights</div>
                  <div className="text-sm text-gray-600">Get AI-powered recommendations</div>
                </div>
                <input type="checkbox" className="h-5 w-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Weekly Reports</div>
                  <div className="text-sm text-gray-600">Summary of portfolio activity</div>
                </div>
                <input type="checkbox" className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </ForensicCard>

        {/* Security */}
        <ForensicCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2 text-forensic-600" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <button className="btn-secondary w-full">
                Change Password
              </button>
              <button className="btn-secondary w-full">
                Enable Two-Factor Authentication
              </button>
            </div>
          </CardContent>
        </ForensicCard>
      </div>
    </div>
  );
}
