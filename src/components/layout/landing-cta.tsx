import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Landing CTA Section
 *
 * Final conversion point before the footer.
 * Reinforces trust and urgency without being aggressive.
 */
export function LandingCTA() {
  return (
    <section id="cta" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ready to Build Equity from{" "}
          <span className="gradient-text">Every Storm?</span>
        </h2>
        <p className="mt-5 text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          Join the platform trusted by property owners, contractors, and
          insurance professionals to turn forensic precision into measurable
          financial outcomes.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="group flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="#features"
            className="flex items-center gap-2 px-8 py-4 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
          >
            Explore the Platform
          </Link>
        </div>
        <p className="mt-6 text-xs text-slate-400">
          Enterprise-grade security. No credit card required. SOC 2 compliant.
        </p>
      </div>
    </section>
  );
}
