/**
 * Contractor Detail Page.
 * 
 * Shows the full contractor profile including:
 * - Company information and verification status
 * - Active and completed assignments
 * - Compliance tracking
 * - Performance history
 */

'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { cn, formatCurrency } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { ProgressBar } from '@/components/ui/progress-bar';
import { contractors, assignments } from '@/lib/mock-data';
import { useAtosStore } from '@/stores/atos-store';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Phone,
  FileText,
  Building2,
} from 'lucide-react';

export default function ContractorDetailPage() {
  const params = useParams();
  const contractorId = params.id as string;
  const setContext = useAtosStore(s => s.setContext);

  useEffect(() => {
    setContext('contractors', contractorId, 'contractor');
  }, [setContext, contractorId]);

  const contractor = contractors.find(c => c.id === contractorId);

  if (!contractor) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-slate-900">Contractor not found</p>
        <Link href={ROUTES.contractors} className="text-blue-600 hover:underline mt-2 text-sm">
          ← Back to Contractors
        </Link>
      </div>
    );
  }

  const contractorAssignments = assignments.filter(a => a.contractorId === contractorId);
  const activeAssignments = contractorAssignments.filter(a => !['completed', 'verified'].includes(a.status));

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href={ROUTES.contractors}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Contractors
      </Link>

      {/* Contractor Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold',
              contractor.insuranceVerified ? 'bg-emerald-500' : 'bg-amber-500'
            )}>
              {contractor.companyName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{contractor.companyName}</h1>
              <p className="text-sm text-slate-500 mt-1">{contractor.contactName} · {contractor.email}</p>
              <div className="flex items-center gap-3 mt-3">
                {contractor.insuranceVerified ? (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-semibold">Insurance Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-600">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-xs font-semibold">Verification Pending</span>
                  </div>
                )}
                {contractor.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-slate-700">{contractor.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
              Edit
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700">
              Assign to Property
            </button>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="text-sm font-medium text-slate-900">{contractor.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-medium text-slate-900">{contractor.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">License</p>
              <p className="text-sm font-medium text-slate-900">{contractor.licenseNumber || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Completed Projects</p>
              <p className="text-sm font-medium text-slate-900">{contractor.completedProjects}</p>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Specialties</p>
          <div className="flex flex-wrap gap-2">
            {contractor.specialties.map(s => (
              <span key={s} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments */}
      {activeAssignments.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Active Assignments</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {activeAssignments.map(a => (
              <div key={a.id} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Link href={ROUTES.propertyDetail(a.propertyId)} className="text-sm font-semibold text-blue-600 hover:underline">
                      {a.propertyName}
                    </Link>
                    <p className="text-xs text-slate-500 capitalize mt-0.5">{a.status.replace(/-/g, ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">{formatCurrency(a.estimatedCost)}</p>
                    {a.complianceScore && (
                      <p className="text-xs text-emerald-600">Compliance: {a.complianceScore}%</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-3">{a.scope}</p>
                <ProgressBar value={a.progressPercent} size="md" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
