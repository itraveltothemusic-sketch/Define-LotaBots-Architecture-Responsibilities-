import Link from 'next/link';
import { Shield, Plus, DollarSign, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { ClaimStatus } from '@/types';

export default async function InsuranceClaimsPage() {
  // Mock data
  const claims = [
    {
      id: '1',
      propertyId: '1',
      propertyName: 'Riverside Plaza',
      claimNumber: 'CLM-2024-001234',
      carrier: 'National Property Insurance',
      status: 'approved' as ClaimStatus,
      claimedAmount: 385000,
      approvedAmount: 367000,
      paidAmount: 367000,
      submittedDate: new Date('2024-09-25'),
      approvedDate: new Date('2024-10-15'),
    },
    {
      id: '2',
      propertyId: '2',
      propertyName: 'Downtown Office Complex',
      claimNumber: 'CLM-2024-001235',
      carrier: 'Coastal Insurance Group',
      status: 'under_review' as ClaimStatus,
      claimedAmount: 275000,
      submittedDate: new Date('2024-09-28'),
    },
    {
      id: '3',
      propertyId: '3',
      propertyName: 'Harbor View Retail Center',
      claimNumber: null,
      carrier: 'Atlantic Commercial Insurance',
      status: 'draft' as ClaimStatus,
      claimedAmount: 520000,
    },
  ];

  const getStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case 'approved':
      case 'settled':
        return <CheckCircle className="w-5 h-5 text-accent-500" />;
      case 'under_review':
      case 'submitted':
        return <Clock className="w-5 h-5 text-primary-500" />;
      case 'additional_info_required':
        return <AlertCircle className="w-5 h-5 text-warning-500" />;
      case 'denied':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Shield className="w-5 h-5 text-dark-400" />;
    }
  };

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case 'approved':
      case 'settled':
        return 'forensic-badge-success';
      case 'under_review':
      case 'submitted':
        return 'forensic-badge-primary';
      case 'additional_info_required':
        return 'forensic-badge-warning';
      case 'denied':
        return 'forensic-badge-danger';
      default:
        return 'forensic-badge';
    }
  };

  const getStatusLabel = (status: ClaimStatus) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const totalClaimed = claims.reduce((sum, c) => sum + c.claimedAmount, 0);
  const totalApproved = claims.reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
  const totalPaid = claims.reduce((sum, c) => sum + (c.paidAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Insurance Claims</h1>
          <p className="text-dark-600 mt-2">
            Track claim lifecycles, scope comparisons, and settlement outcomes.
          </p>
        </div>
        <Link
          href="/dashboard/insurance/new"
          className="forensic-button forensic-button-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          File New Claim
        </Link>
      </div>

      {/* Stats */}
      <div className="dashboard-stats-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Total Claims</div>
            <Shield className="w-5 h-5 text-primary-500" />
          </div>
          <div className="metric-value">{claims.length}</div>
          <div className="metric-change metric-change-positive">
            {claims.filter(c => c.status === 'approved' || c.status === 'settled').length} approved
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Total Claimed</div>
            <DollarSign className="w-5 h-5 text-primary-500" />
          </div>
          <div className="metric-value">{formatCurrency(totalClaimed)}</div>
          <div className="text-xs text-dark-600 mt-1">Forensic assessments</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Total Approved</div>
            <CheckCircle className="w-5 h-5 text-accent-500" />
          </div>
          <div className="metric-value text-accent-600">{formatCurrency(totalApproved)}</div>
          <div className="metric-change metric-change-positive">
            {totalApproved > 0 ? `${((totalApproved / totalClaimed) * 100).toFixed(1)}% of claimed` : 'Pending'}
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Total Paid</div>
            <TrendingUp className="w-5 h-5 text-accent-500" />
          </div>
          <div className="metric-value text-accent-600">{formatCurrency(totalPaid)}</div>
          <div className="metric-change metric-change-positive">
            {totalPaid > 0 ? `${((totalPaid / totalApproved) * 100).toFixed(0)}% of approved` : 'Pending'}
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="forensic-card">
        <div className="forensic-card-header">
          <h2 className="text-xl font-bold text-dark-900">All Claims</h2>
        </div>
        <div className="forensic-card-body p-0">
          <div className="divide-y divide-dark-200">
            {claims.map((claim) => (
              <Link
                key={claim.id}
                href={`/dashboard/insurance/${claim.id}`}
                className="block p-6 hover:bg-dark-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(claim.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-dark-900 mb-1">
                        {claim.propertyName}
                      </h3>
                      <p className="text-sm text-dark-600">
                        {claim.claimNumber || 'Draft - Not yet submitted'}
                      </p>
                    </div>
                  </div>
                  <span className={`forensic-badge ${getStatusColor(claim.status)}`}>
                    {getStatusLabel(claim.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-dark-600">Carrier:</span>
                    <p className="text-dark-900 font-medium">{claim.carrier}</p>
                  </div>
                  <div>
                    <span className="text-dark-600">Claimed Amount:</span>
                    <p className="text-dark-900 font-medium">
                      {formatCurrency(claim.claimedAmount)}
                    </p>
                  </div>
                  <div>
                    <span className="text-dark-600">Approved Amount:</span>
                    <p className="text-dark-900 font-medium">
                      {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : 'Pending'}
                    </p>
                  </div>
                  <div>
                    <span className="text-dark-600">Submitted:</span>
                    <p className="text-dark-900 font-medium">
                      {claim.submittedDate ? formatDate(claim.submittedDate) : 'Not submitted'}
                    </p>
                  </div>
                </div>

                {/* Discrepancy Warning */}
                {claim.approvedAmount && claim.approvedAmount < claim.claimedAmount && (
                  <div className="mt-4 flex items-center space-x-2 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-warning-600 flex-shrink-0" />
                    <p className="text-xs text-warning-800">
                      Discrepancy detected: {formatCurrency(claim.claimedAmount - claim.approvedAmount)} difference. 
                      Consider supplement request.
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ATOS Guidance */}
      <div className="atos-panel">
        <h3 className="font-bold text-dark-900 mb-3">ATOS Insurance Intelligence</h3>
        <div className="space-y-3">
          <div className="atos-message">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-dark-900 mb-1">Scope Discrepancy Detected</p>
                <p className="text-sm text-dark-600">
                  Riverside Plaza: Insurance approved $18K less than forensic assessment. 
                  Recommend supplement request for concealed damage items.
                </p>
              </div>
            </div>
          </div>
          <div className="atos-message">
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-primary-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-dark-900 mb-1">Pending Review</p>
                <p className="text-sm text-dark-600">
                  Downtown Office claim has been under review for 17 days. 
                  Average carrier response time: 14-21 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
