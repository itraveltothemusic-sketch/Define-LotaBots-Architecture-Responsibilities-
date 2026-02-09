/**
 * Insurance Claims Page
 * 
 * Display and manage all insurance claims with tracking and intelligence
 */

import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { insuranceClaims, properties } from '@/lib/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { Plus, FileText, DollarSign, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { ForensicCard } from '@/components/ui/Card';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';

export default async function InsuranceClaimsPage() {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  // Fetch user's properties first
  const userProperties = userRole === 'internal' || userRole === 'adjuster'
    ? await db.select().from(properties)
    : await db.select().from(properties).where(eq(properties.ownerId, userId));

  const propertyIds = userProperties.map(p => p.id);

  // Fetch claims for these properties
  const claims = propertyIds.length > 0
    ? await db.select({
        claim: insuranceClaims,
        property: properties,
      })
      .from(insuranceClaims)
      .leftJoin(properties, eq(insuranceClaims.propertyId, properties.id))
      .where(inArray(insuranceClaims.propertyId, propertyIds))
      .orderBy(desc(insuranceClaims.updatedAt))
    : [];

  // Calculate metrics
  const totalClaimed = claims.reduce((sum, { claim }) => 
    sum + (parseFloat(claim.claimedAmount?.toString() || '0')), 0
  );
  
  const totalApproved = claims.reduce((sum, { claim }) => 
    sum + (parseFloat(claim.approvedAmount?.toString() || '0')), 0
  );
  
  const activeClaims = claims.filter(({ claim }) => 
    ['submitted', 'under_review', 'appealed'].includes(claim.status)
  ).length;

  const approvedClaims = claims.filter(({ claim }) => 
    claim.status === 'approved' || claim.status === 'settled'
  ).length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Insurance Intelligence</h1>
          <p className="page-description">
            Track claims, analyze discrepancies, and optimize negotiation outcomes
          </p>
        </div>
        <Link href="/insurance/new" className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          File Claim
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Claims</p>
              <p className="text-3xl font-bold text-gray-900">{claims.length}</p>
              <p className="text-sm text-gray-500 mt-2">{activeClaims} active</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-forensic-50 text-forensic-600 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Claimed Amount</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalClaimed)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Approved Amount</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalApproved)}</p>
              {totalClaimed > 0 && (
                <p className="text-sm text-equity-600 mt-2">
                  {Math.round((totalApproved / totalClaimed) * 100)}% approval rate
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-equity-50 text-equity-600 flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Approved Claims</p>
              <p className="text-3xl font-bold text-gray-900">{approvedClaims}</p>
              <p className="text-sm text-gray-500 mt-2">of {claims.length} total</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-equity-50 text-equity-600 flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Claims List */}
      {claims.length === 0 ? (
        <ForensicCard className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Claims Yet</h3>
          <p className="text-gray-600 mb-6">
            Start tracking your insurance claims to maximize recovery outcomes
          </p>
          <Link href="/insurance/new" className="btn-primary inline-flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            File Your First Claim
          </Link>
        </ForensicCard>
      ) : (
        <ForensicCard>
          <div className="divide-y divide-gray-200">
            {claims.map(({ claim, property }) => {
              if (!property) return null;
              
              return (
                <Link
                  key={claim.id}
                  href={`/insurance/${claim.id}`}
                  className="block p-6 hover:bg-forensic-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Claim Header */}
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {claim.claimNumber || 'Draft Claim'}
                        </h3>
                        <Badge variant={getStatusBadgeVariant(claim.status)}>
                          {claim.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>

                      {/* Property Info */}
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>{property.address}, {property.city}</span>
                      </div>

                      {/* Carrier & Dates */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Carrier:</span>
                          <span>{claim.carrierName}</span>
                        </div>
                        {claim.filedAt && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Filed {formatDate(claim.filedAt)}</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-500">
                          <span>Updated {timeAgo(claim.updatedAt)}</span>
                        </div>
                      </div>

                      {/* Financial Summary */}
                      <div className="mt-4 flex items-center space-x-6">
                        {claim.claimedAmount && (
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Claimed</div>
                            <div className="text-lg font-semibold text-forensic-700">
                              {formatCurrency(claim.claimedAmount)}
                            </div>
                          </div>
                        )}
                        {claim.approvedAmount && (
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Approved</div>
                            <div className="text-lg font-semibold text-equity-700">
                              {formatCurrency(claim.approvedAmount)}
                            </div>
                          </div>
                        )}
                        {claim.paidAmount && (
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Paid</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {formatCurrency(claim.paidAmount)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Icon */}
                    <div className="ml-4">
                      {claim.status === 'approved' || claim.status === 'settled' ? (
                        <CheckCircle className="h-8 w-8 text-equity-600" />
                      ) : claim.status === 'denied' ? (
                        <AlertTriangle className="h-8 w-8 text-critical-600" />
                      ) : (
                        <Clock className="h-8 w-8 text-warning-600" />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </ForensicCard>
      )}
    </div>
  );
}
