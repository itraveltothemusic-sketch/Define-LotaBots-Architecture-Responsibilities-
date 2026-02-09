/**
 * Properties List Page
 * 
 * Displays all properties with filtering and search capabilities
 */

import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { properties } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Plus, Building2, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { ForensicCard } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function PropertiesPage() {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  // Fetch properties based on role
  const userProperties = userRole === 'internal'
    ? await db.select().from(properties).orderBy(desc(properties.updatedAt))
    : await db.select().from(properties).where(eq(properties.ownerId, userId)).orderBy(desc(properties.updatedAt));

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Properties</h1>
          <p className="page-description">
            Manage all storm-damaged properties and track their recovery journey
          </p>
        </div>
        <Link href="/properties/new" className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </Link>
      </div>

      {/* Properties Grid */}
      {userProperties.length === 0 ? (
        <ForensicCard className="text-center py-16">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first storm-damaged property
          </p>
          <Link href="/properties/new" className="btn-primary inline-flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Property
          </Link>
        </ForensicCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProperties.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`}>
              <ForensicCard className="h-full hover:shadow-forensic-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Badge variant={getStatusBadgeVariant(property.status)} className="mb-2">
                        {property.status.replace(/_/g, ' ')}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {property.address}
                      </h3>
                    </div>
                    <Building2 className="h-8 w-8 text-forensic-600 flex-shrink-0" />
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{property.city}, {property.state} {property.zipCode}</span>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">{property.propertyType}</span>
                    </div>
                    {property.squareFootage && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium text-gray-900">
                          {property.squareFootage.toLocaleString()} sq ft
                        </span>
                      </div>
                    )}
                    {property.preDamageValue && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pre-Damage Value:</span>
                        <span className="font-medium text-equity-700">
                          {formatCurrency(property.preDamageValue)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Storm Info */}
                  {property.stormType && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="capitalize">{property.stormType}</span>
                        {property.stormDate && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{formatDate(property.stormDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ForensicCard>
            </Link>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {userProperties.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{userProperties.length}</div>
            <div className="text-sm text-gray-600">Total Properties</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-forensic-600">
              {userProperties.filter(p => p.status === 'in_repair' || p.status === 'claim_submitted').length}
            </div>
            <div className="text-sm text-gray-600">Active Cases</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-equity-600">
              {userProperties.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                userProperties.reduce((sum, p) => sum + (parseFloat(p.preDamageValue?.toString() || '0')), 0)
              )}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>
      )}
    </div>
  );
}
