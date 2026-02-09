/**
 * Equity Outcomes Module
 * 
 * Measure and document true value creation through before/after
 * valuations, claim recovery analysis, and equity gain reporting.
 */

'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ATOSPanel } from '@/components/atos/ATOSPanel';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils/format';
import { TrendingUp, Download, FileText, DollarSign, PieChart, BarChart3 } from 'lucide-react';

// Mock data
const mockOutcomes = [
  {
    id: '1',
    property: 'Tech Center Building',
    preDamageValue: 8500000,
    postDamageValue: 7100000,
    postRestorationValue: 9200000,
    totalClaimedAmount: 1250000,
    totalReceivedAmount: 1180000,
    totalRestorationCost: 950000,
    netEquityGain: 930000,
    roi: 97.9,
    calculatedAt: new Date('2024-01-20'),
    status: 'COMPLETED',
  },
  {
    id: '2',
    property: 'Oak Street Warehouse',
    preDamageValue: 3200000,
    postDamageValue: 2650000,
    postRestorationValue: 3450000,
    totalClaimedAmount: 680000,
    totalReceivedAmount: 645000,
    totalRestorationCost: 520000,
    netEquityGain: 375000,
    roi: 72.1,
    calculatedAt: new Date('2024-01-10'),
    status: 'COMPLETED',
  },
  {
    id: '3',
    property: 'Riverside Plaza',
    preDamageValue: 6800000,
    postDamageValue: 5700000,
    postRestorationValue: null, // In progress
    totalClaimedAmount: 875000,
    totalReceivedAmount: null,
    totalRestorationCost: 425000, // Estimated so far
    netEquityGain: null,
    roi: null,
    calculatedAt: null,
    status: 'IN_PROGRESS',
  },
];

const portfolioStats = {
  totalProperties: 12,
  completedProjects: 8,
  totalValueCreated: 4250000,
  averageROI: 84.3,
  totalClaimsRecovered: 8940000,
  averageRecoveryRate: 92.7,
};

const mockGuidance = {
  id: '1',
  context: {
    userId: 'user1',
    currentModule: 'equity' as const,
    recentActivity: [],
  },
  guidance: 'Tech Center Building shows exceptional equity gain of $930K with 97.9% ROI. This outcome validates your forensic documentation and strategic execution process.',
  reasoning: 'Equity gain = (Insurance recovery - Restoration cost) + (Post-restoration value - Pre-damage value). Strong documentation and contractor management maximized both insurance recovery and property value restoration.',
  suggestedActions: [
    {
      label: 'Generate equity outcome report for Tech Center',
      action: 'generate_report',
      priority: 'HIGH' as const,
    },
    {
      label: 'Complete post-restoration valuation for Riverside Plaza',
      action: 'complete_valuation',
      priority: 'HIGH' as const,
    },
    {
      label: 'Document process learnings for future properties',
      action: 'document_learnings',
      priority: 'MEDIUM' as const,
    },
  ],
  risks: [
    'Riverside Plaza equity calculation pending restoration completion',
    'Incomplete cost tracking affects ROI accuracy',
  ],
  opportunities: [
    'Tech Center outcome demonstrates 31% property value increase',
    'Oak Street Warehouse exceeded pre-damage value by 7.8%',
    'Portfolio average ROI of 84% significantly above industry benchmark',
  ],
  timestamp: new Date(),
};

