import Link from 'next/link';
import { TrendingUp, DollarSign, Building2, CheckCircle, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function EquityOutcomesPage() {
  // Mock data
  const outcomes = [
    {
      id: '1',
      propertyId: '1',
      propertyName: 'Riverside Plaza',
      preIncidentValue: 2450000,
      postRepairValue: 2580000,
      totalDamageEstimate: 385000,
      insurancePaid: 367000,
      outOfPocketExpenses: 18000,
      totalRepairCost: 352000,
      equityGain: 112000,
      roi: 6.22,
      status: 'completed',
      valuationDate: new Date('2024-10-20'),
    },
    {
      id: '2',
      propertyId: '2',
      propertyName: 'Downtown Office Complex',
      preIncidentValue: 1850000,
      postRepairValue: 1920000,
      totalDamageEstimate: 275000,
      insurancePaid: 0,
      outOfPocketExpenses: 0,
      totalRepairCost: 0,
      equityGain: 70000,
      roi: 0,
      status: 'projected',
      valuationDate: new Date('2024-10-22'),
    },
  ];

  const totalEquityGain = outcomes
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.equityGain, 0);
  
  const avgROI = outcomes
    .filter(o => o.status === 'completed' && o.roi > 0)
    .reduce((sum, o, _, arr) => sum + o.roi / arr.length, 0);

  const totalInsurancePaid = outcomes.reduce((sum, o) => sum + o.insurancePaid, 0);
  const totalProjectedGain = outcomes.reduce((sum, o) => sum + o.equityGain, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Equity Outcomes</h1>
          <p className="text-dark-600 mt-2">
            Track property valuations, equity gains, and ROI across your portfolio.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-stats-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Total Equity Gain</div>
            <TrendingUp className="w-5 h-5 text-accent-500" />
          </div>
          <div className="metric-value text-accent-600">
            {formatCurrency(totalEquityGain)}
          </div>
          <div className="metric-change metric-change-positive">
            Verified outcomes
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Average ROI</div>
            <ArrowUpRight className="w-5 h-5 text-accent-500" />
          </div>
          <div className="metric-value text-accent-600">
            {avgROI.toFixed(2)}%
          </div>
          <div className="text-xs text-dark-600 mt-1">On completed projects</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Insurance Recovered</div>
            <DollarSign className="w-5 h-5 text-primary-500" />
          </div>
          <div className="metric-value text-primary-600">
            {formatCurrency(totalInsurancePaid)}
          </div>
          <div className="text-xs text-dark-600 mt-1">Claim settlements</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Projected Total</div>
            <TrendingUp className="w-5 h-5 text-accent-500" />
          </div>
          <div className="metric-value text-accent-600">
            {formatCurrency(totalProjectedGain)}
          </div>
          <div className="text-xs text-dark-600 mt-1">Including projected</div>
        </div>
      </div>

      {/* Outcomes List */}
      <div className="space-y-6">
        {outcomes.map((outcome) => (
          <div key={outcome.id} className="forensic-card">
            <div className="forensic-card-body">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-1">
                      {outcome.propertyName}
                    </h3>
                    <p className="text-sm text-dark-600">
                      Valuation Date: {formatDate(outcome.valuationDate)}
                    </p>
                  </div>
                </div>
                <span className={`forensic-badge ${
                  outcome.status === 'completed' 
                    ? 'forensic-badge-success' 
                    : 'forensic-badge-primary'
                }`}>
                  {outcome.status === 'completed' ? 'Verified' : 'Projected'}
                </span>
              </div>

              {/* Valuation Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-dark-50 rounded-lg">
                  <div className="text-xs text-dark-600 mb-2">Pre-Incident Value</div>
                  <div className="text-2xl font-bold text-dark-900">
                    {formatCurrency(outcome.preIncidentValue)}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowUpRight className="w-8 h-8 text-accent-500" />
                </div>
                <div className="text-center p-4 bg-accent-50 rounded-lg border border-accent-200">
                  <div className="text-xs text-accent-800 mb-2">Post-Repair Value</div>
                  <div className="text-2xl font-bold text-accent-900">
                    {formatCurrency(outcome.postRepairValue)}
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-dark-200">
                <div>
                  <div className="text-xs text-dark-600 mb-1">Damage Estimate</div>
                  <div className="font-semibold text-dark-900">
                    {formatCurrency(outcome.totalDamageEstimate)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-dark-600 mb-1">Insurance Paid</div>
                  <div className="font-semibold text-primary-600">
                    {formatCurrency(outcome.insurancePaid)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-dark-600 mb-1">Out-of-Pocket</div>
                  <div className="font-semibold text-warning-600">
                    {formatCurrency(outcome.outOfPocketExpenses)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-dark-600 mb-1">Actual Repairs</div>
                  <div className="font-semibold text-dark-900">
                    {outcome.totalRepairCost > 0 
                      ? formatCurrency(outcome.totalRepairCost)
                      : 'In progress'}
                  </div>
                </div>
              </div>

              {/* Equity Gain Highlight */}
              <div className="mt-6 p-6 bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg border border-accent-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-accent-800 mb-1">
                      {outcome.status === 'completed' ? 'Verified Equity Gain' : 'Projected Equity Gain'}
                    </div>
                    <div className="text-3xl font-bold text-accent-900">
                      {formatCurrency(outcome.equityGain)}
                    </div>
                    {outcome.roi > 0 && (
                      <div className="text-sm text-accent-700 mt-2">
                        ROI: {outcome.roi.toFixed(2)}% • +{((outcome.equityGain / outcome.preIncidentValue) * 100).toFixed(1)}% property value increase
                      </div>
                    )}
                  </div>
                  <CheckCircle className="w-12 h-12 text-accent-600" />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex space-x-3">
                <Link
                  href={`/dashboard/equity/${outcome.id}/report`}
                  className="forensic-button forensic-button-primary"
                >
                  View Full Report
                </Link>
                <Link
                  href={`/dashboard/properties/${outcome.propertyId}`}
                  className="forensic-button forensic-button-secondary"
                >
                  View Property
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ATOS Insights */}
      <div className="atos-panel">
        <h3 className="font-bold text-dark-900 mb-3">ATOS Equity Intelligence</h3>
        <div className="space-y-3">
          <div className="atos-message">
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-4 h-4 text-accent-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-dark-900 mb-1">Portfolio Performance</p>
                <p className="text-sm text-dark-600">
                  Your average equity gain of 6.22% ROI exceeds industry benchmarks. 
                  Efficient contractor management and minimal out-of-pocket expenses are key drivers.
                </p>
              </div>
            </div>
          </div>
          <div className="atos-message">
            <div className="flex items-start space-x-2">
              <DollarSign className="w-4 h-4 text-primary-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-dark-900 mb-1">Optimization Opportunity</p>
                <p className="text-sm text-dark-600">
                  Downtown Office repair costs tracking 15% below estimate. 
                  Consider early completion bonus to accelerate project timeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
