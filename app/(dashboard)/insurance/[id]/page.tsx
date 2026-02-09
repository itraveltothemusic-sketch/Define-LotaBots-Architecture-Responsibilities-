/**
 * Insurance Claim Detail Page
 * 
 * Comprehensive view of a single claim with interactions and scope analysis
 */

import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { insuranceClaims, properties, claimInteractions, scopeComparisons } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  FileText, 
  Building2,
  DollarSign,
  Calendar,
  MessageSquare,
  FileCheck,
  AlertTriangle,
  Phone,
  Mail,
  Users,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { ForensicCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatDate, formatDateTime, timeAgo } from '@/lib/utils';

interface ClaimDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ClaimDetailPage({ params }: ClaimDetailPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  const claimId = params.id;

  // Fetch claim with property
  const [claimData] = await db
    .select({
      claim: insuranceClaims,
      property: properties,
    })
    .from(insuranceClaims)
    .leftJoin(properties, eq(insuranceClaims.propertyId, properties.id))
    .where(eq(insuranceClaims.id, claimId))
    .limit(1);

  if (!claimData || !claimData.property) {
    notFound();
  }

  const { claim, property } = claimData;

  // Check access
  if (session.user.role !== 'internal' && session.user.role !== 'adjuster' && property.ownerId !== session.user.id) {
    notFound();
  }

  // Fetch interactions
  const interactions = await db
    .select()
    .from(claimInteractions)
    .where(eq(claimInteractions.claimId, claimId))
    .orderBy(desc(claimInteractions.occurredAt));

  // Fetch scope comparisons
  const scopes = await db
    .select()
    .from(scopeComparisons)
    .where(eq(scopeComparisons.claimId, claimId))
    .orderBy(desc(scopeComparisons.createdAt));

  // Calculate financial metrics
  const claimedAmount = parseFloat(claim.claimedAmount?.toString() || '0');
  const approvedAmount = parseFloat(claim.approvedAmount?.toString() || '0');
  const paidAmount = parseFloat(claim.paidAmount?.toString() || '0');
  const deductible = parseFloat(claim.deductible?.toString() || '0');
  
  const approvalRate = claimedAmount > 0 ? (approvedAmount / claimedAmount) * 100 : 0;
  const outstandingAmount = approvedAmount - paidAmount;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <Link href="/insurance" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Claims
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {claim.claimNumber || 'Draft Claim'}
              </h1>
              <Badge variant={getStatusBadgeVariant(claim.status)}>
                {claim.status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <Link 
              href={`/properties/${property.id}`}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Building2 className="h-4 w-4 mr-1" />
              <span>{property.address}, {property.city}</span>
            </Link>
          </div>
          <Link href={`/insurance/${claimId}/edit`} className="btn-secondary flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Edit Claim
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claim Overview */}
          <ForensicCard>
            <CardHeader>
              <CardTitle>Claim Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Carrier Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Carrier:</span>
                      <span className="text-sm font-medium text-gray-900">{claim.carrierName}</span>
                    </div>
                    {claim.policyNumber && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Policy #:</span>
                        <span className="text-sm font-medium text-gray-900">{claim.policyNumber}</span>
                      </div>
                    )}
                    {claim.filedAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Filed:</span>
                        <span className="text-sm font-medium text-gray-900">{formatDate(claim.filedAt)}</span>
                      </div>
                    )}
                    {claim.responseDeadline && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Deadline:</span>
                        <span className="text-sm font-medium text-warning-700">{formatDate(claim.responseDeadline)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Financial Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Claimed:</span>
                      <span className="text-sm font-semibold text-forensic-700">
                        {formatCurrency(claimedAmount)}
                      </span>
                    </div>
                    {approvedAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Approved:</span>
                        <span className="text-sm font-semibold text-equity-700">
                          {formatCurrency(approvedAmount)}
                        </span>
                      </div>
                    )}
                    {paidAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Paid:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(paidAmount)}
                        </span>
                      </div>
                    )}
                    {deductible > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Deductible:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(deductible)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {approvedAmount > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Approval Rate:</span>
                    <span className="text-lg font-bold text-equity-700">
                      {approvalRate.toFixed(1)}%
                    </span>
                  </div>
                  {outstandingAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Outstanding Payment:</span>
                      <span className="text-lg font-bold text-warning-700">
                        {formatCurrency(outstandingAmount)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {claim.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
                  <p className="text-sm text-gray-700">{claim.notes}</p>
                </div>
              )}
            </CardContent>
          </ForensicCard>

          {/* Claim Interactions */}
          <ForensicCard>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-forensic-600" />
                  Claim Interactions ({interactions.length})
                </CardTitle>
                <Link 
                  href={`/insurance/${claimId}/interactions/new`} 
                  className="text-sm text-forensic-600 hover:text-forensic-700 font-medium"
                >
                  Log Interaction
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {interactions.length === 0 ? (
                <p className="text-sm text-gray-600">No interactions logged yet</p>
              ) : (
                <div className="space-y-4">
                  {interactions.map((interaction) => {
                    const getInteractionIcon = (type: string) => {
                      switch (type) {
                        case 'call': return Phone;
                        case 'email': return Mail;
                        case 'meeting': return Users;
                        default: return FileText;
                      }
                    };
                    
                    const Icon = getInteractionIcon(interaction.interactionType);
                    
                    return (
                      <div key={interaction.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-forensic-100 rounded-full flex items-center justify-center">
                            <Icon className="h-4 w-4 text-forensic-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                {interaction.interactionType.replace(/_/g, ' ')}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDateTime(interaction.occurredAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{interaction.summary}</p>
                            {interaction.outcome && (
                              <div className="text-sm">
                                <span className="text-gray-600">Outcome: </span>
                                <span className="text-gray-900">{interaction.outcome}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </ForensicCard>

          {/* Scope Comparisons */}
          <ForensicCard>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-forensic-600" />
                  Scope Comparisons ({scopes.length})
                </CardTitle>
                <Link 
                  href={`/insurance/${claimId}/scope/new`} 
                  className="text-sm text-forensic-600 hover:text-forensic-700 font-medium"
                >
                  Add Comparison
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {scopes.length === 0 ? (
                <p className="text-sm text-gray-600">No scope comparisons yet</p>
              ) : (
                <div className="space-y-4">
                  {scopes.map((scope) => (
                    <div key={scope.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-gray-900">Scope Analysis</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Created {timeAgo(scope.createdAt)}
                          </div>
                        </div>
                        {scope.totalDifference && (
                          <div className="text-right">
                            <div className="text-xs text-gray-600">Difference</div>
                            <div className="text-lg font-bold text-warning-700">
                              {formatCurrency(scope.totalDifference)}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {scope.isResolved ? (
                        <Badge variant="success">Resolved</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                      
                      {scope.analysisNotes && (
                        <p className="text-sm text-gray-600 mt-3">{scope.analysisNotes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </ForensicCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href={`/insurance/${claimId}/interactions/new`} className="btn-primary w-full">
                  Log Interaction
                </Link>
                <Link href={`/insurance/${claimId}/scope/new`} className="btn-secondary w-full">
                  Compare Scopes
                </Link>
                <Link href={`/properties/${property.id}/documents/upload`} className="btn-secondary w-full">
                  Upload Evidence
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <ForensicCard>
            <CardHeader>
              <CardTitle>Claim Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claim.closedAt && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Closed</div>
                      <div className="text-xs text-gray-500">{formatDate(claim.closedAt)}</div>
                    </div>
                  </div>
                )}
                {claim.filedAt && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-forensic-600 rounded-full mt-2"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Filed</div>
                      <div className="text-xs text-gray-500">{formatDate(claim.filedAt)}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Created</div>
                    <div className="text-xs text-gray-500">{formatDate(claim.createdAt)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </ForensicCard>

          {/* ATOS Insights */}
          {!claim.closedAt && (
            <Card className="border-l-4 border-l-forensic-500">
              <CardHeader>
                <CardTitle className="text-sm">ATOS Insight</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-700">
                  {interactions.length === 0 ? (
                    <p>Log carrier interactions to build a comprehensive claim history and improve negotiation outcomes.</p>
                  ) : approvalRate > 0 && approvalRate < 90 ? (
                    <p>Your approval rate is below optimal. Consider documenting additional evidence or requesting scope review.</p>
                  ) : (
                    <p>Continue documenting all carrier communications. Your claim is progressing well.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
