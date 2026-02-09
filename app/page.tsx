/**
 * Landing Page
 * 
 * Public-facing home page showcasing the platform's value proposition.
 */

import Link from "next/link";
import Button from "@/components/ui/Button";
import { 
  ShieldCheckIcon, 
  DocumentMagnifyingGlassIcon, 
  ChartBarIcon, 
  CpuChipIcon,
  BuildingOfficeIcon,
  UserGroupIcon 
} from "@heroicons/react/24/outline";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Equity Builders</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium">How It Works</a>
              <a href="#about" className="text-gray-700 hover:text-primary-600 font-medium">About</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Transform Storm Damage Into
              <span className="text-primary-600"> Verified Equity Gains</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              The forensic property intelligence platform that turns commercial storm-damaged properties 
              into certified value through precision documentation, insurance optimization, and AI-guided strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Start Your First Property
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Precision, Trust, and Authority
            </h2>
            <p className="text-xl text-gray-600">
              Every feature designed to maximize recoverable value and verify outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <DocumentMagnifyingGlassIcon className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Forensic Documentation
              </h3>
              <p className="text-gray-600">
                Precision-grade evidence collection with AI categorization. Every detail documented, timestamped, and verifiable.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <ShieldCheckIcon className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Insurance Intelligence
              </h3>
              <p className="text-gray-600">
                Track claims, compare scopes, detect discrepancies. Close gaps between initial and final payouts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <UserGroupIcon className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Contractor Orchestration
              </h3>
              <p className="text-gray-600">
                Assign scopes, track progress, verify compliance. Coordinate all restoration work from one platform.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <ChartBarIcon className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Equity Outcome Analysis
              </h3>
              <p className="text-gray-600">
                Measure before/after valuations. Calculate verified equity gains. Generate comprehensive outcome reports.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <CpuChipIcon className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ATOS Intelligence Assistant
              </h3>
              <p className="text-gray-600">
                AI-powered guidance that surfaces risks, opportunities, and strategic recommendations at every step.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <BuildingOfficeIcon className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Role-Based Access
              </h3>
              <p className="text-gray-600">
                Secure portals for owners, contractors, adjusters, and internal teams. Everyone sees what they need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Equity Builders Works
            </h2>
            <p className="text-xl text-gray-600">
              From initial damage to verified equity gain in five strategic phases.
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Property Intake & Forensic Documentation
                </h3>
                <p className="text-gray-600 text-lg">
                  Create comprehensive property profiles. Schedule inspections. Collect and categorize evidence 
                  (photos, videos, documents) with AI-powered analysis. Classify damage types and severity.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Insurance Intelligence Layer
                </h3>
                <p className="text-gray-600 text-lg">
                  Track claim lifecycle from filing to settlement. Log carrier interactions. Compare scopes 
                  (initial vs adjuster vs contractor). Detect and resolve discrepancies automatically.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Contractor Orchestration
                </h3>
                <p className="text-gray-600 text-lg">
                  Onboard verified contractors. Assign clear scope specifications. Track progress through 
                  milestones. Monitor compliance (licensing, insurance, quality standards).
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                4
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Equity Outcome Analysis
                </h3>
                <p className="text-gray-600 text-lg">
                  Measure pre-storm and post-restoration valuations. Calculate claim payout vs actual recovery. 
                  Certify net equity gains with supporting evidence. Generate comprehensive reports.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                5
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  ATOS Strategic Guidance
                </h3>
                <p className="text-gray-600 text-lg">
                  Throughout every phase, ATOS provides proactive insights, surfaces risks and opportunities, 
                  explains "why this matters," and translates complexity into confident action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Properties?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join property owners, contractors, and insurance professionals who trust 
            Equity Builders to maximize recovery and verify outcomes.
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BuildingOfficeIcon className="h-6 w-6 text-primary-400" />
                <span className="text-lg font-bold text-white">Equity Builders</span>
              </div>
              <p className="text-sm">
                Forensic Property Intelligence Platform for maximizing recoverable value 
                from storm-damaged commercial properties.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><Link href="/login" className="hover:text-white">Login</Link></li>
                <li><Link href="/register" className="hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Equity Builders. All rights reserved.</p>
            <p className="mt-2 text-gray-500">Built with precision. Powered by intelligence. Designed for trust.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
