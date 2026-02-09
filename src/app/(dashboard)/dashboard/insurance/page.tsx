/**
 * Insurance Intelligence Module
 * 
 * Complete claim lifecycle tracking, carrier interaction logging,
 * and automatic scope discrepancy detection.
 */

'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ATOSPanel } from '@/components/atos/ATOSPanel';
import { formatCurrency, formatDate, formatPercent } from '@/lib/utils/format';
import { FileText, Plus, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Phone, Mail, Calendar } from 'lucide-react';

// Mock data
const mockClaims = [
  {
    id: '1',
    claimNumber: 'CLM-2024-1547',
    property: 'Riverside Plaza',
    carrier: 'Liberty Mutual',
    policyNumber: 'POL-887654',
    status: 'UNDER_REVIEW',
    dateOfLoss: new Date('2023-12-10'),
    dateSubmitted: new Date('2024-01-05'),
    claimedAmount: 875000,
    approvedAmount: null,
    deductible: 25000,
    discrepancies: 2,
    lastContact: new Date('2024-01-18'),
  },
  {
    id: '2',
    claimNumber: 'CLM-2024-1623',
    property: 'Tech Center Building',
    carrier: 'State Farm',
    policyNumber: 'POL-334521',
    status: 'APPROVED',
    dateOfLoss: new Date('2023-12-15'),
    dateSubmitted: new Date('2024-01-08'),
    claimedAmount: 1250000,
    approvedAmount: 1180000,
    deductible: 50000,
    discrepancies: 0,
    lastContact: new Date('2024-01-20'),
  },
  {
    id: '3',
    claimNumber: 'CLM-2024-1701',
    property: 'Downtown Retail Complex',
    carrier: 'Travelers Insurance',
    policyNumber: 'POL-992847',
    status: 'NEGOTIATION',
    dateOfLoss: new Date('2023-12-12'),
    dateSubmitted: new Date('2024-01-10'),
    claimedAmount: 2100000,
    approvedAmount: 1850000,
    deductible: 75000,
    discrepancies: 5,
    lastContact: new Date('2024-01-19'),
  },
];

const mockDiscrepancies = [
  {
    id: '1',
    claimId: '3',
    category: 'STRUCTURAL',
    ourScope: 'Full structural reinforcement with steel beam replacement',
    adjustersScope: 'Partial reinforcement, cosmetic repairs only',
    ourCost: 285000,
    adjustersCost: 120000,
    variance: -165000,
    variancePercent: -57.9,
    flagged: true,
  },
  {
    id: '2',
    claimId: '3',
    category: 'ROOF',
    ourScope: 'Complete roof replacement due to wind damage',
    adjustersScope: 'Partial patching and repairs',
    ourCost: 180000,
    adjustersCost: 85000,
    variance: -95000,
    variancePercent: -52.8,
    flagged: true,
  },
  {
    id: '3',
    claimId: '1',
    category: 'WATER',
    ourScope: 'Complete water remediation including drywall replacement',
    adjustersScope: 'Drying only, minimal replacement',
    ourCost: 65000,
    adjustersCost: 28000,
    variance: -37000,
    variancePercent: -56.9,
    flagged: true,
  },
];

const mockGuidance = {
  id: '1',
  context: {
    userId: 'user1',
    currentModule: 'insurance' as const,
    recentActivity: [],
  },
  guidance: 'Downtown Retail Complex claim shows significant scope discrepancies totaling $250K+ variance. This requires immediate attention with documented counter-evidence.',
  reasoning: 'Discrepancies exceeding 50% variance typically indicate adjuster undervaluation. Your forensic documentation provides strong leverage for negotiation or appeal. Fast response prevents claim timeline delays.',
  suggestedActions: [
    {
      label: 'Prepare detailed rebuttal for structural scope',
      action: 'prepare_rebuttal',
      priority: 'HIGH' as const,
    },
    {
      label: 'Schedule carrier meeting to discuss discrepancies',
      action: 'schedule_meeting',
      priority: 'HIGH' as const,
    },
    {
      label: 'Gather independent engineering assessment',
      action: 'get_assessment',
      priority: 'HIGH' as const,
    },
  ],
  risks: [
    'Accepting current offer leaves $250K on table',
    'Riverside Plaza approaching 30-day response deadline',
    'Missing carrier interactions reduce appeal strength',
  ],
  opportunities: [
    'Tech Center approved at 94% - excellent benchmark',
    'Hidden damage discovered during work can reopen claims',
    'Recent precedent in similar cases supports full scope claims',
  ],
  timestamp: new Date(),
};

