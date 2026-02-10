/**
 * Properties & Forensics Module
 * 
 * Comprehensive property management with forensic documentation,
 * damage assessments, and evidence tracking.
 */

'use client';

import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ATOSPanel } from '@/components/atos/ATOSPanel';
import { formatCurrency, formatDate, formatSquareFeet } from '@/lib/utils/format';
import { Building2, Plus, Search, Upload, Camera, FileText, AlertCircle } from 'lucide-react';

// Mock data
const mockProperties = [
  {
    id: '1',
    name: 'Riverside Plaza',
    address: '123 Main St, Houston, TX 77002',
    propertyType: 'RETAIL',
    status: 'CLAIM_FILED',
    squareFootage: 45000,
    yearBuilt: 2005,
    damageCategories: 5,
    evidenceCount: 87,
    estimatedDamage: 875000,
    lastInspection: new Date('2024-01-15'),
    verificationStatus: 'PARTIAL',
  },
  {
    id: '2',
    name: 'Tech Center Building',
    address: '456 Innovation Dr, Austin, TX 78701',
    propertyType: 'OFFICE',
    status: 'WORK_IN_PROGRESS',
    squareFootage: 62000,
    yearBuilt: 2010,
    damageCategories: 8,
    evidenceCount: 134,
    estimatedDamage: 1250000,
    lastInspection: new Date('2024-01-20'),
    verificationStatus: 'VERIFIED',
  },
  {
    id: '3',
    name: 'Downtown Retail Complex',
    address: '789 Commerce St, Dallas, TX 75201',
    propertyType: 'MIXED_USE',
    status: 'NEGOTIATION',
    squareFootage: 98000,
    yearBuilt: 1998,
    damageCategories: 12,
    evidenceCount: 203,
    estimatedDamage: 2100000,
    lastInspection: new Date('2024-01-18'),
    verificationStatus: 'VERIFIED',
  },
];

const mockGuidance = {
  id: '1',
  context: {
    userId: 'user1',
    currentModule: 'forensic' as const,
    recentActivity: [],
  },
  guidance: 'Focus on completing damage documentation for Riverside Plaza. All damage categories must have photographic evidence with measurements before claim submission.',
  reasoning: 'Incomplete documentation is the #1 reason for claim delays and reduced payouts. Carriers require comprehensive evidence across all damage categories to validate scope and costs.',
  suggestedActions: [
    {
      label: 'Complete ROOF damage documentation for Riverside Plaza',
      action: 'document_roof',
      priority: 'HIGH' as const,
    },
    {
      label: 'Add measurements to existing photos',
      action: 'add_measurements',
      priority: 'HIGH' as const,
    },
    {
      label: 'Verify all timestamps and geotags',
      action: 'verify_metadata',
      priority: 'MEDIUM' as const,
    },
  ],
  risks: [
    'Riverside Plaza missing ROOF and ELECTRICAL damage documentation',
    'Photos without measurements may be challenged by adjusters',
    '3 properties have evidence older than 30 days - consider re-inspection',
  ],
  opportunities: [
    'Hidden water damage discovered in Tech Center - add to claim',
    'Downtown Retail has exemplary documentation - use as template',
  ],
  timestamp: new Date(),
};

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Properties & Forensics</h1>
          <p className="text-brand-muted mt-1">Comprehensive documentation and damage assessment</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      {/* ATOS Guidance */}
      <ATOSPanel guidance={mockGuidance} compact />

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties by name, address, or claim number..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
            />
          </div>
          <Button variant="secondary">
            Filter
          </Button>
        </div>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockProperties.map((property) => (
          <Card key={property.id} hover className="cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-brand-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-primary mb-1">
                    {property.name}
                  </h3>
                  <p className="text-sm text-brand-muted">{property.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="info" size="sm">
                      {property.propertyType}
                    </Badge>
                    <Badge 
                      variant={
                        property.status === 'WORK_IN_PROGRESS' ? 'info' :
                        property.status === 'NEGOTIATION' ? 'warning' :
                        'default'
                      }
                      size="sm"
                    >
                      {property.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              <Badge 
                variant={
                  property.verificationStatus === 'VERIFIED' ? 'success' :
                  property.verificationStatus === 'PARTIAL' ? 'warning' :
                  'danger'
                }
              >
                {property.verificationStatus}
              </Badge>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs text-brand-muted mb-0.5">Square Footage</p>
                <p className="text-sm font-medium text-brand-primary">
                  {formatSquareFeet(property.squareFootage)}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-muted mb-0.5">Year Built</p>
                <p className="text-sm font-medium text-brand-primary">
                  {property.yearBuilt}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-muted mb-0.5">Damage Categories</p>
                <p className="text-sm font-medium text-brand-primary">
                  {property.damageCategories} identified
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-muted mb-0.5">Evidence Items</p>
                <p className="text-sm font-medium text-brand-primary">
                  {property.evidenceCount} files
                </p>
              </div>
            </div>

            {/* Damage Estimate */}
            <div className="mb-4">
              <p className="text-xs text-brand-muted mb-1">Estimated Damage</p>
              <p className="text-2xl font-bold text-brand-primary">
                {formatCurrency(property.estimatedDamage)}
              </p>
            </div>

            {/* Last Inspection */}
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-brand-muted">Last Inspection:</span>
              <span className="text-brand-primary font-medium">
                {formatDate(property.lastInspection)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Camera className="w-4 h-4 mr-1.5" />
                Add Evidence
              </Button>
              <Button size="sm" variant="secondary" className="flex-1">
                <FileText className="w-4 h-4 mr-1.5" />
                View Details
              </Button>
            </div>

            {/* Warning Banner */}
            {property.verificationStatus === 'PARTIAL' && (
              <div className="mt-4 flex items-center gap-2 text-sm text-amber-800 bg-amber-50 px-3 py-2 rounded">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Documentation incomplete - complete before claim submission</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Bulk Actions */}
      <Card>
        <CardHeader
          title="Bulk Documentation Tools"
          subtitle="Upload evidence for multiple properties or damage categories"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="secondary" className="flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" />
            Bulk Upload Photos
          </Button>
          <Button variant="secondary" className="flex items-center justify-center gap-2">
            <Camera className="w-4 h-4" />
            Schedule Inspection
          </Button>
          <Button variant="secondary" className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            Export All Evidence
          </Button>
        </div>
      </Card>
    </div>
  );
}
