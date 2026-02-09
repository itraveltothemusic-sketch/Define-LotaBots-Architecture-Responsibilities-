/**
 * Insurance Claim Detail Page.
 * 
 * Deep-dive view for a single insurance claim showing:
 * - Claim details and financial breakdown
 * - Carrier interaction timeline
 * - Scope comparison and discrepancy analysis
 * - Linked property and evidence
 */

'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { CLAIM_STATUS_CONFIG, ROUTES } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/status-badge';
import { insuranceClaims } from '@/lib/mock-data';
import { useAtosStore } from '@/stores/atos-store';
import {
  ArrowLeft,
  Shield,
  Building2,
  DollarSign,
  User,
  Calendar,
  FileText,
  AlertTriangle,
  Phone,
  Mail,
} from 'lucide-react';

export default function InsuranceDetailPage() {
  const params = useParams();
  const claimId = params.id as string;
  const setContext = useAtosStore(s => s.setContext);

  useEffect(() => {
    setContext('insurance', claimId, 'claim');
  }, [setContext, claimId]);

  const claim = insuranceClaims.find(c => c.id === claimId);

  if (!claim) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-slate-900">Claim not found</p>
        <Link href={ROUTES.insurance} className="text-blue-600 hover:underline mt-2 text-sm">
          ← Back to Insurance
        </Link>
      </div>
    );
  }

  const statusConfig = CLAIM_STATUS_CONFIG[claim.status];
  const approvalRate = claim.amountApproved
    ? ((claim.amountApproved / claim.amountClaimed) * 100).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href={ROUTES.insurance}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Insurance
      </Link>

      {/* Claim Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-violet-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{claim.claimNumber || 'Draft Claim'}</h1>
                {statusConfig && (
                  <StatusBadge
                    label={statusConfig.label}
                    color={statusConfig.color}
                    bgColor={statusConfig.bgColor}
                    size="md"
                  />
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                <Link href={ROUTES.propertyDetail(claim.propertyId)} className="text-blue-600 hover:underline">
                  {claim.propertyName}
                </Link>{' '}
                · {claim.carrier}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
              Log Interaction
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700">
              File Supplemental
            </button>
          </div>
        </div>

        {/* Financial breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-slate-100">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Amount Claimed</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{formatCurrency(claim.amountClaimed)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Amount Approved</p>
            <p className={cn('text-2xl font-bold mt-1 tabular-nums', claim.amountApproved ? 'text-emerald-600' : 'text-slate-300')}>
              {claim.amountApproved ? formatCurrency(claim.amountApproved) : 'Pending'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Amount Paid</p>
            <p className={cn('text-2xl font-bold mt-1 tabular-nums', claim.amountPaid ? 'text-blue-600' : 'text-slate-300')}>
              {claim.amountPaid ? formatCurrency(claim.amountPaid) : 'Pending'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Approval Rate</p>
            <p className={cn('text-2xl font-bold mt-1', approvalRate ? 'text-slate-900' : 'text-slate-300')}>
              {approvalRate ? `${approvalRate}%` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Scope discrepancy warning */}
        {claim.scopeDiscrepancy && claim.scopeDiscrepancy > 10 && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Scope Discrepancy Detected: {claim.scopeDiscrepancy}%</p>
              <p className="text-sm text-amber-700 mt-1">
                The approved scope differs from the documented damage by {claim.scopeDiscrepancy}%. 
                This may indicate items excluded from the carrier&apos;s assessment. 
                ATOS recommends reviewing the inspection report and filing a supplemental claim.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Claim Details Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Claim Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Claim Details</h3>
          <div className="space-y-4">
            {[
              { icon: FileText, label: 'Policy Number', value: claim.policyNumber || '—' },
              { icon: Building2, label: 'Carrier', value: claim.carrier },
              { icon: Calendar, label: 'Filed Date', value: claim.filedDate ? formatDate(claim.filedDate) : '—' },
              { icon: User, label: 'Adjuster', value: claim.adjusterName || '—' },
              { icon: Mail, label: 'Adjuster Contact', value: claim.adjusterContact || '—' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-sm font-medium text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrier Interaction Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Carrier Interactions</h3>
            <button className="text-xs text-violet-600 hover:underline font-medium">
              + Log Interaction
            </button>
          </div>
          {claim.interactions.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No interactions logged yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Log every carrier communication to build your evidence chain.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {claim.interactions.map(interaction => (
                <div key={interaction.id} className="border-l-2 border-violet-200 pl-4 py-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-violet-600 capitalize">{interaction.type}</span>
                    <span className="text-xs text-slate-400">{formatDate(interaction.date)}</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-1">{interaction.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
