import Link from 'next/link';
import { Building2, Plus, MapPin, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Property } from '@/types';

export default async function PropertiesPage() {
  // Mock data - will be replaced with real database queries
  const properties: Partial<Property>[] = [
    {
      id: '1',
      name: 'Riverside Plaza',
      type: 'commercial',
      status: 'claim_submitted',
      address: {
        street: '123 River Road',
        city: 'Tampa',
        state: 'FL',
        zip: '33602',
        county: 'Hillsborough',
      },
      squareFootage: 45000,
      preIncidentValue: 2450000,
      estimatedRepairCost: 385000,
      incidentDate: new Date('2024-09-15'),
    },
    {
      id: '2',
      name: 'Downtown Office Complex',
      type: 'office',
      status: 'repair_in_progress',
      address: {
        street: '456 Main Street',
        city: 'Tampa',
        state: 'FL',
        zip: '33601',
        county: 'Hillsborough',
      },
      squareFootage: 32000,
      preIncidentValue: 1850000,
      estimatedRepairCost: 275000,
      incidentDate: new Date('2024-09-20'),
    },
    {
      id: '3',
      name: 'Harbor View Retail Center',
      type: 'retail',
      status: 'inspection_pending',
      address: {
        street: '789 Harbor Drive',
        city: 'St. Petersburg',
        state: 'FL',
        zip: '33701',
        county: 'Pinellas',
      },
      squareFootage: 28000,
      preIncidentValue: 3200000,
      estimatedRepairCost: 520000,
      incidentDate: new Date('2024-10-01'),
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'forensic-badge-success',
      inspection_pending: 'forensic-badge-warning',
      claim_submitted: 'forensic-badge-primary',
      repair_in_progress: 'forensic-badge-primary',
      completed: 'forensic-badge-success',
      closed: 'bg-dark-100 text-dark-600',
    };
    return colors[status] || 'forensic-badge';
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Properties</h1>
          <p className="text-dark-600 mt-2">
            Manage your commercial property portfolio and track damage assessments.
          </p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="forensic-button forensic-button-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="dashboard-stats-grid">
        <div className="metric-card">
          <div className="metric-label">Total Properties</div>
          <div className="metric-value">{properties.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Portfolio Value</div>
          <div className="metric-value text-primary-600">
            {formatCurrency(properties.reduce((sum, p) => sum + (p.preIncidentValue || 0), 0))}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Estimated Repairs</div>
          <div className="metric-value text-warning-600">
            {formatCurrency(properties.reduce((sum, p) => sum + (p.estimatedRepairCost || 0), 0))}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Active Claims</div>
          <div className="metric-value">{properties.filter(p => p.status === 'claim_submitted').length}</div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {properties.map((property) => (
          <Link
            key={property.id}
            href={`/dashboard/properties/${property.id}`}
            className="forensic-card hover:shadow-forensic transition-all"
          >
            <div className="forensic-card-body">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark-900">{property.name}</h3>
                    <p className="text-sm text-dark-600 capitalize">
                      {property.type?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <span className={`forensic-badge ${getStatusColor(property.status || '')}`}>
                  {getStatusLabel(property.status || '')}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-dark-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {property.address?.city}, {property.address?.state} {property.address?.zip}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-dark-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Incident: {property.incidentDate ? formatDate(property.incidentDate) : 'N/A'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dark-200">
                  <div>
                    <div className="text-xs text-dark-600 mb-1">Property Value</div>
                    <div className="font-semibold text-dark-900">
                      {formatCurrency(property.preIncidentValue || 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-dark-600 mb-1">Est. Repairs</div>
                    <div className="font-semibold text-warning-600">
                      {formatCurrency(property.estimatedRepairCost || 0)}
                    </div>
                  </div>
                </div>

                {/* Warning if needed */}
                {property.status === 'inspection_pending' && (
                  <div className="flex items-center space-x-2 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-warning-600 flex-shrink-0" />
                    <p className="text-xs text-warning-800">
                      Inspection required to proceed with claim
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State (if no properties) */}
      {properties.length === 0 && (
        <div className="forensic-card">
          <div className="forensic-card-body text-center py-12">
            <Building2 className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-900 mb-2">No Properties Yet</h3>
            <p className="text-dark-600 mb-6">
              Start by adding your first commercial property to begin tracking damage and claims.
            </p>
            <Link
              href="/dashboard/properties/new"
              className="forensic-button forensic-button-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Property
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
