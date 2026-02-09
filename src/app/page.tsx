import { LandingHero } from "@/components/layout/landing-hero";
import { LandingFeatures } from "@/components/layout/landing-features";
import { LandingStats } from "@/components/layout/landing-stats";
import { LandingCTA } from "@/components/layout/landing-cta";
import { LandingNav } from "@/components/layout/landing-nav";
import { LandingFooter } from "@/components/layout/landing-footer";

/**
 * Landing Page — The first impression.
 *
 * This page must communicate:
 * 1. What Equity Builders does (transform storm damage into equity)
 * 2. Who it's for (property owners, contractors, adjusters)
 * 3. Why it's credible (forensic precision, data-driven, AI-guided)
 * 4. What to do next (sign in / request access)
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <LandingNav />
      <LandingHero />
      <LandingStats />
      <LandingFeatures />
      <LandingCTA />
      <LandingFooter />
    </main>
  );
}
