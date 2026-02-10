/**
 * ATOS Intelligence Page
 * 
 * Dedicated interface for the ATOS AI assistant.
 * This is not a chatbot—it's a strategic guide that proactively
 * surfaces insights, explains "why this matters," and translates
 * complexity into confidence.
 */

import { getCurrentUser } from "@/lib/auth/session";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { 
  SparklesIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import type { ATOSInsight } from "@/types";

export default async function ATOSIntelligencePage() {
  const user = await getCurrentUser();

  // Mock insights - will be replaced with AI-generated insights from database
  const insights: ATOSInsight[] = [
    {
      id: "1",
      type: "alert",
      title: "Claim Timeline Exceeding Industry Average",
      description: "Your claim CLM-2024-001 for 1401 Main Street has been pending for 47 days, which is 12 days above the industry average for commercial property claims of this type and severity.",
      priority: 1,
      reasoning: "Extended processing times often indicate missing documentation, scope discrepancies, or insufficient carrier follow-up. Properties with similar damage profiles that maintained 7-day follow-up intervals closed 23% faster on average. Proactive engagement now can prevent further delays and potentially increase final payout by addressing gaps before the adjuster's next review cycle.",
      actionable: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      type: "opportunity",
      title: "HVAC Documentation Gap Could Increase Claim Value",
      description: "Water intrusion photos from the HVAC room at 1401 Main Street show secondary damage that may not be captured in the current scope. This could add $68,000-$92,000 to your claim value.",
      priority: 2,
      reasoning: "Analysis of 127 similar commercial properties reveals that comprehensive HVAC system documentation—including ductwork moisture readings, air handler inspection reports, and thermal imaging—resulted in 15-20% higher adjustments during scope comparison. Your current documentation covers primary damage but lacks the detailed secondary impact evidence that carriers typically approve without dispute. Adding this documentation now, before the adjuster's final review, has an 89% approval rate based on historical data.",
      actionable: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: "3",
      type: "recommendation",
      title: "Contractor Milestone Verification Due",
      description: "Foundation repair milestone for 555 Industrial Way is scheduled for verification in 2 days (Sept 1). Schedule inspection now to avoid project delays.",
      priority: 3,
      reasoning: "Work order milestones that miss verification deadlines cause an average 8-day project delay, which can cascade into additional costs and extend claim settlement timelines. Your contractor (Elite Construction) has a 98% on-time completion rate when inspections are scheduled at least 48 hours in advance.",
      actionable: true,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
      id: "4",
      type: "opportunity",
      title: "Pre-Restoration Valuation Timing Optimal",
      description: "Market conditions in your area show 6.2% commercial real estate appreciation over the past 12 months. Scheduling post-restoration valuations now can maximize certified equity gains.",
      priority: 4,
      reasoning: "Properties that complete restoration during upward market trends capture both the restoration value and market appreciation in their post-restoration valuations. Waiting until market conditions change could reduce your certified equity gain by $120,000-$180,000 based on current trajectory models for your property types.",
      actionable: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "5",
      type: "risk",
      title: "Pending Information Request - Claim at Risk",
      description: "Claim CLM-2024-004 moved to 'Pending Information' status. Carrier requested additional structural engineering reports within 10 business days.",
      priority: 1,
      reasoning: "Claims that remain in 'Pending Information' status for more than 14 days have a 34% higher likelihood of payout reduction. The carrier's specific request for structural engineering reports indicates they're questioning the severity classification in your initial submission. Providing third-party engineering validation quickly can prevent scope reduction.",
      actionable: true,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
    {
      id: "6",
      type: "recommendation",
      title: "Scope Comparison Ready for Review",
      description: "You now have 3 scope versions for 789 Commerce Boulevard (Initial, Adjuster, Contractor). ATOS has identified 7 discrepancies totaling $43,200.",
      priority: 2,
      reasoning: "Scope discrepancies that go unaddressed during the review period typically result in the carrier's lower estimate becoming the final approved amount. Proactively documenting justifications for discrepancies and submitting supplemental evidence increases approval rates by 67%. The 7 identified discrepancies include: roofing material grade differences ($18,500), HVAC unit count mismatch ($12,800), and structural support requirements ($11,900).",
      actionable: true,
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    },
  ];

  const getInsightIcon = (type: ATOSInsight["type"]) => {
    switch (type) {
      case "alert":
        return ExclamationTriangleIcon;
      case "opportunity":
        return LightBulbIcon;
      case "recommendation":
        return CheckCircleIcon;
      case "risk":
        return ExclamationTriangleIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const getInsightColor = (type: ATOSInsight["type"]) => {
    switch (type) {
      case "alert":
      case "risk":
        return { bg: "bg-red-50", border: "border-red-200", text: "text-red-900", icon: "text-red-600" };
      case "opportunity":
        return { bg: "bg-green-50", border: "border-green-200", text: "text-green-900", icon: "text-green-600" };
      case "recommendation":
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900", icon: "text-blue-600" };
      default:
        return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-900", icon: "text-gray-600" };
    }
  };

  const getInsightBadge = (type: ATOSInsight["type"]) => {
    switch (type) {
      case "alert":
      case "risk":
        return <Badge variant="danger">Alert</Badge>;
      case "opportunity":
        return <Badge variant="success">Opportunity</Badge>;
      case "recommendation":
        return <Badge variant="info">Recommendation</Badge>;
      default:
        return <Badge variant="default">Info</Badge>;
    }
  };

  // Group insights by priority
  const highPriorityInsights = insights.filter((i) => i.priority <= 2);
  const mediumPriorityInsights = insights.filter((i) => i.priority === 3 || i.priority === 4);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <SparklesIcon className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">ATOS Intelligence Center</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Your AI-powered strategic guide. ATOS analyzes your entire portfolio in real-time,
            surfaces critical insights, and explains why each recommendation matters for your equity outcomes.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Insights</p>
                <p className="text-3xl font-bold text-gray-900">{insights.length}</p>
              </div>
              <SparklesIcon className="h-10 w-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">High Priority</p>
                <p className="text-3xl font-bold text-red-600">{highPriorityInsights.length}</p>
              </div>
              <ExclamationTriangleIcon className="h-10 w-10 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Opportunities</p>
                <p className="text-3xl font-bold text-green-600">
                  {insights.filter((i) => i.type === "opportunity").length}
                </p>
              </div>
              <LightBulbIcon className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Potential Value</p>
                <p className="text-2xl font-bold text-green-600">$203K</p>
                <p className="text-xs text-gray-500 mt-1">From opportunities</p>
              </div>
              <ChartBarIcon className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Insights */}
      {highPriorityInsights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
            High Priority - Immediate Action Recommended
          </h2>
          {highPriorityInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const colors = getInsightColor(insight.type);

            return (
              <Card
                key={insight.id}
                className={`border-l-4 ${colors.border.replace("border-", "border-l-")} hover:shadow-xl transition-shadow`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {insight.title}
                        </h3>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge variant="danger" size="sm">P{insight.priority}</Badge>
                          {getInsightBadge(insight.type)}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {insight.description}
                      </p>

                      {insight.reasoning && (
                        <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 mb-4`}>
                          <p className="text-sm font-semibold mb-2 flex items-center">
                            <InformationCircleIcon className="h-4 w-4 mr-2" />
                            Why This Matters
                          </p>
                          <p className={`text-sm ${colors.text} leading-relaxed`}>
                            {insight.reasoning}
                          </p>
                        </div>
                      )}

                      {insight.actionable && (
                        <div className="flex items-center space-x-3">
                          <Button variant="primary" size="sm">
                            Take Action
                          </Button>
                          <Button variant="ghost" size="sm">
                            Dismiss
                          </Button>
                          <span className="text-xs text-gray-500">
                            {new Date(insight.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Medium Priority Insights */}
      {mediumPriorityInsights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-2" />
            Recommendations & Opportunities
          </h2>
          {mediumPriorityInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const colors = getInsightColor(insight.type);

            return (
              <Card
                key={insight.id}
                className={`border-l-4 ${colors.border.replace("border-", "border-l-")} hover:shadow-lg transition-shadow`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {insight.title}
                        </h3>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge variant="info" size="sm">P{insight.priority}</Badge>
                          {getInsightBadge(insight.type)}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {insight.description}
                      </p>

                      {insight.reasoning && (
                        <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 mb-4`}>
                          <p className="text-sm font-semibold mb-2 flex items-center">
                            <InformationCircleIcon className="h-4 w-4 mr-2" />
                            Why This Matters
                          </p>
                          <p className={`text-sm ${colors.text} leading-relaxed`}>
                            {insight.reasoning}
                          </p>
                        </div>
                      )}

                      {insight.actionable && (
                        <div className="flex items-center space-x-3">
                          <Button variant="outline" size="sm">
                            Take Action
                          </Button>
                          <Button variant="ghost" size="sm">
                            Dismiss
                          </Button>
                          <span className="text-xs text-gray-500">
                            {new Date(insight.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ATOS Info Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <SparklesIcon className="h-12 w-12 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                About ATOS Intelligence
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                ATOS (Automated Tactical Operations System) is not a chatbot—it's your forensic strategist
                and guide. ATOS continuously analyzes your entire property portfolio, comparing your data
                against thousands of similar cases to surface insights you might miss.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Proactively identifies risks, gaps, and opportunities before they impact outcomes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Explains "why this matters" with data-driven reasoning from historical patterns</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Translates complex insurance and construction processes into confident action</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Never hallucinates facts—only reasons from your actual property data</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
