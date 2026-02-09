import Link from 'next/link';
import { Users, Plus, Star, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function ContractorsPage() {
  // Mock data
  const contractors = [
    {
      id: '1',
      companyName: 'Elite Restoration Group',
      licenseNumber: 'CG-54321',
      status: 'active',
      specialties: ['Roofing', 'Water Damage', 'Structural'],
      serviceAreas: ['Hillsborough', 'Pinellas', 'Pasco'],
      metrics: {
        completedProjects: 47,
        averageRating: 4.8,
        onTimeCompletionRate: 94,
        complianceScore: 98,
      },
      activeWorkOrders: 3,
      totalContractValue: 685000,
    },
    {
      id: '2',
      companyName: 'Precision Commercial Contractors',
      licenseNumber: 'CG-98765',
      status: 'active',
      specialties: ['HVAC', 'Electrical', 'Plumbing'],
      serviceAreas: ['Hillsborough', 'Pinellas'],
      metrics: {
        completedProjects: 32,
        averageRating: 4.6,
        onTimeCompletionRate: 91,
        complianceScore: 96,
      },
      activeWorkOrders: 2,
      totalContractValue: 420000,
    },
    {
      id: '3',
      companyName: 'Advanced Building Solutions',
      licenseNumber: 'CG-45678',
      status: 'active',
      specialties: ['Interior Restoration', 'Mold Remediation', 'Painting'],
      serviceAreas: ['Hillsborough', 'Pinellas', 'Manatee'],
      metrics: {
        completedProjects: 56,
        averageRating: 4.9,
        onTimeCompletionRate: 97,
        complianceScore: 99,
      },
      activeWorkOrders: 1,
      totalContractValue: 185000,
    },
  ];

  const totalContractors = contractors.length;
  const activeContractors = contractors.filter(c => c.status === 'active').length;
  const totalActiveWorkOrders = contractors.reduce((sum, c) => sum + c.activeWorkOrders, 0);
  const totalContractValue = contractors.reduce((sum, c) => sum + c.totalContractValue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Contractors</h1>
          <p className="text-dark-600 mt-2">
            Manage qualified contractors and track work order execution.
          </p>
        </div>
        <Link
          href="/dashboard/contractors/new"
          className="forensic-button forensic-button-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Contractor
        </Link>
      </div>

      {/* Stats */}
      <div className="dashboard-stats-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Total Contractors</div>
            <Users className="w-5 h-5 text-primary-500" />
          </div>
          <div className="metric-value">{totalContractors}</div>
          <div className="metric-change metric-change-positive">
            {activeContractors} active
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Active Work Orders</div>
            <Clock className="w-5 h-5 text-primary-500" />
          </div>
          <div className="metric-value">{totalActiveWorkOrders}</div>
          <div className="text-xs text-dark-600 mt-1">In progress</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Total Contract Value</div>
            <TrendingUp className="w-5 h-5 text-accent-500" />
          </div>
          <div className="metric-value text-accent-600">
            {formatCurrency(totalContractValue)}
          </div>
          <div className="text-xs text-dark-600 mt-1">Active contracts</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Avg Rating</div>
            <Star className="w-5 h-5 text-warning-500" />
          </div>
          <div className="metric-value">
            {(contractors.reduce((sum, c) => sum + c.metrics.averageRating, 0) / contractors.length).toFixed(1)}
          </div>
          <div className="text-xs text-dark-600 mt-1">Out of 5.0</div>
        </div>
      </div>

      {/* Contractors Grid */}
      <div className="grid grid-cols-1 gap-6">
        {contractors.map((contractor) => (
          <Link
            key={contractor.id}
            href={`/dashboard/contractors/${contractor.id}`}
            className="forensic-card hover:shadow-forensic transition-all"
          >
            <div className="forensic-card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-1">
                      {contractor.companyName}
                    </h3>
                    <p className="text-sm text-dark-600 mb-2">
                      License: {contractor.licenseNumber}
                    </p>
                    <div className="flex items-center space-x-2">
                      {contractor.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="forensic-badge forensic-badge-primary text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-warning-500 fill-warning-500" />
                  <span className="text-lg font-bold text-dark-900">
                    {contractor.metrics.averageRating}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-dark-200">
                <div>
                  <div className="text-xs text-dark-600 mb-1">Completed</div>
                  <div className="font-semibold text-dark-900">
                    {contractor.metrics.completedProjects} projects
                  </div>
                </div>
                <div>
                  <div className="text-xs text-dark-600 mb-1">On-Time Rate</div>
                  <div className="font-semibold text-accent-600">
                    {contractor.metrics.onTimeCompletionRate}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-dark-600 mb-1">Compliance</div>
                  <div className="font-semibold text-accent-600">
                    {contractor.metrics.complianceScore}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-dark-600 mb-1">Active Work</div>
                  <div className="font-semibold text-primary-600">
                    {contractor.activeWorkOrders} orders
                  </div>
                </div>
                <div>
                  <div className="text-xs text-dark-600 mb-1">Contract Value</div>
                  <div className="font-semibold text-dark-900">
                    {formatCurrency(contractor.totalContractValue)}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ATOS Guidance */}
      <div className="atos-panel">
        <h3 className="font-bold text-dark-900 mb-3">ATOS Contractor Intelligence</h3>
        <div className="space-y-3">
          <div className="atos-message">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-dark-900 mb-1">Top Performer</p>
                <p className="text-sm text-dark-600">
                  Advanced Building Solutions maintains 99% compliance score and 97% on-time completion. 
                  Recommended for interior restoration work.
                </p>
              </div>
            </div>
          </div>
          <div className="atos-message">
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-4 h-4 text-primary-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-dark-900 mb-1">Capacity Available</p>
                <p className="text-sm text-dark-600">
                  Elite Restoration Group has capacity for 2 additional projects. 
                  Ideal for upcoming roofing work at Harbor View.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
