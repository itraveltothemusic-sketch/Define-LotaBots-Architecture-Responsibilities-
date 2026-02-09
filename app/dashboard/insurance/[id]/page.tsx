import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowLeft, DollarSign, Calendar, User, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function ClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Mock data
  const claim = {
    id,
    propertyId: '1',
    propertyName: 'Riverside Plaza',
    claimNumber: 'CLM-2024-001234',
    carrier: 'National Property Insurance',
    policyNumber: 'POL-87654321',
    status: 'approved',
    claimedAmount: 385000,
    approvedAmount: 367000,
    paidAmount: 367000,
    deductible: 25000,
    incidentDate: new Date('2024-09-15'),
    submittedDate: new Date('2024-09-25'),
    approvedDate: new Date('2024-10-15'),
    adjusterId: '123',
    adjusterName: 'Sarah Williams',
    adjusterEmail: 'sarah.williams@npi.com',
  };

  if (!claim) {
    notFound();
  }

  const discrepancy = claim.claimedAmount - (claim.approvedAmount || 0);

  // Mock scope data
  const forensicScope = [
    { id: '1', category: 'Roof Repair', description: 'TPO membrane replacement', quantity: 15000, unit: 'sq ft', unitPrice: 12, totalPrice: 180000 },
    { id: '2', category: 'Water Damage', description: 'Interior restoration and mold remediation', quantity: 8500, unit: 'sq ft', unitPrice: 15, totalPrice: 127500 },
    { id: '3', category: 'HVAC', description: 'Replace damaged rooftop units', quantity: 3, unit: 'units', unitPrice: 25000, totalPrice: 75000 },
    { id: '4', category: 'Electrical', description: 'Repair water-damaged circuits', quantity: 1, unit: 'allowance', unitPrice: 2500, totalPrice: 2500 },
  ];

  const insuranceScope = [
    { id: '1', category: 'Roof Repair', description: 'TPO membrane replacement', quantity: 15000, unit: 'sq ft', unitPrice: 11, totalPrice: 165000 },
    { id: '2', category: 'Water Damage', description: 'Interior restoration', quantity: 8500, unit: 'sq ft', unitPrice: 14, totalPrice: 119000 },
    { id: '3', category: 'HVAC', description: 'Replace damaged rooftop units', quantity: 3, unit: 'units', unitPrice: 24000, totalPrice: 72000 },
    { id: '4', category: 'Electrical', description: 'Repair water-damaged circuits', quantity: 1, unit: 'allowance', unitPrice: 2000, totalPrice: 2000 },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/insurance"
        className="inline-flex items-center text-sm text-dark-600 hover:text-dark-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Claims
      </Link>

      {/* Header */}
      <div className="forensic-card">
        <div className="forensic-card-body">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-dark-900 mb-2">
                  {claim.propertyName}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-dark-600">
                  <span>{claim.claimNumber}</span>
                  <span>•</span>
                  <span className="forensic-badge forensic-badge-success">
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <Link
              href={`/dashboard/insurance/${id}/edit`}
              className="forensic-button forensic-button-secondary"
            >
              Edit Claim
            </Link>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="dashboard-stats-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Claimed Amount</div>
            <DollarSign className="w-5 h-5 text-primary-500" />
          </div>
          <div className="metric-value">{formatCurrency(claim.claimedAmount)}</div>
          <div className="text-xs text-dark-600 mt-1">Forensic assessment</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Approved Amount</div>
            <CheckCircle className="w-5 h-5 text-accent-500" />
          </div>
          <div className="metric-value text-accent-600">
            {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : 'Pending'}
          </div>
          <div className="text-xs text-dark-600 mt-1">
            {claim.approvedAmount ? `${((claim.approvedAmount / claim.claimedAmount) * 100).toFixed(1)}% of claimed` : 'Under review'}
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Paid to Date</div>
            <DollarSign className="w-5 h-5 text-accent-500" />
          </div>
          <div className="metric-value text-accent-600">
            {claim.paidAmount ? formatCurrency(claim.paidAmount) : '$0'}
          </div>
          <div className="text-xs text-dark-600 mt-1">Settlement received</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Discrepancy</div>
            <AlertTriangle className="w-5 h-5 text-warning-500" />
          </div>
          <div className="metric-value text-warning-600">
            {discrepancy > 0 ? formatCurrency(discrepancy) : '$0'}
          </div>
          <div className="text-xs text-warning-600 mt-1">
            {discrepancy > 0 ? 'Supplement recommended' : 'No discrepancy'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claim Information */}
          <div className="forensic-card">
            <div className="forensic-card-header">
              <h2 className="text-xl font-bold text-dark-900">Claim Information</h2>
            </div>
            <div className="forensic-card-body">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-dark-600">Insurance Carrier</label>
                  <p className="text-dark-900 mt-1">{claim.carrier}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-600">Policy Number</label>
                  <p className="text-dark-900 mt-1">{claim.policyNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-600">Adjuster</label>
                  <p className="text-dark-900 mt-1">{claim.adjusterName}</p>
                  <p className="text-sm text-dark-600 mt-1">{claim.adjusterEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-600">Deductible</label>
                  <p className="text-dark-900 mt-1">{formatCurrency(claim.deductible)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-600">Incident Date</label>
                  <p className="text-dark-900 mt-1">{formatDate(claim.incidentDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-600">Submitted Date</label>
                  <p className="text-dark-900 mt-1">
                    {claim.submittedDate ? formatDate(claim.submittedDate) : 'Not submitted'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scope Comparison */}
          <div className="forensic-card">
            <div className="forensic-card-header flex items-center justify-between">
              <h2 className="text-xl font-bold text-dark-900">Scope Comparison</h2>
              {discrepancy > 0 && (
                <button className="forensic-button forensic-button-primary text-sm">
                  Generate Supplement
                </button>
              )}
            </div>
            <div className="forensic-card-body p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-50 border-b border-dark-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-dark-600 uppercase">Category</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-dark-600 uppercase">Description</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-dark-600 uppercase">Forensic</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-dark-600 uppercase">Insurance</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-dark-600 uppercase">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-200">
                    {forensicScope.map((item, index) => {
                      const insuranceItem = insuranceScope[index];
                      const delta = item.totalPrice - insuranceItem.totalPrice;
                      
                      return (
                        <tr key={item.id} className={delta > 0 ? 'bg-warning-50' : ''}>
                          <td className="px-6 py-4 text-sm font-medium text-dark-900">{item.category}</td>
                          <td className="px-6 py-4 text-sm text-dark-600">{item.description}</td>
                          <td className="px-6 py-4 text-sm text-right font-medium text-dark-900">
                            {formatCurrency(item.totalPrice)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right font-medium text-dark-900">
                            {formatCurrency(insuranceItem.totalPrice)}
                          </td>
                          <td className={`px-6 py-4 text-sm text-right font-semibold ${
                            delta > 0 ? 'text-warning-600' : 'text-accent-600'
                          }`}>
                            {delta > 0 ? `+${formatCurrency(delta)}` : formatCurrency(delta)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-dark-50 border-t-2 border-dark-300">
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-sm font-bold text-dark-900">Total</td>
                      <td className="px-6 py-4 text-sm text-right font-bold text-dark-900">
                        {formatCurrency(claim.claimedAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-bold text-dark-900">
                        {formatCurrency(claim.approvedAmount || 0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-bold text-warning-600">
                        +{formatCurrency(discrepancy)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* ATOS Analysis */}
          <div className="atos-panel">
            <h3 className="font-bold text-dark-900 mb-3">ATOS Analysis</h3>
            <div className="space-y-3">
              {discrepancy > 0 && (
                <div className="atos-message">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-dark-900 mb-1">Scope Discrepancy</p>
                      <p className="text-sm text-dark-600">
                        Insurance estimate is {formatCurrency(discrepancy)} lower than forensic assessment. 
                        Primary differences in unit pricing and mold remediation scope.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="atos-message">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-dark-900 mb-1">Claim Approved</p>
                    <p className="text-sm text-dark-600">
                      Carrier approved {((claim.approvedAmount! / claim.claimedAmount) * 100).toFixed(1)}% of claimed amount. 
                      Above industry average of 92%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 forensic-button forensic-button-primary">
              Ask ATOS About This Claim
            </button>
          </div>

          {/* Quick Actions */}
          <div className="forensic-card">
            <div className="forensic-card-header">
              <h3 className="font-bold text-dark-900">Actions</h3>
            </div>
            <div className="forensic-card-body space-y-2">
              <button className="w-full forensic-button forensic-button-secondary text-sm justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Download Claim Package
              </button>
              <button className="w-full forensic-button forensic-button-secondary text-sm justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Log Interaction
              </button>
              <button className="w-full forensic-button forensic-button-secondary text-sm justify-start">
                <User className="w-4 h-4 mr-2" />
                Contact Adjuster
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
