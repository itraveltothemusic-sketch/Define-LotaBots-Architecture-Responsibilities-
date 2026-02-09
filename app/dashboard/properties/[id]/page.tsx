import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ArrowLeft, 
  FileSearch,
  Shield,
  Users,
  Image,
  Edit,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Mock data - will be replaced with real database query
  const property = {
    id,
    name: 'Riverside Plaza',
    type: 'commercial',
    status: 'claim_submitted',
    address: {
      street: '123 River Road',
      city: 'Tampa',
      state: 'FL',
      zip: '33602',
      county: 'Hillsborough',
      coordinates: { lat: 27.9506, lng: -82.4572 },
    },
    squareFootage: 45000,
    yearBuilt: 2010,
    storiesCount: 3,
    constructionType: 'Steel Frame with Concrete',
    roofType: 'TPO Membrane',
    preIncidentValue: 2450000,
    estimatedRepairCost: 385000,
    projectedPostRepairValue: 2580000,
    incidentDate: new Date('2024-09-15'),
    createdAt: new Date('2024-09-16'),
  };

  if (!property) {
    notFound();
  }

  const equityGain = (property.projectedPostRepairValue || 0) - property.preIncidentValue;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/properties"
        className="inline-flex items-center text-sm text-dark-600 hover:text-dark-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Properties
      </Link>

      {/* Header */}
      <div className="forensic-card">
        <div className="forensic-card-body">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-dark-900 mb-2">{property.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-dark-600">
                  <span className="capitalize">{property.type} Property</span>
                  <span>•</span>
                  <span className="forensic-badge forensic-badge-primary">
                    {property.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
              </div>
            </div>
            <Link
              href={`/dashboard/properties/${id}/edit`}
              className="forensic-button forensic-button-secondary"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Property Value</div>
            <DollarSign className="w-5 h-5 text-primary-500" />
          </div>
          <div className="metric-value">{formatCurrency(property.preIncidentValue)}</div>
          <div className="text-xs text-dark-600 mt-1">Pre-incident valuation</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Estimated Repairs</div>
            <DollarSign className="w-5 h-5 text-warning-500" />
          </div>
          <div className="metric-value text-warning-600">
            {formatCurrency(property.estimatedRepairCost || 0)}
          </div>
          <div className="text-xs text-dark-600 mt-1">Forensic assessment</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Projected Value</div>
            <TrendingUp className="w-5 h-5 text-accent-500" />
          </div>
          <div className="metric-value text-accent-600">
            {formatCurrency(property.projectedPostRepairValue || 0)}
          </div>
          <div className="text-xs text-dark-600 mt-1">Post-repair estimate</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-label">Equity Gain</div>
            <TrendingUp className="w-5 h-5 text-accent-500" />
          </div>
          <div className="metric-value text-accent-600">
            {formatCurrency(equityGain)}
          </div>
          <div className="text-xs text-accent-600 mt-1">
            +{((equityGain / property.preIncidentValue) * 100).toFixed(1)}% increase
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Information */}
          <div className="forensic-card">
            <div className="forensic-card-header">
              <h2 className="text-xl font-bold text-dark-900">Property Information</h2>
            </div>
            <div className="forensic-card-body">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-dark-600">Address</label>
                  <p className="text-dark-900 mt-1">
                    {property.address.street}<br />
                    {property.address.city}, {property.address.state} {property.address.zip}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-600">County</label>
                  <p className="text-dark-900 mt-1">{property.address.county}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-600">Square Footage</label>
                  <p className="text-dark-900 mt-1">{property.squareFootage.toLocaleString()} sq ft</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-600">Year Built</label>
                  <p className="text-dark-900 mt-1">{property.yearBuilt}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-600">Stories</label>
                  <p className="text-dark-900 mt-1">{property.storiesCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-600">Construction Type</label>
                  <p className="text-dark-900 mt-1">{property.constructionType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-600">Roof Type</label>
                  <p className="text-dark-900 mt-1">{property.roofType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-600">Incident Date</label>
                  <p className="text-dark-900 mt-1">
                    {property.incidentDate ? formatDate(property.incidentDate) : 'Not reported'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href={`/dashboard/properties/${id}/inspections/new`}
              className="forensic-card forensic-card-body p-4 hover:shadow-forensic transition-all"
            >
              <FileSearch className="w-6 h-6 text-primary-500 mb-2" />
              <h3 className="font-semibold text-dark-900 mb-1">Schedule Inspection</h3>
              <p className="text-sm text-dark-600">Forensic damage assessment</p>
            </Link>

            <Link
              href={`/dashboard/properties/${id}/claims/new`}
              className="forensic-card forensic-card-body p-4 hover:shadow-forensic transition-all"
            >
              <Shield className="w-6 h-6 text-primary-500 mb-2" />
              <h3 className="font-semibold text-dark-900 mb-1">File Claim</h3>
              <p className="text-sm text-dark-600">Submit insurance claim</p>
            </Link>

            <Link
              href={`/dashboard/properties/${id}/documents`}
              className="forensic-card forensic-card-body p-4 hover:shadow-forensic transition-all"
            >
              <Image className="w-6 h-6 text-primary-500 mb-2" />
              <h3 className="font-semibold text-dark-900 mb-1">Documents</h3>
              <p className="text-sm text-dark-600">Photos, videos, reports</p>
            </Link>

            <Link
              href={`/dashboard/properties/${id}/contractors`}
              className="forensic-card forensic-card-body p-4 hover:shadow-forensic transition-all"
            >
              <Users className="w-6 h-6 text-primary-500 mb-2" />
              <h3 className="font-semibold text-dark-900 mb-1">Contractors</h3>
              <p className="text-sm text-dark-600">Assign repair work</p>
            </Link>
          </div>
        </div>

        {/* Right Column - Timeline & ATOS */}
        <div className="space-y-6">
          {/* ATOS Guidance */}
          <div className="atos-panel">
            <h3 className="font-bold text-dark-900 mb-3">ATOS Insights</h3>
            <div className="space-y-3">
              <div className="atos-message">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-dark-900">
                      Inspection completed 5 days ago. Claim submission recommended within 25 days.
                    </p>
                  </div>
                </div>
              </div>
              <div className="atos-message">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 text-accent-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-dark-900">
                      Projected equity gain: {formatCurrency(equityGain)} (+{((equityGain / property.preIncidentValue) * 100).toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="forensic-card">
            <div className="forensic-card-header">
              <h3 className="font-bold text-dark-900">Recent Activity</h3>
            </div>
            <div className="forensic-card-body">
              <div className="space-y-4">
                <div className="timeline-item">
                  <div className="text-sm font-medium text-dark-900">Property Added</div>
                  <div className="text-xs text-dark-600 mt-1">
                    {formatDate(property.createdAt)}
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="text-sm font-medium text-dark-900">Incident Reported</div>
                  <div className="text-xs text-dark-600 mt-1">
                    {property.incidentDate ? formatDate(property.incidentDate) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
