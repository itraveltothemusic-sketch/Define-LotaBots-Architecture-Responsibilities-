/**
 * ATOS Intelligence Panel
 * 
 * Proactive AI assistant that surfaces insights, risks, and opportunities.
 * This is not a chatbot—it's a strategic guide embedded in the platform.
 */

"use client";

import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { 
  LightBulbIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  SparklesIcon 
} from "@heroicons/react/24/outline";
import type { ATOSInsight } from "@/types";

interface ATOSPanelProps {
  insights?: ATOSInsight[];
  compact?: boolean;
}

// Mock insights for demonstration
const mockInsights: ATOSInsight[] = [
  {
    id: "1",
    type: "alert",
    title: "Claim Timeline Exceeding Average",
    description: "Your claim has been pending for 47 days, which is 12 days above industry average for this claim type.",
    priority: 1,
    reasoning: "Extended processing times often indicate missing documentation or scope discrepancies. Proactive follow-up can accelerate resolution.",
    actionable: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    type: "opportunity",
    title: "Additional Documentation Recommended",
    description: "Water intrusion photos from HVAC room could increase claim value by 15-20% if properly categorized.",
    priority: 2,
    reasoning: "Similar properties with comprehensive HVAC documentation received higher adjustments during scope comparison.",
    actionable: true,
    createdAt: new Date(),
  },
  {
    id: "3",
    type: "recommendation",
    title: "Contractor Milestone Verification Due",
    description: "Foundation repair milestone is scheduled for verification in 2 days. Schedule inspection now to avoid delays.",
    priority: 3,
    actionable: true,
    createdAt: new Date(),
  },
];

export default function ATOSPanel({ insights = mockInsights, compact = false }: ATOSPanelProps) {
  const getInsightIcon = (type: ATOSInsight["type"]) => {
    switch (type) {
      case "alert":
        return ExclamationTriangleIcon;
      case "opportunity":
        return LightBulbIcon;
      case "recommendation":
        return CheckCircleIcon;
      default:
        return SparklesIcon;
    }
  };

  const getInsightColor = (type: ATOSInsight["type"]) => {
    switch (type) {
      case "alert":
        return "danger";
      case "opportunity":
        return "success";
      case "recommendation":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Card className="border-l-4 border-l-purple-600">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
            <CardTitle>ATOS Intelligence</CardTitle>
          </div>
          <Badge variant="info" size="sm">
            {insights.length} Active
          </Badge>
        </div>
        {!compact && (
          <p className="text-sm text-gray-600 mt-2">
            Strategic insights and guidance tailored to your property portfolio
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <SparklesIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No active insights at the moment.</p>
            <p className="text-sm">ATOS is monitoring your properties and will surface opportunities as they arise.</p>
          </div>
        ) : (
          insights.slice(0, compact ? 3 : undefined).map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const badgeVariant = getInsightColor(insight.type);

            return (
              <div
                key={insight.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Icon className={cn(
                      "h-5 w-5",
                      insight.type === "alert" && "text-red-600",
                      insight.type === "opportunity" && "text-green-600",
                      insight.type === "recommendation" && "text-blue-600"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {insight.title}
                      </h4>
                      <Badge variant={badgeVariant as any} size="sm">
                        P{insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {insight.description}
                    </p>
                    {insight.reasoning && !compact && (
                      <div className="bg-purple-50 border border-purple-200 rounded px-3 py-2 mt-2">
                        <p className="text-xs text-purple-900">
                          <strong>Why this matters:</strong> {insight.reasoning}
                        </p>
                      </div>
                    )}
                    {insight.actionable && (
                      <button className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700">
                        Take Action →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {compact && insights.length > 3 && (
          <div className="text-center pt-2">
            <a href="/dashboard/intelligence" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View All Insights →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