export default function EquityPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Equity Outcomes</h1>
          <p className="text-brand-muted mt-1">Measure and document true value creation</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Portfolio Report
        </Button>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-brand-muted">Total Value Created</p>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-success mb-1">
            {formatCurrency(portfolioStats.totalValueCreated)}
          </p>
          <p className="text-xs text-brand-muted">
            across {portfolioStats.completedProjects} completed projects
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-brand-muted">Average ROI</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-brand-secondary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-primary mb-1">
            {formatPercent(portfolioStats.averageROI)}
          </p>
          <p className="text-xs text-brand-success">Above industry average</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-brand-muted">Total Recovered</p>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-brand-success" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-primary mb-1">
            {formatCurrency(portfolioStats.totalClaimsRecovered)}
          </p>
          <p className="text-xs text-brand-muted">
            from insurance claims
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-brand-muted">Recovery Rate</p>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-brand-accent" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand-primary mb-1">
            {formatPercent(portfolioStats.averageRecoveryRate)}
          </p>
          <p className="text-xs text-brand-success">Excellent performance</p>
        </Card>
      </div>

      {/* ATOS Guidance */}
      <ATOSPanel guidance={mockGuidance} compact />

      {/* Property Outcomes */}
      <Card>
        <CardHeader
          title="Property Equity Outcomes"
          subtitle="Before/after analysis with complete value tracking"
        />

        <div className="space-y-6">
          {mockOutcomes.map((outcome) => (
            <div
              key={outcome.id}
              className={`border-2 rounded-lg p-6 ${
                outcome.status === 'COMPLETED'
                  ? 'border-green-200 bg-green-50/30'
                  : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-brand-primary mb-1">
                    {outcome.property}
                  </h3>
                  {outcome.calculatedAt && (
                    <p className="text-sm text-brand-muted">
                      Calculated on {formatDate(outcome.calculatedAt)}
                    </p>
                  )}
                </div>
                <Badge
                  variant={outcome.status === 'COMPLETED' ? 'success' : 'info'}
                  className="text-base px-4 py-1.5"
                >
                  {outcome.status === 'COMPLETED' ? '✓ COMPLETED' : 'IN PROGRESS'}
                </Badge>
              </div>

              {/* Value Progression */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                  <p className="text-xs text-brand-muted mb-2">PRE-DAMAGE VALUE</p>
                  <p className="text-2xl font-bold text-slate-600">
                    {formatCurrency(outcome.preDamageValue)}
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                  <p className="text-xs text-brand-muted mb-2">POST-DAMAGE VALUE</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(outcome.postDamageValue)}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    ↓ {formatCurrency(outcome.preDamageValue - outcome.postDamageValue)} loss
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                  <p className="text-xs text-brand-muted mb-2">POST-RESTORATION VALUE</p>
                  {outcome.postRestorationValue ? (
                    <>
                      <p className="text-2xl font-bold text-brand-success">
                        {formatCurrency(outcome.postRestorationValue)}
                      </p>
                      <p className="text-xs text-brand-success mt-1">
                        ↑ {formatCurrency(outcome.postRestorationValue - outcome.preDamageValue)} gain
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-bold text-slate-400">Pending</p>
                  )}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-200">
                <div>
                  <h4 className="text-sm font-semibold text-brand-primary mb-3">
                    Insurance Recovery
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-brand-muted">Claimed Amount</span>
                      <span className="text-sm font-medium text-brand-primary">
                        {formatCurrency(outcome.totalClaimedAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-brand-muted">Received Amount</span>
                      <span className="text-sm font-medium text-brand-success">
                        {outcome.totalReceivedAmount
                          ? formatCurrency(outcome.totalReceivedAmount)
                          : 'Pending'}
                      </span>
                    </div>
                    {outcome.totalReceivedAmount && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <span className="text-sm font-semibold text-brand-primary">
                          Recovery Rate
                        </span>
                        <span className="text-sm font-bold text-brand-success">
                          {formatPercent(
                            (outcome.totalReceivedAmount / outcome.totalClaimedAmount) * 100
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brand-primary mb-3">
                    Restoration Costs
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-brand-muted">Total Cost</span>
                      <span className="text-sm font-medium text-brand-primary">
                        {formatCurrency(outcome.totalRestorationCost)}
                      </span>
                    </div>
                    {outcome.totalReceivedAmount && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-brand-muted">Insurance Coverage</span>
                          <span className="text-sm font-medium text-brand-success">
                            {formatCurrency(outcome.totalReceivedAmount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                          <span className="text-sm font-semibold text-brand-primary">
                            Net Cost
                          </span>
                          <span className="text-sm font-bold text-brand-primary">
                            {formatCurrency(
                              outcome.totalRestorationCost - outcome.totalReceivedAmount
                            )}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Equity Gain Summary */}
              {outcome.netEquityGain !== null && outcome.roi !== null && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <p className="text-sm text-emerald-700 mb-2 font-medium">
                        NET EQUITY GAIN
                      </p>
                      <p className="text-4xl font-bold text-emerald-600 mb-2">
                        {formatCurrency(outcome.netEquityGain)}
                      </p>
                      <p className="text-xs text-emerald-700">
                        Property value + Insurance recovery - Costs
                      </p>
                    </div>
                    <div className="text-center border-l border-emerald-200 pl-8">
                      <p className="text-sm text-emerald-700 mb-2 font-medium">
                        RETURN ON INVESTMENT
                      </p>
                      <p className="text-4xl font-bold text-emerald-600 mb-2">
                        {formatPercent(outcome.roi)}
                      </p>
                      <p className="text-xs text-emerald-700">
                        {outcome.roi > 80 ? 'Excellent' : outcome.roi > 60 ? 'Good' : 'Fair'}{' '}
                        performance
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                {outcome.status === 'COMPLETED' ? (
                  <>
                    <Button size="sm" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Report
                    </Button>
                    <Button size="sm" variant="secondary">
                      View Detailed Breakdown
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm">Complete Valuation</Button>
                    <Button size="sm" variant="secondary">
                      Update Costs
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Success Factors */}
      <Card>
        <CardHeader
          title="Success Factors Analysis"
          subtitle="Key drivers of equity outcomes across your portfolio"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-brand-primary mb-3">
              Documentation Quality
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">Complete evidence</span>
                <Badge variant="success" size="sm">100%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">Verified assessments</span>
                <Badge variant="success" size="sm">98%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">Avg recovery impact</span>
                <span className="font-semibold text-brand-success">+12%</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-brand-primary mb-3">
              Contractor Performance
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">On-time completion</span>
                <Badge variant="success" size="sm">95%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">Within budget</span>
                <Badge variant="success" size="sm">92%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">Quality score</span>
                <span className="font-semibold text-brand-success">4.8/5.0</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-brand-primary mb-3">
              Claim Strategy
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">Avg recovery rate</span>
                <Badge variant="success" size="sm">92.7%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">Successful appeals</span>
                <Badge variant="success" size="sm">87%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">Avg time to settlement</span>
                <span className="font-semibold text-brand-primary">42 days</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
