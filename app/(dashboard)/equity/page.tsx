/**
 * Equity Outcomes Page
 * 
 * Comprehensive view of property equity gains, valuations,
 * and outcome reports.
 */

import { getCurrentUser } from "@/lib/auth/session";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  DocumentChartBarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils/format";

export default async function EquityOutcomesPage() {
  await getCurrentUser();

  // Mock data - will be replaced with real database queries
  const equityReports = [
    {
      id: "1",
      propertyName: "1401 Main Street Office Complex",
      reportDate: new Date("2024-08-20"),
      preStormValue: 8500000,
      postRestorationValue: 9200000,
      totalClaimPayout: 405000,
      totalRestorationCost: 425000,
      netEquityGain: 680000,
      status: "completed",
    },
    {
      id: "2",
      propertyName: "555 Industrial Way Warehouse",
      reportDate: new Date("2024-08-10"),
      preStormValue: 15800000,
      postRestorationValue: 16500000,
      totalClaimPayout: 285000,
      totalRestorationCost: 310000,
      netEquityGain: 675000,
      status: "completed",
    },
    {
      id: "3",
      propertyName: "789 Commerce Boulevard Retail Center",
      reportDate: new Date("2024-08-25"),
      preStormValue: 12300000,
      postRestorationValue: null,
      totalClaimPayout: null,
      totalRestorationCost: 890000,
      netEquityGain: null,
      status: "in_progress",
    },
  ];

  const totalEquityGained = equityReports
    .filter((r) => r.netEquityGain !== null)
    .reduce((sum, r) => sum + (r.netEquityGain || 0), 0);

  const averageGainPercentage =
    equityReports
      .filter((r) => r.netEquityGain !== null)
      .reduce((sum, r) => sum + ((r.netEquityGain || 0) / r.preStormValue) * 100, 0) /
    equityReports.filter((r) => r.netEquityGain !== null).length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Equity Outcomes</h1>
          <p className="text-gray-600">
            Track verified equity gains and property valuations across your portfolio
          </p>
        </div>
        <Button variant="primary">
          <DocumentChartBarIcon className="h-5 w-5 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total Equity Gained</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalEquityGained)}
            </p>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>From {equityReports.filter((r) => r.status === "completed").length} properties</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Avg Equity Gain</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatPercentage(averageGainPercentage)}
            </p>
            <p className="text-sm text-gray-500 mt-1">of pre-storm value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total Claims Paid</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                equityReports.reduce((sum, r) => sum + (r.totalClaimPayout || 0), 0)
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Completed Reports</p>
            <p className="text-3xl font-bold text-gray-900">
              {equityReports.filter((r) => r.status === "completed").length}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {equityReports.filter((r) => r.status === "in_progress").length} in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Equity Reports */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Property Equity Reports</h2>
        
        {equityReports.map((report) => (
          <Card key={report.id} variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{report.propertyName}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Report Date: {formatDate(report.reportDate)}
                  </p>
                </div>
                <Badge 
                  variant={report.status === "completed" ? "success" : "warning"}
                  size="lg"
                >
                  {report.status === "completed" ? "Completed" : "In Progress"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {report.status === "completed" ? (
                <>
                  {/* Valuation Comparison */}
                  <div className="grid md:grid-cols-3 gap-8 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Pre-Storm Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(report.preStormValue)}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowTrendingUpIcon className="h-12 w-12 text-green-600" />
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Post-Restoration Value</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(report.postRestorationValue || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="grid md:grid-cols-2 gap-8 mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">Financial Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Claim Payout</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(report.totalClaimPayout || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Restoration Cost</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(report.totalRestorationCost)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Net Insurance Benefit</span>
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency((report.totalClaimPayout || 0) - report.totalRestorationCost)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">Value Creation</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Property Value Increase</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency((report.postRestorationValue || 0) - report.preStormValue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Percentage Gain</span>
                          <span className="text-sm font-medium text-green-600">
                            {formatPercentage(
                              (((report.postRestorationValue || 0) - report.preStormValue) /
                                report.preStormValue) *
                                100
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Equity Gain */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Net Equity Gain</p>
                        <p className="text-4xl font-bold text-green-600">
                          {formatCurrency(report.netEquityGain || 0)}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          This represents the certified increase in property value after accounting
                          for all restoration costs and insurance proceeds.
                        </p>
                      </div>
                      <CurrencyDollarIcon className="h-20 w-20 text-green-600 opacity-20" />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <Link href={`/dashboard/equity/${report.id}`}>
                      <Button variant="outline" size="sm">
                        <DocumentChartBarIcon className="h-4 w-4 mr-2" />
                        View Full Report
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <ChartBarIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Equity Analysis In Progress
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    Property restoration is ongoing. Final equity report will be generated
                    upon project completion and post-restoration valuation.
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Estimated Completion</span>
                      <span className="font-medium text-gray-900">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-primary-600 h-3 rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
