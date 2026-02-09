/**
 * Intelligence Center
 * 
 * Central command dashboard - the heart of the Equity Builders platform.
 * Provides comprehensive overview of properties, claims, insights, and ATOS guidance.
 */

import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { properties, insuranceClaims, atosInsights } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Brain,
} from 'lucide-react';
import { ForensicCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';
import Link from 'next/link';
import { ATOSPanel } from '@/components/atos/ATOSPanel';
import { PropertyTimeline } from '@/components/intelligence/PropertyTimeline';
import { MetricCard } from '@/components/intelligence/MetricCard';

export default async function IntelligenceCenterPage() {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Fetch user's properties (or all for internal users)
  const userProperties = userRole === 'internal'
    ? await db.select().from(properties).orderBy(desc(properties.updatedAt)).limit(10)
    : await db.select().from(properties).where(eq(properties.ownerId, userId)).orderBy(desc(properties.updatedAt));

  // Fetch active claims
  const activeClaims = await db.select()
    .from(insuranceClaims)
    .where(and(
      // Filter by properties user has access to
      userRole === 'internal' 
        ? undefined 
        : eq(insuranceClaims.propertyId, userProperties[0]?.id)
    ))
    .orderBy(desc(insuranceClaims.updatedAt))
    .limit(5);

  // Fetch ATOS insights
  const recentInsights = await db.select()
    .from(atosInsights)
    .where(and(
      eq(atosInsights.isResolved, false),
      userRole === 'internal' ? undefined : eq(atosInsights.userId, userId)
    ))
    .orderBy(desc(atosInsights.createdAt))
    .limit(10);

  // Calculate metrics
  const totalProperties = userProperties.length;
  const activeProperties = userProperties.filter(p => 
    ['inspecting', 'documented', 'claim_submitted', 'in_negotiation', 'in_repair'].includes(p.status)
  ).length;
  
  const totalClaimValue = activeClaims.reduce((sum, claim) => 
    sum + (parseFloat(claim.claimedAmount?.toString() || '0')), 0
  );
  
  const approvedAmount = activeClaims.reduce((sum, claim) => 
    sum + (parseFloat(claim.approvedAmount?.toString() || '0')), 0
  );

  const criticalInsights = recentInsights.filter(i => i.priority === 'critical').length;
  const highInsights = recentInsights.filter(i => i.priority === 'high').length;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Intelligence Center</h1>
        <p className="page-description">
          Comprehensive overview of your properties, claims, and AI-guided insights
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Properties"
          value={totalProperties}
          icon={Building2}
          trend={activeProperties > 0 ? `${activeProperties} active` : undefined}
          color="blue"
        />
        <MetricCard
          title="Active Claims"
          value={activeClaims.length}
          icon={FileText}
          trend={activeClaims.filter(c => c.status === 'approved').length > 0 
            ? `${activeClaims.filter(c => c.status === 'approved').length} approved` 
            : undefined}
          color="purple"
        />
        <MetricCard
          title="Claimed Value"
          value={formatCurrency(totalClaimValue)}
          icon={DollarSign}
          trend={approvedAmount > 0 ? `${formatCurrency(approvedAmount)} approved` : undefined}
          color="green"
        />
        <MetricCard
          title="Active Insights"
          value={recentInsights.length}
          icon={Brain}
          trend={criticalInsights > 0 ? `${criticalInsights} critical` : undefined}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Properties & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* ATOS Insights Panel */}
          <ATOSPanel insights={recentInsights} userRole={userRole} />

          {/* Recent Properties */}
          <ForensicCard>
            <CardHeader>
              <CardTitle>Active Properties</CardTitle>
            </CardHeader>
            <CardContent>
              {userProperties.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No properties yet</p>
                  <Link href="/properties/new" className="btn-primary">
                    Add Your First Property
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userProperties.slice(0, 5).map((property) => (
                    <Link
                      key={property.id}
                      href={`/properties/${property.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-forensic-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{property.address}</h3>
                            <Badge variant={getStatusBadgeVariant(property.status)}>
                              {property.status.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {property.city}, {property.state} {property.zipCode}
                          </p>
                          {property.stormType && (
                            <p className="text-sm text-gray-500 mt-1">
                              Storm: {property.stormType} • {formatDate(property.stormDate)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {property.preDamageValue && (
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(property.preDamageValue)}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Updated {timeAgo(property.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </ForensicCard>

          {/* Activity Timeline */}
          {userProperties.length > 0 && (
            <ForensicCard>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <PropertyTimeline propertyId={userProperties[0].id} />
              </CardContent>
            </ForensicCard>
          )}
        </div>

        {/* Right Column - Insights & Actions */}
        <div className="space-y-8">
          {/* Critical Alerts */}
          {(criticalInsights > 0 || highInsights > 0) && (
            <Card className="border-l-4 border-l-critical-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-critical-600" />
                  <span>Attention Required</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentInsights
                    .filter(i => i.priority === 'critical' || i.priority === 'high')
                    .slice(0, 3)
                    .map((insight) => (
                      <div key={insight.id} className="p-3 bg-critical-50 rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-sm font-semibold text-critical-900">
                            {insight.title}
                          </h4>
                          <Badge variant="danger" className="text-xs">
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-critical-700">{insight.description}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Claims Summary */}
          <ForensicCard>
            <CardHeader>
              <CardTitle>Claims Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {activeClaims.length === 0 ? (
                <p className="text-sm text-gray-600">No active claims</p>
              ) : (
                <div className="space-y-4">
                  {activeClaims.slice(0, 3).map((claim) => (
                    <Link
                      key={claim.id}
                      href={`/insurance/${claim.id}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-forensic-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {claim.claimNumber || 'Draft'}
                        </span>
                        <Badge variant={getStatusBadgeVariant(claim.status)}>
                          {claim.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        {claim.carrierName}
                      </div>
                      {claim.claimedAmount && (
                        <div className="text-sm font-semibold text-forensic-700 mt-2">
                          {formatCurrency(claim.claimedAmount)}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </ForensicCard>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/properties/new" className="btn-primary w-full">
                  Add New Property
                </Link>
                <Link href="/inspections/new" className="btn-secondary w-full">
                  Schedule Inspection
                </Link>
                <Link href="/insurance/new" className="btn-secondary w-full">
                  File Claim
                </Link>
                <Link href="/atos" className="btn-secondary w-full flex items-center justify-center">
                  <Brain className="h-4 w-4 mr-2" />
                  Ask ATOS
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-equity-600" />
                    <span className="text-xs text-equity-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ATOS AI</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-equity-600" />
                    <span className="text-xs text-equity-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Sync</span>
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
