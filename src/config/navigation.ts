import type { ModuleNavItem } from "@/types/domain";

export const DASHBOARD_NAVIGATION: ModuleNavItem[] = [
  {
    title: "Intelligence Center",
    href: "/dashboard",
    description:
      "Cross-module forensic signal board for risk, progress, and next-best actions.",
    roles: ["OWNER", "CONTRACTOR", "ADJUSTER", "INTERNAL"],
  },
  {
    title: "Forensic Property",
    href: "/dashboard/forensic",
    description:
      "Property profiles, inspection findings, and verified evidence ingestion.",
    roles: ["OWNER", "ADJUSTER", "INTERNAL"],
  },
  {
    title: "Insurance Intelligence",
    href: "/dashboard/insurance",
    description:
      "Claim lifecycle governance, interaction intelligence, and scope variances.",
    roles: ["OWNER", "ADJUSTER", "INTERNAL"],
  },
  {
    title: "Contractor Execution",
    href: "/dashboard/execution",
    description:
      "Scope assignment, milestone verification, and contractor compliance tracking.",
    roles: ["OWNER", "CONTRACTOR", "INTERNAL"],
  },
  {
    title: "Equity Outcomes",
    href: "/dashboard/equity",
    description:
      "Before/after valuation, payout alignment, and equity gain narratives.",
    roles: ["OWNER", "INTERNAL"],
  },
];
