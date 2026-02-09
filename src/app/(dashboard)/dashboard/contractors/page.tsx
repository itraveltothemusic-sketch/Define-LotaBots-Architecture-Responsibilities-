/**
 * Contractor Execution Module
 * 
 * Contractor vetting, work order management, progress tracking,
 * and compliance verification.
 */

'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ATOSPanel } from '@/components/atos/ATOSPanel';
import { formatCurrency, formatDate, formatPercent } from '@/lib/utils/format';
import { HardHat, Plus, CheckCircle, Clock, AlertTriangle, Star, Shield, FileCheck } from 'lucide-react';

// Mock data
const mockWorkOrders = [
  {
    id: '1',
    title: 'Structural Repairs & Reinforcement',
    property: 'Riverside Plaza',
    contractor: 'Elite Construction Co.',
    contractorRating: 4.8,
    status: 'IN_PROGRESS',
    percentComplete: 45,
    estimatedCost: 285000,
    actualCost: 130000,
    startDate: new Date('2024-01-10'),
    targetCompletion: new Date('2024-03-15'),
    lastUpdate: new Date('2024-01-20'),
    permitRequired: true,
    permitNumber: 'PRM-2024-8874',
    compliance: 'COMPLIANT',
  },
  {
    id: '2',
    title: 'Complete Roof Replacement',
    property: 'Tech Center Building',
    contractor: 'Apex Roofing Systems',
    contractorRating: 4.9,
    status: 'IN_PROGRESS',
    percentComplete: 72,
    estimatedCost: 180000,
    actualCost: 175000,
    startDate: new Date('2024-01-05'),
    targetCompletion: new Date('2024-02-28'),
    lastUpdate: new Date('2024-01-21'),
    permitRequired: true,
    permitNumber: 'PRM-2024-8821',
    compliance: 'COMPLIANT',
  },
  {
    id: '3',
    title: 'HVAC System Replacement',
    property: 'Downtown Retail Complex',
    contractor: 'Premium HVAC Solutions',
    contractorRating: 4.6,
    status: 'PENDING',
    percentComplete: 0,
    estimatedCost: 145000,
    actualCost: 0,
    startDate: new Date('2024-02-01'),
    targetCompletion: new Date('2024-03-30'),
    lastUpdate: new Date('2024-01-18'),
    permitRequired: true,
    permitNumber: null,
    compliance: 'PENDING_PERMIT',
  },
  {
    id: '4',
    title: 'Water Damage Remediation',
    property: 'Riverside Plaza',
    contractor: 'Swift Restoration Inc.',
    contractorRating: 4.7,
    status: 'INSPECTION_REQUIRED',
    percentComplete: 95,
    estimatedCost: 65000,
    actualCost: 63500,
    startDate: new Date('2023-12-20'),
    targetCompletion: new Date('2024-01-25'),
    lastUpdate: new Date('2024-01-19'),
    permitRequired: false,
    permitNumber: null,
    compliance: 'COMPLIANT',
  },
];

const mockContractors = [
  {
    id: '1',
    name: 'Elite Construction Co.',
    rating: 4.8,
    completedProjects: 47,
    specialties: ['Structural', 'Foundation', 'General'],
    licenseNumber: 'TX-CC-98754',
    licenseExpiry: new Date('2025-06-30'),
    bondAmount: 500000,
    status: 'APPROVED',
  },
  {
    id: '2',
    name: 'Apex Roofing Systems',
    rating: 4.9,
    completedProjects: 83,
    specialties: ['Roofing', 'Waterproofing'],
    licenseNumber: 'TX-RC-12443',
    licenseExpiry: new Date('2025-12-31'),
    bondAmount: 350000,
    status: 'APPROVED',
  },
  {
    id: '3',
    name: 'Premium HVAC Solutions',
    rating: 4.6,
    completedProjects: 62,
    specialties: ['HVAC', 'Electrical'],
    licenseNumber: 'TX-AC-55892',
    licenseExpiry: new Date('2025-09-15'),
    bondAmount: 250000,
    status: 'APPROVED',
  },
];

const mockGuidance = {
  id: '1',
  context: {
    userId: 'user1',
    currentModule: 'contractor' as const,
    recentActivity: [],
  },
  guidance: 'Water Damage Remediation at Riverside Plaza is 95% complete and requires final inspection. HVAC project is awaiting permit approval before work can begin.',
  reasoning: 'Timely inspections prevent payment delays and ensure work quality meets standards. Permit delays can cascade into project timeline issues and impact insurance settlement schedules.',
  suggestedActions: [
    {
      label: 'Schedule final inspection for water remediation',
      action: 'schedule_inspection',
      priority: 'HIGH' as const,
    },
    {
      label: 'Follow up on HVAC permit status',
      action: 'check_permit',
      priority: 'HIGH' as const,
    },
    {
      label: 'Verify progress photos for structural work',
      action: 'verify_photos',
      priority: 'MEDIUM' as const,
    },
  ],
  risks: [
    'Water remediation payment milestone pending inspection approval',
    'HVAC permit delay pushing start date - may affect claim timeline',
    'Structural work actual costs trending 8% over estimate',
  ],
  opportunities: [
    'Roof replacement ahead of schedule - early completion possible',
    'All contractors maintaining compliance - excellent track record',
    'Additional work discovered can be added to insurance claims',
  ],
  timestamp: new Date(),
};

