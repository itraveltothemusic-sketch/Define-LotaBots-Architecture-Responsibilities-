import type { PlatformRole } from "@/types/domain";

export interface PlatformRoutePolicy {
  href: string;
  title: string;
  description: string;
  allowedRoles: PlatformRole[];
}

export const platformRoutePolicies: PlatformRoutePolicy[] = [
  {
    href: "/platform/intelligence",
    title: "Intelligence Center",
    description: "Unified operational and risk command surface.",
    allowedRoles: ["OWNER", "CONTRACTOR", "ADJUSTER", "INTERNAL"],
  },
  {
    href: "/platform/forensic-property",
    title: "Forensic Property",
    description: "Inspection, evidence, and damage classification.",
    allowedRoles: ["OWNER", "CONTRACTOR", "ADJUSTER", "INTERNAL"],
  },
  {
    href: "/platform/insurance-intelligence",
    title: "Insurance Intelligence",
    description: "Claim posture, carrier logs, and scope deltas.",
    allowedRoles: ["OWNER", "ADJUSTER", "INTERNAL"],
  },
  {
    href: "/platform/contractor-execution",
    title: "Contractor Execution",
    description: "Onboarding, assignment verification, and compliance.",
    allowedRoles: ["OWNER", "CONTRACTOR", "INTERNAL"],
  },
  {
    href: "/platform/equity-outcome",
    title: "Equity Outcome",
    description: "Valuation impact, payout delta, and investment narrative.",
    allowedRoles: ["OWNER", "INTERNAL"],
  },
];

const routePrefixPolicy: Array<{
  prefix: string;
  allowedRoles: PlatformRole[];
}> = platformRoutePolicies.map(({ href, allowedRoles }) => ({
  prefix: href,
  allowedRoles,
}));

export function canAccessRoute(pathname: string, role: PlatformRole) {
  const policy = routePrefixPolicy.find((entry) => pathname.startsWith(entry.prefix));
  if (!policy) {
    return pathname.startsWith("/platform");
  }
  return policy.allowedRoles.includes(role);
}

export function getAccessiblePlatformRoutes(role: PlatformRole) {
  return platformRoutePolicies.filter((route) => route.allowedRoles.includes(role));
}
