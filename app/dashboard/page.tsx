import { getCurrentUser } from '@/lib/auth';
import { 
  Building2, 
  FileSearch, 
  Shield, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function IntelligenceCenterPage() {
  const user = await getCurrentUser();

  // Mock data - will be replaced with real database queries
  const stats = {
    totalProperties: 12,
    activeInspections: 3,
    activeClaims: 8,
    totalEquityGain: 4250000,
  };

  const recentActivity = [
    {
      id: '1',
      type: 'inspection',
      title: 'Inspection completed for Riverside Plaza',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'completed',
    },
    {
      id: '2',
      type: 'claim',
      title: 'Insurance claim approved for Downtown Office',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'approved',
    },
    {
      id: '3',
      type: 'atos',
      title: 'ATOS detected scope discrepancy in Harbor View claim',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: 'warning',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-900">Intelligence Center</h1>
        <p className="text-dark-600 mt-2">
          Welcome back, {user?.firstName}. Here's your property portfolio overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="metric-label">Total Properties</div>
            <Building2 className="w-5 h-5 text-primary-500" />
          </div>
          <div className="metric-value">{stats.totalProperties}</div>
          <div className="metric-change metric-change-positive">
            +2 this month
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="metric-label">Active Inspections</div>
            <FileSearch className="w-5 h-5 text-primary-500" />
          </div>
          <div className="metric-value">{stats.activeInspections}</div>
          <div className="metric-change metric-change-positive">
            3 scheduled
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="metric-label">Active Claims</div>
            <Shield className="w-5 h-5 text-primary-500" />
          </div>
          <div className="metric-value">{stats.activeClaims}</div>
          <div className="metric-change metric-change-positive">
            4 pending review
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="metric-label">Total Equity Gain</div>
            <TrendingUp className="w-5 h-5 text-accent-500" />
          </div>
          <div className="metric-value text-accent-600">
            {formatCurrency(stats.totalEquityGain)}
          </div>
          <div className="metric-change metric-change-positive">
            +$850K this quarter
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 forensic-card">
          <div className="forensic-card-header">
            <h2 className="text-xl font-bold text-dark-900">Recent Activity</h2>
          </div>
          <div className="forensic-card-body">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 bg-dark-50 rounded-lg hover:bg-dark-100 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {activity.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-accent-500" />
                    )}
                    {activity.status === 'approved' && (
                      <CheckCircle className="w-5 h-5 text-accent-500" />
                    )}
                    {activity.status === 'warning' && (
                      <AlertCircle className="w-5 h-5 text-warning-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-dark-600 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ATOS Guidance Panel */}
        <div className="atos-panel">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ATOS</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark-900">AI Assistant</h3>
              <p className="text-xs text-dark-600">Forensic Intelligence</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="atos-message">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-dark-900 mb-1">
                    Action Required
                  </p>
                  <p className="text-sm text-dark-600">
                    Harbor View claim shows $47K discrepancy in roof scope. 
                    Review and submit supplement request.
                  </p>
                </div>
              </div>
            </div>

            <div className="atos-message">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-dark-900 mb-1">
                    Opportunity Detected
                  </p>
                  <p className="text-sm text-dark-600">
                    Riverside Plaza repair costs came in 12% under estimate. 
                    Projected equity gain: +$32K.
                  </p>
                </div>
              </div>
            </div>

            <div className="atos-message">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-primary-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-dark-900 mb-1">
                    Upcoming Deadline
                  </p>
                  <p className="text-sm text-dark-600">
                    Downtown Office inspection scheduled for tomorrow at 10 AM. 
                    Documentation checklist prepared.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 forensic-button forensic-button-primary">
            Ask ATOS
          </button>
        </div>
      </div>

      {/* Properties Overview */}
      <div className="forensic-card">
        <div className="forensic-card-header flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark-900">Properties Overview</h2>
          <button className="forensic-button forensic-button-secondary text-sm">
            View All
          </button>
        </div>
        <div className="forensic-card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mock property cards */}
            {[
              { name: 'Riverside Plaza', status: 'Claim Submitted', value: 2450000 },
              { name: 'Downtown Office', status: 'Repair In Progress', value: 1850000 },
              { name: 'Harbor View', status: 'Inspection Pending', value: 3200000 },
            ].map((property) => (
              <div
                key={property.name}
                className="border border-dark-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-dark-900">{property.name}</h3>
                    <p className="text-xs text-dark-600 mt-1">Commercial Office</p>
                  </div>
                  <Building2 className="w-5 h-5 text-dark-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-600">Status</span>
                    <span className="forensic-badge forensic-badge-primary">
                      {property.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-600">Value</span>
                    <span className="font-semibold text-dark-900">
                      {formatCurrency(property.value)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
