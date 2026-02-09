import Link from 'next/link';
import { FileSearch, Plus, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

export default async function InspectionsPage() {
  // Mock data
  const inspections = [
    {
      id: '1',
      propertyId: '1',
      propertyName: 'Riverside Plaza',
      status: 'completed',
      scheduledDate: new Date('2024-09-18'),
      completedDate: new Date('2024-09-18'),
      inspectorName: 'John Smith',
      totalDamageEstimate: 385000,
      damageItemsCount: 23,
    },
    {
      id: '2',
      propertyId: '2',
      propertyName: 'Downtown Office Complex',
      status: 'completed',
      scheduledDate: new Date('2024-09-22'),
      completedDate: new Date('2024-09-22'),
      inspectorName: 'Jane Doe',
      totalDamageEstimate: 275000,
      damageItemsCount: 18,
    },
    {
      id: '3',
      propertyId: '3',
      propertyName: 'Harbor View Retail Center',
      status: 'scheduled',
      scheduledDate: new Date('2024-11-15'),
      inspectorName: 'Mike Johnson',
      totalDamageEstimate: 0,
      damageItemsCount: 0,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-accent-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-primary-500" />;
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-warning-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-dark-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'forensic-badge-success';
      case 'in_progress':
        return 'forensic-badge-primary';
      case 'scheduled':
        return 'forensic-badge-warning';
      default:
        return 'forensic-badge';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Inspections</h1>
          <p className="text-dark-600 mt-2">
            Forensic damage assessments and documentation for insurance claims.
          </p>
        </div>
        <Link
          href="/dashboard/inspections/new"
          className="forensic-button forensic-button-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Schedule Inspection
        </Link>
      </div>

      {/* Stats */}
      <div className="dashboard-stats-grid">
        <div className="metric-card">
          <div className="metric-label">Total Inspections</div>
          <div className="metric-value">{inspections.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Completed</div>
          <div className="metric-value text-accent-600">
            {inspections.filter(i => i.status === 'completed').length}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Scheduled</div>
          <div className="metric-value text-warning-600">
            {inspections.filter(i => i.status === 'scheduled').length}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Damage Assessed</div>
          <div className="metric-value text-dark-900">
            {formatCurrency(inspections.reduce((sum, i) => sum + i.totalDamageEstimate, 0))}
          </div>
        </div>
      </div>

      {/* Inspections List */}
      <div className="forensic-card">
        <div className="forensic-card-header">
          <h2 className="text-xl font-bold text-dark-900">All Inspections</h2>
        </div>
        <div className="forensic-card-body p-0">
          <div className="divide-y divide-dark-200">
            {inspections.map((inspection) => (
              <Link
                key={inspection.id}
                href={`/dashboard/inspections/${inspection.id}`}
                className="block p-6 hover:bg-dark-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(inspection.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-dark-900">
                          {inspection.propertyName}
                        </h3>
                        <span className={`forensic-badge ${getStatusColor(inspection.status)}`}>
                          {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-dark-600">Inspector:</span>
                          <p className="text-dark-900 font-medium">{inspection.inspectorName}</p>
                        </div>
                        <div>
                          <span className="text-dark-600">Scheduled:</span>
                          <p className="text-dark-900 font-medium">
                            {formatDate(inspection.scheduledDate)}
                          </p>
                        </div>
                        <div>
                          <span className="text-dark-600">Damage Items:</span>
                          <p className="text-dark-900 font-medium">
                            {inspection.damageItemsCount || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-dark-600">Total Estimate:</span>
                          <p className="text-dark-900 font-medium">
                            {inspection.totalDamageEstimate > 0
                              ? formatCurrency(inspection.totalDamageEstimate)
                              : 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
