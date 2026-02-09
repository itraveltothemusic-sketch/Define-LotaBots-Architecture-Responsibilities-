/**
 * Main Dashboard
 * 
 * The command center of Equity Builders. Displays:
 * - Key performance metrics (properties, claims, equity)
 * - Active property pipeline with status breakdown
 * - Recent activity timeline
 * - ATOS proactive insights
 * 
 * Design philosophy: Every number tells a story. Every metric
 * connects to an actionable next step. The dashboard should make
 * the user feel informed and in control within 5 seconds.
 */
import React from "react";
import {
  Building2,
  Shield,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  FileText,
  HardHat,
  Activity,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge, getStatusVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatStatus } from "@/lib/utils";

/**
 * Demo data for the dashboard.
 * In production, this comes from the database via server components.
 * The data structure mirrors real-world property intelligence scenarios.
 */
const stats = {
  totalProperties: 24,
  activeInspections: 7,
  pendingClaims: 12,
  totalClaimedAmount: 3_847_500,
  totalApprovedAmount: 2_956_000,
  totalEquityGain: 1_234_000,
  averageROI: 34.2,
};

const recentProperties = [
  {
    id: "1",
    address: "450 Commerce Blvd",
    city: "Dallas",
    state: "TX",
    status: "CLAIM_FILED" as const,
    estimatedValue: 2_400_000,
    damageType: "Hail + Wind",
    lastActivity: "2 hours ago",
  },
  {
    id: "2",
    address: "1200 Industrial Pkwy",
    city: "Houston",
    state: "TX",
    status: "IN_REPAIR" as const,
    estimatedValue: 5_100_000,
    damageType: "Wind + Water",
    lastActivity: "5 hours ago",
  },
  {
    id: "3",
    address: "890 Retail Center Dr",
    city: "San Antonio",
    state: "TX",
    status: "INSPECTION" as const,
    estimatedValue: 1_850_000,
    damageType: "Hail",
    lastActivity: "1 day ago",
  },
  {
    id: "4",
    address: "2100 Office Park Ln",
    city: "Austin",
    state: "TX",
    status: "EQUITY_VERIFIED" as const,
    estimatedValue: 3_200_000,
    damageType: "Wind + Roof",
    lastActivity: "3 days ago",
  },
  {
    id: "5",
    address: "675 Warehouse Row",
    city: "Fort Worth",
    state: "TX",
    status: "UNDER_REVIEW" as const,
    estimatedValue: 1_500_000,
    damageType: "Hail + HVAC",
    lastActivity: "1 day ago",
  },
];

const atosInsights = [
  {
    id: "1",
    type: "RISK" as const,
    severity: "HIGH" as const,
    title: "Scope Discrepancy Detected",
    description:
      "The carrier assessment for 450 Commerce Blvd is $47,000 below your forensic scope. HVAC and roof membrane items appear undervalued. Review the scope comparison to prepare a supplemental claim.",
    property: "450 Commerce Blvd",
  },
  {
    id: "2",
    type: "OPPORTUNITY" as const,
    severity: "MEDIUM" as const,
    title: "Inspection Window Closing",
    description:
      "890 Retail Center Dr has been in INTAKE status for 12 days. Schedule a forensic inspection this week to maintain claim timeline compliance.",
    property: "890 Retail Center Dr",
  },
  {
    id: "3",
    type: "RECOMMENDATION" as const,
    severity: "LOW" as const,
    title: "Contractor Compliance Due",
    description:
      "Mike Rivera's insurance certificate expires in 15 days. Request an updated certificate to maintain compliance for active assignments.",
    property: "System-wide",
  },
];