export default function InsurancePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Insurance Intelligence</h1>
          <p className="text-brand-muted mt-1">Track claims with carrier-grade precision</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Claim
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-brand-muted mb-1">Total Claimed</p>
          <p className="text-3xl font-bold text-brand-primary mb-2">
            {formatCurrency(4225000)}
          </p>
          <p className="text-xs text-brand-muted">across 3 active claims</p>
        </Card>

        <Card>
          <p className="text-sm text-brand-muted mb-1">Approved Amount</p>
          <p className="text-3xl font-bold text-brand-success mb-2">
            {formatCurrency(3030000)}
          </p>
          <p className="text-xs text-brand-success">71.7% of total claimed</p>
        </Card>

        <Card>
          <p className="text-sm text-brand-muted mb-1">In Negotiation</p>
          <p className="text-3xl font-bold text-brand-accent mb-2">
            {formatCurrency(250000)}
          </p>
          <p className="text-xs text-brand-muted">5 discrepancies flagged</p>
        </Card>

        <Card>
          <p className="text-sm text-brand-muted mb-1">Avg Recovery Rate</p>
          <p className="text-3xl font-bold text-brand-primary mb-2">
            94.4%
          </p>
          <p className="text-xs text-brand-success">Above industry average</p>
        </Card>
      </div>

      {/* ATOS Guidance */}
      <ATOSPanel guidance={mockGuidance} compact />

      {/* Active Claims */}
      <Card>
        <CardHeader
          title="Active Claims"
          subtitle="All claims requiring attention or monitoring"
        />

        <div className="space-y-4">
          {mockClaims.map((claim) => (
            <div
              key={claim.id}
              className="border border-slate-200 rounded-lg p-5 hover:border-brand-secondary transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-brand-primary">
                      {claim.claimNumber}
                    </h3>
                    <Badge
                      variant={
                        claim.status === 'APPROVED' ? 'success' :
                        claim.status === 'UNDER_REVIEW' ? 'info' :
                        claim.status === 'NEGOTIATION' ? 'warning' :
                        'default'
                      }
                    >
                      {claim.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-brand-muted">{claim.property}</p>
                  <p className="text-xs text-brand-muted mt-1">
                    {claim.carrier} • Policy: {claim.policyNumber}
                  </p>
                </div>
                {claim.discrepancies > 0 && (
                  <Badge variant="warning" className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {claim.discrepancies} Discrepancies
                  </Badge>
                )}
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs text-brand-muted mb-0.5">Date of Loss</p>
                  <p className="text-sm font-medium text-brand-primary">
                    {formatDate(claim.dateOfLoss)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-muted mb-0.5">Date Submitted</p>
                  <p className="text-sm font-medium text-brand-primary">
                    {formatDate(claim.dateSubmitted)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-muted mb-0.5">Last Contact</p>
                  <p className="text-sm font-medium text-brand-primary">
                    {formatDate(claim.lastContact)}
                  </p>
                </div>
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-brand-muted mb-1">Claimed Amount</p>
                  <p className="text-lg font-bold text-brand-primary">
                    {formatCurrency(claim.claimedAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-muted mb-1">
                    {claim.approvedAmount ? 'Approved Amount' : 'Under Review'}
                  </p>
                  <p className="text-lg font-bold text-brand-success">
                    {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-muted mb-1">Deductible</p>
                  <p className="text-lg font-bold text-slate-600">
                    {formatCurrency(claim.deductible)}
                  </p>
                </div>
              </div>

              {/* Variance Indicator */}
              {claim.approvedAmount && (
                <div className="mb-4">
                  {claim.approvedAmount < claim.claimedAmount ? (
                    <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 px-3 py-2 rounded">
                      <TrendingDown className="w-4 h-4" />
                      <span>
                        {formatCurrency(claim.claimedAmount - claim.approvedAmount)} variance
                        ({formatPercent(((claim.claimedAmount - claim.approvedAmount) / claim.claimedAmount) * 100)})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-green-800 bg-green-50 px-3 py-2 rounded">
                      <CheckCircle className="w-4 h-4" />
                      <span>Full approval - {formatPercent((claim.approvedAmount / claim.claimedAmount) * 100)} recovery</span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">
                  <Phone className="w-4 h-4 mr-1.5" />
                  Log Contact
                </Button>
                <Button size="sm" variant="secondary">
                  <Mail className="w-4 h-4 mr-1.5" />
                  Send Update
                </Button>
                <Button size="sm" variant="secondary">
                  <FileText className="w-4 h-4 mr-1.5" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Scope Discrepancies */}
      <Card>
        <CardHeader
          title="Flagged Scope Discrepancies"
          subtitle="Significant variances requiring attention"
        />

        <div className="space-y-3">
          {mockDiscrepancies.map((discrepancy) => (
            <div
              key={discrepancy.id}
              className="border border-amber-200 bg-amber-50/50 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-brand-accent" />
                  <h4 className="font-semibold text-brand-primary">
                    {discrepancy.category} Scope Discrepancy
                  </h4>
                </div>
                <Badge variant="warning">
                  {formatPercent(Math.abs(discrepancy.variancePercent))} variance
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs font-medium text-brand-primary mb-1">Your Scope</p>
                  <p className="text-sm text-slate-700">{discrepancy.ourScope}</p>
                  <p className="text-lg font-bold text-brand-primary mt-2">
                    {formatCurrency(discrepancy.ourCost)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-brand-primary mb-1">Adjuster's Scope</p>
                  <p className="text-sm text-slate-700">{discrepancy.adjustersScope}</p>
                  <p className="text-lg font-bold text-slate-600 mt-2">
                    {formatCurrency(discrepancy.adjustersCost)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-amber-200">
                <div className="flex items-center gap-2 text-brand-danger">
                  <TrendingDown className="w-4 h-4" />
                  <span className="font-semibold">
                    {formatCurrency(Math.abs(discrepancy.variance))} under-valued
                  </span>
                </div>
                <Button size="sm">
                  Prepare Counter-Evidence
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
