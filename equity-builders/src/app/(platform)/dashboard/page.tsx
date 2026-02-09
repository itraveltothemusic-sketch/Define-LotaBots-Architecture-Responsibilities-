/**
 * Intelligence Center — The heart of Equity Builders.
 * 
 * This is the central command dashboard that provides:
 * 1. Portfolio-level metrics and KPIs
 * 2. Active property overview with status indicators
 * 3. Claims requiring attention
 * 4. Documentation timeline
 * 5. ATOS AI intelligence panel
 * 
 * Design philosophy: Information density without clutter.
 * Every element serves a purpose — no decorative filler.
 */

import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/ui/stat-card";
import { PropertyList } from "@/components/dashboard/property-list";
import { Timeline } from "@/components/dashboard/timeline";
import { ClaimOverview } from "@/components/dashboard/claim-overview";
import { AtosPanel } from "@/components/atos/atos-panel";
import { dashboardStats } from "@/lib/mock-data";
import { formatCurrency, formatCompact, formatPercentage } from "@/lib/utils";
import {
  Building2,
  Search,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle2,
  HardHat,
  Wrench,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <Topbar
        title="Intelligence Center"
        subtitle="Portfolio overview — forensic intelligence at a glance"
      />

      <div className="p-6 space-y-6">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Properties"
            value={dashboardStats.totalProperties.toString()}
            icon={<Building2 className="w-5 h-5" />}
            trend="up"
            trendValue="+2 this quarter"
          />
          <StatCard
            label="Pending Claims"
            value={dashboardStats.pendingClaims.toString()}
            icon={<Shield className="w-5 h-5" />}
            trend="neutral"
            trendValue="3 active"
            description="1 under review"
          />
          <StatCard
            label="Equity Gained"
            value={formatCompact(dashboardStats.totalEquityGained)}
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
            trendValue="13.5% avg gain"
          />
          <StatCard
            label="Claim Approval Rate"
            value={formatPercentage(dashboardStats.claimApprovalRate)}
            icon={<CheckCircle2 className="w-5 h-5" />}
            trend="up"
            trendValue="+2.1%"
            description="vs last quarter"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Inspections"
            value={dashboardStats.activeInspections.toString()}
            icon={<Search className="w-5 h-5" />}
          />
          <StatCard
            label="Avg Claim Cycle"
            value={`${dashboardStats.averageClaimCycle}d`}
            icon={<Clock className="w-5 h-5" />}
            trend="down"
            trendValue="-18d"
            description="improving"
          />
          <StatCard
            label="Active Contractors"
            value={dashboardStats.activeContractors.toString()}
            icon={<HardHat className="w-5 h-5" />}
          />
          <StatCard
            label="In Repair"
            value={dashboardStats.propertiesInRepair.toString()}
            icon={<Wrench className="w-5 h-5" />}
            description="on schedule"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column — Properties + Claims (takes 2 cols) */}
          <div className="xl:col-span-2 space-y-6">
            <PropertyList />
            <ClaimOverview />
          </div>

          {/* Right Column — Timeline + ATOS */}
          <div className="space-y-6">
            <AtosPanel />
            <Timeline limit={7} />
          </div>
        </div>
      </div>
    </div>
  );
}