const recentActivity = [
  {
    id: "1",
    action: "Inspection completed",
    property: "1200 Industrial Pkwy",
    user: "Sarah Chen",
    time: "2 hours ago",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: "2",
    action: "Claim submitted to carrier",
    property: "450 Commerce Blvd",
    user: "Alex Morgan",
    time: "5 hours ago",
    icon: <Shield className="w-4 h-4 text-blue-400" />,
  },
  {
    id: "3",
    action: "Progress update: 65% complete",
    property: "1200 Industrial Pkwy",
    user: "Mike Rivera",
    time: "1 day ago",
    icon: <HardHat className="w-4 h-4 text-amber-400" />,
  },
  {
    id: "4",
    action: "Equity verification completed",
    property: "2100 Office Park Ln",
    user: "System",
    time: "3 days ago",
    icon: <TrendingUp className="w-4 h-4 text-brand-400" />,
  },
  {
    id: "5",
    action: "New property added to portfolio",
    property: "675 Warehouse Row",
    user: "Sarah Chen",
    time: "4 days ago",
    icon: <Building2 className="w-4 h-4 text-slate-400" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Command Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time portfolio intelligence across {stats.totalProperties} properties
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={<FileText className="w-4 h-4" />}>
            Export Report
          </Button>
          <Button variant="primary" size="sm" icon={<Building2 className="w-4 h-4" />}>
            Add Property
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Properties"
          value={stats.totalProperties}
          change={{ value: 12, label: "this month" }}
          trend="up"
          icon={<Building2 className="w-5 h-5" />}
        />
        <StatCard
          label="Active Claims"
          value={stats.pendingClaims}
          change={{ value: 3, label: "new this week" }}
          trend="up"
          icon={<Shield className="w-5 h-5" />}
        />
        <StatCard
          label="Total Claimed"
          value={formatCurrency(stats.totalClaimedAmount)}
          change={{ value: 8.4, label: "vs last quarter" }}
          trend="up"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          label="Total Equity Gain"
          value={formatCurrency(stats.totalEquityGain)}
          change={{ value: stats.averageROI, label: "avg ROI" }}
          trend="up"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Pipeline — Left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* ATOS Insights */}
          <Card variant="glass" padding="md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-500/10">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                </div>
                <CardTitle className="text-base">ATOS Intelligence Briefing</CardTitle>
              </div>
              <Badge variant="info" dot>Live</Badge>
            </CardHeader>
            <div className="space-y-3">
              {atosInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors group cursor-pointer"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {insight.type === "RISK" && (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                    {insight.type === "OPPORTUNITY" && (
                      <Clock className="w-4 h-4 text-amber-400" />
                    )}
                    {insight.type === "RECOMMENDATION" && (
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        {insight.title}
                      </span>
                      <Badge
                        variant={
                          insight.severity === "HIGH"
                            ? "danger"
                            : insight.severity === "MEDIUM"
                            ? "warning"
                            : "info"
                        }
                        size="sm"
                      >
                        {insight.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
                </div>
              ))}
            </div>
          </Card>

          {/* Property Pipeline Table */}
          <Card variant="default" padding="none">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <CardHeader className="mb-0">
                <CardTitle className="text-base">Property Pipeline</CardTitle>
                <Button variant="ghost" size="sm">
                  View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </CardHeader>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/30">
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                      Property
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                      Damage
                    </th>
                    <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                      Est. Value
                    </th>
                    <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                      Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/20">
                  {recentProperties.map((property) => (
                    <tr
                      key={property.id}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {property.address}
                          </p>
                          <p className="text-xs text-slate-500">
                            {property.city}, {property.state}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusVariant(property.status)} dot size="sm">
                          {formatStatus(property.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300">
                          {property.damageType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-white">
                          {formatCurrency(property.estimatedValue)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-slate-500">
                          {property.lastActivity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Sidebar — Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Claim Recovery Gauge */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Claim Recovery</CardTitle>
              <CardDescription>vs. Forensic Scope</CardDescription>
            </CardHeader>
            <div className="flex flex-col items-center py-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    className="text-slate-800"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    className="text-brand-500"
                    strokeWidth="8"
                    strokeDasharray={`${76.8 * 2.64} ${100 * 2.64}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">76.8%</span>
                  <span className="text-xs text-slate-500">recovered</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 w-full text-center">
                <div>
                  <p className="text-xs text-slate-500">Claimed</p>
                  <p className="text-sm font-semibold text-white">
                    {formatCurrency(stats.totalClaimedAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Approved</p>
                  <p className="text-sm font-semibold text-emerald-400">
                    {formatCurrency(stats.totalApprovedAmount)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card variant="default" padding="md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-md bg-slate-800/50">
                    {activity.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-300 leading-snug">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activity.property} &middot; {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card variant="outlined" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start" icon={<Building2 className="w-4 h-4" />}>
                Add New Property
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" icon={<FileText className="w-4 h-4" />}>
                Schedule Inspection
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" icon={<Shield className="w-4 h-4" />}>
                File New Claim
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" icon={<HardHat className="w-4 h-4" />}>
                Assign Contractor
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
