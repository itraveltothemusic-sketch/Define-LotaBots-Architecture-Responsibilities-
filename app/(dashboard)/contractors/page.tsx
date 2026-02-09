/**
 * Contractors Page
 * 
 * Manage contractor network and work orders
 */

import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { contractors, users, workOrders } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Plus, Users, CheckCircle, Star, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { ForensicCard } from '@/components/ui/Card';

export default async function ContractorsPage() {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  // Fetch contractors with user details
  const allContractors = await db
    .select({
      contractor: contractors,
      user: users,
    })
    .from(contractors)
    .leftJoin(users, eq(contractors.userId, users.id))
    .orderBy(desc(contractors.rating));

  // Fetch recent work orders
  const recentWorkOrders = await db
    .select()
    .from(workOrders)
    .orderBy(desc(workOrders.updatedAt))
    .limit(10);

  const activeContractors = allContractors.filter(({ contractor }) => contractor.status === 'active').length;
  const verifiedContractors = allContractors.filter(({ contractor }) => contractor.isVerified).length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Contractor Network</h1>
          <p className="page-description">
            Manage verified contractors and track work execution
          </p>
        </div>
        {session.user.role === 'internal' && (
          <Link href="/contractors/new" className="btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Contractor
          </Link>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Contractors</p>
              <p className="text-3xl font-bold text-gray-900">{allContractors.length}</p>
              <p className="text-sm text-gray-500 mt-2">{activeContractors} active</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-forensic-50 text-forensic-600 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Verified</p>
              <p className="text-3xl font-bold text-gray-900">{verifiedContractors}</p>
              <p className="text-sm text-gray-500 mt-2">
                {allContractors.length > 0 ? Math.round((verifiedContractors / allContractors.length) * 100) : 0}% of total
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-equity-50 text-equity-600 flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Active Work Orders</p>
              <p className="text-3xl font-bold text-gray-900">
                {recentWorkOrders.filter(w => w.status === 'in_progress').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <Briefcase className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Rating</p>
              <p className="text-3xl font-bold text-gray-900">
                {allContractors.length > 0
                  ? (allContractors.reduce((sum, { contractor }) => 
                      sum + (parseFloat(contractor.rating?.toString() || '0')), 0) / allContractors.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center">
              <Star className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Contractors Grid */}
      {allContractors.length === 0 ? (
        <ForensicCard className="text-center py-16">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Contractors Yet</h3>
          <p className="text-gray-600 mb-6">
            Start building your verified contractor network
          </p>
          {session.user.role === 'internal' && (
            <Link href="/contractors/new" className="btn-primary inline-flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add First Contractor
            </Link>
          )}
        </ForensicCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allContractors.map(({ contractor, user }) => {
            if (!user) return null;
            
            const completionRate = contractor.totalJobs > 0
              ? (contractor.completedJobs / contractor.totalJobs) * 100
              : 0;
            
            return (
              <Link key={contractor.id} href={`/contractors/${contractor.id}`}>
                <ForensicCard className="h-full hover:shadow-forensic-lg transition-shadow cursor-pointer">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {contractor.companyName}
                          </h3>
                          {contractor.isVerified && (
                            <CheckCircle className="h-5 w-5 text-equity-600" />
                          )}
                        </div>
                        <Badge variant={getStatusBadgeVariant(contractor.status)}>
                          {contractor.status}
                        </Badge>
                      </div>
                      {contractor.rating && parseFloat(contractor.rating.toString()) > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 text-warning-500 fill-warning-500" />
                          <span className="font-semibold text-gray-900">
                            {parseFloat(contractor.rating.toString()).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Contact */}
                    <div className="space-y-1 mb-4">
                      <div className="text-sm text-gray-600">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.phone && (
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      )}
                    </div>

                    {/* License */}
                    {contractor.licenseNumber && (
                      <div className="text-xs text-gray-500 mb-4">
                        License: {contractor.licenseNumber}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-gray-900">
                            {contractor.totalJobs}
                          </div>
                          <div className="text-xs text-gray-600">Total Jobs</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-equity-600">
                            {completionRate.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-600">Completion</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ForensicCard>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
