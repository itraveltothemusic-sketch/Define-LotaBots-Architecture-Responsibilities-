import type { AppModule } from "@/lib/auth/permissions";

export type NavIconKey = "radar" | "building" | "shield" | "hammer" | "chart";
export type AppRoute = "/dashboard" | "/forensic" | "/insurance" | "/execution" | "/equity";

export interface NavItem {
  label: string;
  href: AppRoute;
  module: AppModule;
  icon: NavIconKey;
  shortDescription: string;
}

export const APP_NAV_ITEMS: NavItem[] = [
  {
    label: "Intelligence Center",
    href: "/dashboard",
    module: "intelligence",
    icon: "radar",
    shortDescription: "Forensic command view",
  },
  {
    label: "Forensic Property",
    href: "/forensic",
    module: "forensic",
    icon: "building",
    shortDescription: "Inspections and evidence",
  },
  {
    label: "Insurance Intelligence",
    href: "/insurance",
    module: "insurance",
    icon: "shield",
    shortDescription: "Claims and carrier strategy",
  },
  {
    label: "Contractor Execution",
    href: "/execution",
    module: "execution",
    icon: "hammer",
    shortDescription: "Delivery and compliance",
  },
  {
    label: "Equity Outcome",
    href: "/equity",
    module: "equity",
    icon: "chart",
    shortDescription: "Verified financial outcomes",
  },
];
