/**
 * Inspections Page
 * 
 * Manage forensic property inspections
 */

import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { inspections, properties } from '@/lib/db/schema';
import { desc, inArray, eq } from 'drizzle-orm';
import { Plus, FileSearch, CheckCircle, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ForensicCard } from '@/components/ui/Card';
import { formatDate, formatDateTime } from '@/lib/utils';

export default async function InspectionsPage() {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  // Fetch user's properties
  const userProperties = await db.select().from(properties);
  const propertyIds = userProperties.map(p => p.id);

  // Fetch inspections
  const allInspections = propertyIds.length > 0
    ? await db.select({
        inspection: inspections,
        property: properties,
      })
      .from(inspections)
      .leftJoin(properties, eq(inspections.propertyId, properties.id))
      .where(inArray(inspections.propertyId, propertyIds))
      .orderBy(desc(inspections.updatedAt))
    : [];

  const completedInspections = allInspections.filter(({ inspection }) => inspection.completedAt).length;
  const verifiedInspections = allInspections.filter(({ inspection }) => inspection.isVerified).length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Forensic Inspections</h1>
          <p className="page-description">
            Schedule and manage comprehensive property damage assessments
          </p>
        </div>
        <Link href="/inspections/new" className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Schedule Inspection
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Inspections</p>
              <p className="text-3xl font-bold text-gray-900">{allInspections.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-forensic-50 text-forensic-600 flex items-center justify-center">
              <FileSearch className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedInspections}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-equity-50 text-equity-600 flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Verified</p>
              <p className="text-3xl font-bold text-gray-900">{verifiedInspections}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-equity-50 text-equity-600 flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {allInspections.length - completedInspections}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Inspections List */}
      {allInspections.length === 0 ? (
        <ForensicCard className="text-center py-16">
          <FileSearch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Inspections Yet</h3>
          <p className="text-gray-600 mb-6">
            Schedule forensic inspections to document property damage
          </p>
          <Link href="/inspections/new" className="btn-primary inline-flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Schedule First Inspection
          </Link>
        </ForensicCard>
      ) : (
        <ForensicCard>
          <div className="divide-y divide-gray-200">
            {allInspections.map(({ inspection, property }) => {
              if (!property) return null;
              
              return (
                <Link
                  key={inspection.id}
                  href={`/inspections/${inspection.id}`}
                  className="block p-6 hover:bg-forensic-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {property.address}
                        </h3>
                        {inspection.isVerified && (
                          <Badge variant="success">Verified</Badge>
                        )}
                        {!inspection.completedAt && (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {property.city}, {property.state}
                      </p>

                      {inspection.summary && (
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          {inspection.summary}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {inspection.scheduledAt && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {inspection.completedAt 
                                ? `Completed ${formatDate(inspection.completedAt)}`
                                : `Scheduled ${formatDate(inspection.scheduledAt)}`}
                            </span>
                          </div>
                        )}
                        {inspection.duration && (
                          <span>{inspection.duration} minutes</span>
                        )}
                      </div>
                    </div>

                    <div className="ml-4">
                      {inspection.completedAt ? (
                        <CheckCircle className="h-8 w-8 text-equity-600" />
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
