/**
 * Intelligence Center Dashboard
 * 
 * Main dashboard showing overview of all properties, claims, and activities.
 * This is the command center for the platform.
 */

'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ATOSPanel } from '@/components/atos/ATOSPanel';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils/format';
import { Building2, FileText, HardHat, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data - in production, this would come from the database
const mockStats = {
  totalProperties: 12,
  activeProperties: 8,
  totalClaimsValue: 4750000,
  totalRecovered: 3890000,
  averageRecoveryRate: 81.9,
  pendingInspections: 3,
  activeWorkOrders: 5,
};

const mockProperties = [
  {
    id: '1',
    name: 'Riverside Plaza',
    address: '123 Main St, Houston, TX',
    status: 'CLAIM_FILED',
    claimValue: 875000,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    flags: ['Documentation incomplete', 'Adjuster review pending'],
  },
  {
    id: '2',
    name: 'Tech Center Building',
    address: '456 Innovation Dr, Austin, TX',
    status: 'WORK_IN_PROGRESS',
    claimValue: 1250000,
    lastActivity: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    flags: [],
  },
  {
    id: '3',
    name: 'Downtown Retail Complex',
    address: '789 Commerce St, Dallas, TX',
    status: 'NEGOTIATION',
    claimValue: 2100000,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    flags: ['Scope discrepancy detected', 'High priority'],
  },
];

const mockGuidance = {
  id: '1',
  context: {
    userId: 'user1',
    currentModule: 'intelligence' as const,
    recentActivity: [],
  },
  guidance: 'Your Intelligence Center shows 3 properties requiring immediate attention. Focus on resolving scope discrepancies and completing documentation to avoid claim delays.',
  reasoning: 'Properties with pending actions or discrepancies are at highest risk for reduced recovery amounts or extended timelines. Addressing these proactively improves outcomes.',
  suggestedActions: [
    {
      label: 'Review Riverside Plaza documentation gaps',
      action: 'review_property_1',
      priority: 'HIGH' as const,
    },
    {
      label: 'Address Downtown Retail scope discrepancy',
      action: 'review_discrepancy_3',
      priority: 'HIGH' as const,
    },
    {
      label: 'Verify Tech Center progress update',
      action: 'verify_progress_2',
      priority: 'MEDIUM' as const,
    },
  ],
  risks: [
    'Incomplete documentation can delay Riverside Plaza claim by 2-4 weeks',
    'Downtown Retail scope discrepancy of $180K requires immediate response',
  ],
  opportunities: [
    'Tech Center ahead of schedule - early completion bonus opportunity',
    '2 new storm-damaged properties in your area ready for assessment',
  ],
  timestamp: new Date(),
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-muted mb-1">Active Properties</p>
              <p className="text-3xl font-bold text-brand-primary">
                {mockStats.activeProperties}
              </p>
              <p className="text-xs text-brand-muted mt-1">
                of {mockStats.totalProperties} total
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-brand-secondary" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-muted mb-1">Total Claimed</p>
              <p className="text-3xl font-bold text-brand-primary">
                {formatCurrency(mockStats.totalClaimsValue)}
              </p>
              <p className="text-xs text-brand-muted mt-1">
                across all properties
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-success" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-muted mb-1">Total Recovered</p>
              <p className="text-3xl font-bold text-brand-primary">
                {formatCurrency(mockStats.totalRecovered)}
              </p>
              <p className="text-xs text-brand-success mt-1">
                {mockStats.averageRecoveryRate}% recovery rate
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-muted mb-1">Active Work</p>
              <p className="text-3xl font-bold text-brand-primary">
                {mockStats.activeWorkOrders}
              </p>
              <p className="text-xs text-brand-muted mt-1">
                {mockStats.pendingInspections} inspections pending
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <HardHat className="w-6 h-6 text-brand-accent" />
            </div>
          </div>
        </Card>
      </div>

      {/* ATOS Guidance */}
      <ATOSPanel guidance={mockGuidance} />

      {/* Properties List */}
      <Card>
        <CardHeader
          title="Properties Requiring Attention"
          subtitle="Focus on flagged items to maintain claim momentum"
          action={
            <Link href="/dashboard/properties">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          }
        />

        <div className="space-y-4">
          {mockProperties.map((property) => (
            <div
              key={property.id}
              className="border border-slate-200 rounded-lg p-5 hover:border-brand-secondary transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-brand-primary mb-1">
                    {property.name}
                  </h3>
                  <p className="text-sm text-brand-muted">{property.address}</p>
                </div>
                <Badge
                  variant={
                    property.status === 'WORK_IN_PROGRESS'
                      ? 'info'
                      : property.status === 'NEGOTIATION'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {property.status.replace(/_/g, ' ')}
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-sm mb-3">
                <div>
                  <span className="text-brand-muted">Claim Value: </span>
                  <span className="font-semibold text-brand-primary">
                    {formatCurrency(property.claimValue)}
                  </span>
                </div>
                <div>
                  <span className="text-brand-muted">Last Activity: </span>
                  <span className="text-brand-primary">
                    {formatRelativeTime(property.lastActivity)}
                  </span>
                </div>
              </div>

              {property.flags.length > 0 && (
                <div className="space-y-2">
                  {property.flags.map((flag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 px-3 py-2 rounded"
                    >
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              )}

              {property.flags.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-green-800 bg-green-50 px-3 py-2 rounded">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>On track - no issues detected</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader
          title="Recent Activity"
          subtitle="Latest updates across all properties"
        />

        <div className="space-y-3">
          {[
            {
              action: 'Evidence uploaded',
              property: 'Tech Center Building',
              time: new Date(Date.now() - 1000 * 60 * 30),
              user: 'John Smith',
            },
            {
              action: 'Claim status updated',
              property: 'Riverside Plaza',
              time: new Date(Date.now() - 1000 * 60 * 60 * 2),
              user: 'System',
            },
            {
              action: 'Scope discrepancy flagged',
              property: 'Downtown Retail Complex',
              time: new Date(Date.now() - 1000 * 60 * 60 * 4),
              user: 'ATOS',
            },
            {
              action: 'Work order completed',
              property: 'Oak Street Warehouse',
              time: new Date(Date.now() - 1000 * 60 * 60 * 8),
              user: 'Mike Johnson',
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-brand-primary">
                  {activity.action}
                </p>
                <p className="text-xs text-brand-muted mt-0.5">
                  {activity.property} • by {activity.user}
                </p>
              </div>
              <span className="text-xs text-brand-muted">
                {formatRelativeTime(activity.time)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