export default function ContractorsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Contractor Execution</h1>
          <p className="text-brand-muted mt-1">Verified work with continuous compliance tracking</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Work Order
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-brand-muted mb-1">Active Work Orders</p>
          <p className="text-3xl font-bold text-brand-primary mb-2">4</p>
          <p className="text-xs text-brand-muted">2 in progress, 1 pending, 1 inspection</p>
        </Card>

        <Card>
          <p className="text-sm text-brand-muted mb-1">Total Contract Value</p>
          <p className="text-3xl font-bold text-brand-primary mb-2">
            {formatCurrency(675000)}
          </p>
          <p className="text-xs text-brand-muted">across all active orders</p>
        </Card>

        <Card>
          <p className="text-sm text-brand-muted mb-1">Avg Completion</p>
          <p className="text-3xl font-bold text-brand-success mb-2">53%</p>
          <p className="text-xs text-brand-success">On track with timeline</p>
        </Card>

        <Card>
          <p className="text-sm text-brand-muted mb-1">Compliance Rate</p>
          <p className="text-3xl font-bold text-brand-success mb-2">100%</p>
          <p className="text-xs text-brand-success">All contractors compliant</p>
        </Card>
      </div>

      {/* ATOS Guidance */}
      <ATOSPanel guidance={mockGuidance} compact />

      {/* Active Work Orders */}
      <Card>
        <CardHeader
          title="Active Work Orders"
          subtitle="All ongoing and pending contractor work"
        />

        <div className="space-y-4">
          {mockWorkOrders.map((order) => (
            <div
              key={order.id}
              className="border border-slate-200 rounded-lg p-5 hover:border-brand-secondary transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-brand-primary">{order.title}</h3>
                    <Badge
                      variant={
                        order.status === 'IN_PROGRESS' ? 'info' :
                        order.status === 'INSPECTION_REQUIRED' ? 'warning' :
                        order.status === 'COMPLETED' ? 'success' :
                        'default'
                      }
                    >
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-brand-muted">{order.property}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <HardHat className="w-4 h-4 text-brand-muted" />
                    <span className="text-sm text-brand-primary">{order.contractor}</span>
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium text-brand-primary">
                        {order.contractorRating}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    order.compliance === 'COMPLIANT' ? 'success' :
                    order.compliance === 'PENDING_PERMIT' ? 'warning' :
                    'danger'
                  }
                  className="flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  {order.compliance.replace(/_/g, ' ')}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-brand-muted">Progress</span>
                  <span className="text-sm font-semibold text-brand-primary">
                    {order.percentComplete}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className="bg-brand-success h-2.5 rounded-full transition-all"
                    style={{ width: `${order.percentComplete}%` }}
                  ></div>
                </div>
              </div>

              {/* Timeline & Cost */}
              <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs text-brand-muted mb-0.5">Start Date</p>
                  <p className="text-sm font-medium text-brand-primary">
                    {formatDate(order.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-muted mb-0.5">Target Completion</p>
                  <p className="text-sm font-medium text-brand-primary">
                    {formatDate(order.targetCompletion)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-muted mb-0.5">Estimated Cost</p>
                  <p className="text-sm font-medium text-brand-primary">
                    {formatCurrency(order.estimatedCost)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-muted mb-0.5">Actual Cost</p>
                  <p className="text-sm font-medium text-brand-primary">
                    {formatCurrency(order.actualCost)}
                  </p>
                </div>
              </div>

              {/* Permit Info */}
              {order.permitRequired && (
                <div className="flex items-center gap-2 text-sm mb-4">
                  <FileCheck className="w-4 h-4 text-brand-muted" />
                  <span className="text-brand-muted">Permit:</span>
                  {order.permitNumber ? (
                    <Badge variant="success" size="sm">{order.permitNumber}</Badge>
                  ) : (
                    <Badge variant="warning" size="sm">Pending Approval</Badge>
                  )}
                </div>
              )}

              {/* Status Indicators */}
              {order.status === 'INSPECTION_REQUIRED' && (
                <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 px-3 py-2 rounded mb-4">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Final inspection required to approve milestone payment</span>
                </div>
              )}

              {order.status === 'PENDING' && !order.permitNumber && (
                <div className="flex items-center gap-2 text-sm text-blue-800 bg-blue-50 px-3 py-2 rounded mb-4">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>Awaiting permit approval before work can begin</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">
                  View Progress Photos
                </Button>
                <Button size="sm" variant="secondary">
                  Log Update
                </Button>
                {order.status === 'INSPECTION_REQUIRED' && (
                  <Button size="sm">
                    Schedule Inspection
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Approved Contractors */}
      <Card>
        <CardHeader
          title="Approved Contractors"
          subtitle="Vetted contractors available for work assignments"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockContractors.map((contractor) => (
            <div
              key={contractor.id}
              className="border border-slate-200 rounded-lg p-4 hover:border-brand-secondary transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-brand-primary mb-1">
                    {contractor.name}
                  </h4>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-brand-primary">
                      {contractor.rating}
                    </span>
                    <span className="text-xs text-brand-muted ml-1">
                      ({contractor.completedProjects} projects)
                    </span>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  <Shield className="w-3 h-3 mr-1" />
                  {contractor.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-xs text-brand-muted">Specialties</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {contractor.specialties.map((specialty, index) => (
                      <Badge key={index} variant="default" size="sm">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-brand-muted">License</p>
                    <p className="text-brand-primary font-medium">
                      {contractor.licenseNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-muted">Bond</p>
                    <p className="text-brand-primary font-medium">
                      {formatCurrency(contractor.bondAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <Button size="sm" variant="ghost" fullWidth>
                Assign Work Order
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
