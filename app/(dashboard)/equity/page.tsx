/**
 * Equity Outcomes Page
 * 
 * Display equity reports and financial outcomes for properties
 */

import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { equityReports, properties } from '@/lib/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { Plus, TrendingUp, DollarSign, FileText, Download } from 'lucide-react';
import Link from 'next/link';
import { ForensicCard, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function EquityOutcomesPage() {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  // Fetch user's properties
  const userProperties = userRole === 'internal'
    ? await db.select().from(properties)
    : await db.select().from(properties).where(eq(properties.ownerId, userId));

  const propertyIds = userProperties.map(p => p.id);

  // Fetch equity reports
  const reports = propertyIds.length > 0
    ? await db.select({
        report: equityReports,
        property: properties,
      })
      .from(equityReports)
      .leftJoin(properties, eq(equityReports.propertyId, properties.id))
      .where(inArray(equityReports.propertyId, propertyIds))
      .orderBy(desc(equityReports.createdAt))
    : [];

  // Calculate aggregate metrics
  const totalEquityGain = reports.reduce((sum, { report }) => 
    sum + (parseFloat(report.equityGain?.toString() || '0')), 0
  );
  
  const totalClaimPayout = reports.reduce((sum, { report }) => 
    sum + (parseFloat(report.totalClaimPayout?.toString() || '0')), 0
  );
  
  const totalRepairCost = reports.reduce((sum, { report }) => 
    sum + (parseFloat(report.totalRepairCost?.toString() || '0')), 0
  );

  const avgEquityGain = reports.length > 0 ? totalEquityGain / reports.length : 0;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Equity Outcomes</h1>
          <p className="page-description">
            Track verified equity gains and financial outcomes across your portfolio
          </p>
        </div>
        <Link href="/equity/new" className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Generate Report
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Equity Gain</p>
              <p className="text-3xl font-bold text-equity-700">{formatCurrency(totalEquityGain)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-equity-50 text-equity-600 flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Claims Paid</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalClaimPayout)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-forensic-50 text-forensic-600 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Repair Cost</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRepairCost)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Equity Gain</p>
              <p className="text-3xl font-bold text-equity-700">{formatCurrency(avgEquityGain)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-equity-50 text-equity-600 flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <ForensicCard className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Equity Reports Yet</h3>
          <p className="text-gray-600 mb-6">
            Generate equity outcome reports to track financial performance
          </p>
          <Link href="/equity/new" className="btn-primary inline-flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Generate First Report
          </Link>
        </ForensicCard>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {reports.map(({ report, property }) => {
            if (!property) return null;
            
            const equityGain = parseFloat(report.equityGain?.toString() || '0');
            const claimPayout = parseFloat(report.totalClaimPayout?.toString() || '0');
            const repairCost = parseFloat(report.totalRepairCost?.toString() || '0');
            const roi = repairCost > 0 ? ((claimPayout - repairCost) / repairCost) * 100 : 0;
            
            return (
              <Link key={report.id} href={`/equity/${report.id}`}>
                <ForensicCard className="h-full hover:shadow-forensic-lg transition-shadow cursor-pointer">
                  <div className="p-6">
                    {/* Property Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {property.address}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {property.city}, {property.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Report Date</div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(report.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Equity Gain Highlight */}
                    <div className="mb-6 p-4 bg-equity-50 rounded-lg border-2 border-equity-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-equity-700 font-medium mb-1">
                            Equity Gain
                          </div>
                          <div className="text-3xl font-bold text-equity-800">
                            {formatCurrency(equityGain)}
                          </div>
                        </div>
                        <TrendingUp className="h-10 w-10 text-equity-600" />
                      </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pre-Damage Value:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(report.preDamageValue)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Post-Repair Value:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(report.postRepairValue)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Claim Payout:</span>
                        <span className="font-medium text-forensic-700">
                          {formatCurrency(claimPayout)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Repair Cost:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(repairCost)}
                        </span>
                      </div>
                    </div>

                    {/* ROI */}
                    <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Return on Investment:</span>
                      <span className={`text-lg font-bold ${roi > 0 ? 'text-equity-700' : 'text-critical-700'}`}>
                        {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                      </span>
                    </div>

                    {/* Download Report */}
                    {report.reportUrl && (
                      <div className="mt-4">
                        <button className="w-full btn-secondary flex items-center justify-center text-sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF Report
                        </button>
                      </div>
                    )}
                  </div>
                </ForensicCard>
              </Link>
            );
          })}
        </div>
      )}

      {/* Insights Panel */}
      {reports.length > 0 && (
        <Card className="mt-8 border-l-4 border-l-forensic-500">
          <CardHeader>
            <CardTitle className="text-sm">Portfolio Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Portfolio Performance:</strong> Your {reports.length} completed {reports.length === 1 ? 'project has' : 'projects have'} generated {formatCurrency(totalEquityGain)} in total equity gains.
              </p>
              {avgEquityGain > 0 && (
                <p>
                  <strong>Average Equity Gain:</strong> Each property averages {formatCurrency(avgEquityGain)} in equity gains after completion.
                </p>
              )}
              {totalClaimPayout > totalRepairCost && (
                <p className="text-equity-700 font-medium">
                  Your insurance claims have exceeded repair costs by {formatCurrency(totalClaimPayout - totalRepairCost)}, demonstrating effective claim negotiation.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
