/**
 * Property Detail Page
 * 
 * Comprehensive view of a single property with all related data
 */

import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { properties, inspections, documents, insuranceClaims, workOrders } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign,
  FileText,
  FileSearch,
  Image,
  Users,
  AlertCircle,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { ForensicCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  const propertyId = params.id;

  // Fetch property
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, propertyId))
    .limit(1);

  if (!property) {
    notFound();
  }

  // Check access
  if (session.user.role !== 'internal' && property.ownerId !== session.user.id) {
    notFound();
  }

  // Fetch related data
  const propertyInspections = await db
    .select()
    .from(inspections)
    .where(eq(inspections.propertyId, propertyId))
    .orderBy(desc(inspections.createdAt));

  const propertyDocuments = await db
    .select()
    .from(documents)
    .where(eq(documents.propertyId, propertyId))
    .orderBy(desc(documents.createdAt))
    .limit(10);

  const propertyClaims = await db
    .select()
    .from(insuranceClaims)
    .where(eq(insuranceClaims.propertyId, propertyId))
    .orderBy(desc(insuranceClaims.createdAt));

  const propertyWorkOrders = await db
    .select()
    .from(workOrders)
    .where(eq(workOrders.propertyId, propertyId))
    .orderBy(desc(workOrders.createdAt));

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <Link href="/properties" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Properties
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{property.address}</h1>
              <Badge variant={getStatusBadgeVariant(property.status)}>
                {property.status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.city}, {property.state} {property.zipCode}</span>
            </div>
          </div>
          <Link href={`/properties/${propertyId}/edit`} className="btn-secondary flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Edit Property
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Overview */}
          <ForensicCard>
            <CardHeader>
              <CardTitle>Property Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Property Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">{property.propertyType}</span>
                    </div>
                    {property.squareFootage && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Square Footage:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {property.squareFootage.toLocaleString()} sq ft
                        </span>
                      </div>
                    )}
                    {property.yearBuilt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Year Built:</span>
                        <span className="text-sm font-medium text-gray-900">{property.yearBuilt}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Valuation</h4>
                  <div className="space-y-2">
                    {property.preDamageValue && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pre-Damage:</span>
                        <span className="text-sm font-semibold text-equity-700">
                          {formatCurrency(property.preDamageValue)}
                        </span>
                      </div>
                    )}
                    {property.currentValue && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(property.currentValue)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {property.stormType && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Storm Information</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm">
                      <AlertCircle className="h-4 w-4 mr-1 text-warning-600" />
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-1 font-medium text-gray-900 capitalize">{property.stormType}</span>
                    </div>
                    {property.stormDate && (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-gray-600">Date:</span>
                        <span className="ml-1 font-medium text-gray-900">{formatDate(property.stormDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </ForensicCard>

          {/* Inspections */}
          <ForensicCard>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileSearch className="h-5 w-5 mr-2 text-forensic-600" />
                  Inspections ({propertyInspections.length})
                </CardTitle>
                <Link href={`/inspections/new?propertyId=${propertyId}`} className="text-sm text-forensic-600 hover:text-forensic-700 font-medium">
                  Schedule New
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {propertyInspections.length === 0 ? (
                <p className="text-sm text-gray-600">No inspections scheduled yet</p>
              ) : (
                <div className="space-y-3">
                  {propertyInspections.map((inspection) => (
                    <Link
                      key={inspection.id}
                      href={`/inspections/${inspection.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-forensic-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {inspection.completedAt ? 'Completed Inspection' : 'Scheduled Inspection'}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {inspection.completedAt 
                              ? `Completed ${formatDate(inspection.completedAt)}`
                              : inspection.scheduledAt 
                                ? `Scheduled for ${formatDate(inspection.scheduledAt)}`
                                : 'Date TBD'}
                          </div>
                          {inspection.summary && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{inspection.summary}</p>
                          )}
                        </div>
                        {inspection.isVerified && (
                          <Badge variant="success">Verified</Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </ForensicCard>

          {/* Documents */}
          <ForensicCard>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Image className="h-5 w-5 mr-2 text-forensic-600" />
                  Documents ({propertyDocuments.length})
                </CardTitle>
                <Link href={`/properties/${propertyId}/documents`} className="text-sm text-forensic-600 hover:text-forensic-700 font-medium">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {propertyDocuments.length === 0 ? (
                <p className="text-sm text-gray-600">No documents uploaded yet</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {propertyDocuments.slice(0, 6).map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-3 hover:border-forensic-300 transition-colors">
                      <div className="flex items-start space-x-2">
                        <FileText className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {doc.documentType.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </div>
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
                <Link href={`/inspections/new?propertyId=${propertyId}`} className="btn-primary w-full">
                  Schedule Inspection
                </Link>
                <Link href={`/insurance/new?propertyId=${propertyId}`} className="btn-secondary w-full">
                  File Claim
                </Link>
                <Link href={`/properties/${propertyId}/documents/upload`} className="btn-secondary w-full">
                  Upload Documents
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Claims Summary */}
          <ForensicCard>
            <CardHeader>
              <CardTitle>Insurance Claims ({propertyClaims.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {propertyClaims.length === 0 ? (
                <p className="text-sm text-gray-600">No claims filed yet</p>
              ) : (
                <div className="space-y-3">
                  {propertyClaims.map((claim) => (
                    <Link
                      key={claim.id}
                      href={`/insurance/${claim.id}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-forensic-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {claim.claimNumber || 'Draft'}
                        </span>
                        <Badge variant={getStatusBadgeVariant(claim.status)}>
                          {claim.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">{claim.carrierName}</div>
                      {claim.claimedAmount && (
                        <div className="text-sm font-semibold text-forensic-700 mt-2">
                          {formatCurrency(claim.claimedAmount)}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </ForensicCard>

          {/* Work Orders */}
          <ForensicCard>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-forensic-600" />
                Work Orders ({propertyWorkOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {propertyWorkOrders.length === 0 ? (
                <p className="text-sm text-gray-600">No work orders yet</p>
              ) : (
                <div className="space-y-2">
                  {propertyWorkOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/contractors/work-orders/${order.id}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-forensic-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{order.title}</span>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      {order.completionPercentage > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{order.completionPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-forensic-600 h-2 rounded-full transition-all"
                              style={{ width: `${order.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </ForensicCard>
        </div>
      </div>
    </div>
  );
}
