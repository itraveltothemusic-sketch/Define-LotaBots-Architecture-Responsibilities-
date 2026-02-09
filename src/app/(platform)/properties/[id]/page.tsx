/**
 * Property Detail Page — The forensic case file.
 * 
 * This is the deep-dive view for a single property. It shows:
 * - Property profile and key facts
 * - Damage classification and severity
 * - Inspection history
 * - Evidence timeline
 * - Linked claims and contractor assignments
 * - ATOS analysis specific to this property
 * 
 * Every piece of information is treated as evidence.
 */

'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { cn, formatCurrency, formatDate, severityColor, severityBg } from '@/lib/utils';
import { PROPERTY_STATUS_CONFIG, ROUTES } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { properties, inspections, insuranceClaims, assignments } from '@/lib/mock-data';
import { useAtosStore } from '@/stores/atos-store';
import {
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  Ruler,
  User,
  FileSearch,
  Shield,
  HardHat,
  AlertTriangle,
  Clock,
} from 'lucide-react';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const setContext = useAtosStore(s => s.setContext);

  useEffect(() => {
    setContext('properties', propertyId, 'property');
  }, [setContext, propertyId]);

  const property = properties.find(p => p.id === propertyId);

  if (!property) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-slate-900">Property not found</p>
        <Link href={ROUTES.properties} className="text-blue-600 hover:underline mt-2 text-sm">
          ← Back to Properties
        </Link>
      </div>
    );
  }

  const statusConfig = PROPERTY_STATUS_CONFIG[property.status];
  const propertyInspections = inspections.filter(i => i.propertyId === propertyId);
  const propertyClaims = insuranceClaims.filter(c => c.propertyId === propertyId);
  const propertyAssignments = assignments.filter(a => a.propertyId === propertyId);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href={ROUTES.properties}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Properties
      </Link>

      {/* Property Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{property.name}</h1>
                {statusConfig && (
                  <StatusBadge
                    label={statusConfig.label}
                    color={statusConfig.color}
                    bgColor={statusConfig.bgColor}
                    size="md"
                    pulse={['inspection', 'claim-review', 'in-repair'].includes(property.status)}
                  />
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {property.address}, {property.city}, {property.state} {property.zip}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {property.ownerName}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Edit
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Add Inspection
            </button>
          </div>
        </div>

        {/* Property Facts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t border-slate-100">
          {[
            { label: 'Property Type', value: property.propertyType, icon: Building2 },
            { label: 'Square Footage', value: property.squareFootage ? `${property.squareFootage.toLocaleString()} sq ft` : '—', icon: Ruler },
            { label: 'Year Built', value: property.yearBuilt || '—', icon: Calendar },
            { label: 'Estimated Value', value: property.estimatedValue ? formatCurrency(property.estimatedValue) : '—', icon: Building2 },
            { label: 'Damage Date', value: property.damageDate ? formatDate(property.damageDate) : '—', icon: AlertTriangle },
            { label: 'Last Updated', value: formatDate(property.updatedAt), icon: Clock },
          ].map((fact, i) => (
            <div key={i}>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{fact.label}</p>
              <p className="text-sm font-semibold text-slate-900 mt-1 capitalize">{String(fact.value)}</p>
            </div>
          ))}
        </div>

        {/* Damage Classifications */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Damage Classifications</p>
          <div className="flex flex-wrap gap-2">
            {property.damageClassifications.map(dc => (
              <span
                key={dc}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg capitalize"
              >
                {dc}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inspections */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Inspections</h3>
            </div>
            <span className="text-xs text-slate-500">{propertyInspections.length} records</span>
          </div>
          {propertyInspections.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">No inspections recorded yet.</p>
              <button className="mt-3 text-sm text-blue-600 hover:underline font-medium">
                Schedule Initial Inspection →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {propertyInspections.map(inspection => (
                <div key={inspection.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 capitalize">{inspection.type} Inspection</span>
                      <span className={cn(
                        'text-xs font-bold px-2 py-0.5 rounded-full',
                        severityColor(inspection.severityScore),
                        severityBg(inspection.severityScore),
                      )}>
                        Severity: {inspection.severityScore}/10
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">{formatDate(inspection.date)}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{inspection.findings}</p>
                  <p className="text-xs text-slate-400 mt-2">Inspector: {inspection.inspectorName}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insurance Claims */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-600" />
              <h3 className="text-sm font-bold text-slate-900">Insurance Claims</h3>
            </div>
            <span className="text-xs text-slate-500">{propertyClaims.length} claims</span>
          </div>
          {propertyClaims.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">No claims filed yet.</p>
              <button className="mt-3 text-sm text-blue-600 hover:underline font-medium">
                File Insurance Claim →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {propertyClaims.map(claim => (
                <Link
                  key={claim.id}
                  href={ROUTES.insuranceDetail(claim.id)}
                  className="block px-5 py-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-900">{claim.claimNumber || 'Draft'}</span>
                    <StatusBadge
                      label={claim.status.replace(/-/g, ' ')}
                      color="text-slate-600"
                      bgColor="bg-slate-100"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Carrier: {claim.carrier}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-slate-600">Claimed: <span className="font-semibold">{formatCurrency(claim.amountClaimed)}</span></span>
                    {claim.amountApproved && (
                      <span className="text-emerald-600">Approved: <span className="font-semibold">{formatCurrency(claim.amountApproved)}</span></span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Contractor Assignments */}
        <div className="bg-white rounded-xl border border-slate-200 lg:col-span-2">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardHat className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900">Contractor Assignments</h3>
            </div>
            <span className="text-xs text-slate-500">{propertyAssignments.length} assignments</span>
          </div>
          {propertyAssignments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">No contractors assigned yet.</p>
              <button className="mt-3 text-sm text-blue-600 hover:underline font-medium">
                Assign Contractor →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {propertyAssignments.map(assignment => (
                <div key={assignment.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{assignment.contractorName}</p>
                      <p className="text-xs text-slate-500 mt-0.5 capitalize">{assignment.status.replace(/-/g, ' ')}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{formatCurrency(assignment.estimatedCost)}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{assignment.scope}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <ProgressBar value={assignment.progressPercent} size="sm" />
                    </div>
                    {assignment.complianceScore && (
                      <span className="text-xs font-medium text-slate-500">
                        Compliance: <span className="text-emerald-600">{assignment.complianceScore}%</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
