import Link from 'next/link';
import { Building2, Shield, TrendingUp, Brain, FileSearch, Users, ArrowRight, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950">
      {/* Navigation */}
      <nav className="border-b border-dark-800 bg-dark-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold text-white">Equity Builders</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="#features" className="text-dark-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-dark-300 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-dark-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/auth/login" className="text-dark-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="forensic-button forensic-button-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-accent-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-300 text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              <span>Forensic Property Intelligence Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Storm Damage Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-primary-400">
                Verified Equity Gains
              </span>
            </h1>
            
            <p className="text-xl text-dark-300 mb-12 leading-relaxed">
              Professional forensic inspections, insurance intelligence, and AI-guided execution 
              for commercial property owners. Maximize legitimate claim value with precision documentation 
              and transparent verification.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/auth/register" 
                className="forensic-button forensic-button-primary text-lg px-8 py-4"
              >
                Start Your First Property
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="#demo" 
                className="forensic-button forensic-button-secondary text-lg px-8 py-4 bg-dark-800 border-dark-700 text-white hover:bg-dark-700"
              >
                Watch Demo
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-400">$2.4M</div>
                <div className="text-sm text-dark-400 mt-1">Avg Equity Gain</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-400">98%</div>
                <div className="text-sm text-dark-400 mt-1">Claim Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-400">45 Days</div>
                <div className="text-sm text-dark-400 mt-1">Avg Settlement Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Enterprise-Grade Intelligence Platform
            </h2>
            <p className="text-xl text-dark-300">
              Built for trust, precision, and authority in commercial property restoration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 hover:border-primary-500/50 transition-all">
              <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-6">
                <FileSearch className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Forensic Documentation</h3>
              <p className="text-dark-300 mb-4">
                Military-grade damage documentation with photo/video evidence, measurements, 
                and AI-powered classification. Every detail captured and timestamped.
              </p>
              <ul className="space-y-2">
                {['HD photo & video capture', 'GPS-tagged evidence', 'AI damage detection', 'Immutable audit trail'].map((item) => (
                  <li key={item} className="flex items-start text-sm text-dark-400">
                    <Check className="w-4 h-4 text-accent-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 hover:border-primary-500/50 transition-all">
              <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Insurance Intelligence</h3>
              <p className="text-dark-300 mb-4">
                End-to-end claim tracking with automated scope comparison. Identify discrepancies 
                and maximize legitimate claim value with evidence-based arguments.
              </p>
              <ul className="space-y-2">
                {['Scope comparison engine', 'Discrepancy detection', 'Carrier interaction logs', 'Supplement automation'].map((item) => (
                  <li key={item} className="flex items-start text-sm text-dark-400">
                    <Check className="w-4 h-4 text-accent-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 hover:border-primary-500/50 transition-all">
              <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">ATOS AI Assistant</h3>
              <p className="text-dark-300 mb-4">
                Your forensic guide and strategist. ATOS proactively guides you through every step, 
                explains complex concepts, and identifies risks and opportunities.
              </p>
              <ul className="space-y-2">
                {['Proactive guidance', 'Risk & gap detection', 'Strategy recommendations', 'Plain-language explanations'].map((item) => (
                  <li key={item} className="flex items-start text-sm text-dark-400">
                    <Check className="w-4 h-4 text-accent-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 hover:border-primary-500/50 transition-all">
              <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Contractor Execution</h3>
              <p className="text-dark-300 mb-4">
                Vetted contractor network with progress verification and compliance tracking. 
                Ensure quality work with photo requirements and milestone validation.
              </p>
              <ul className="space-y-2">
                {['Qualified contractor matching', 'Progress photo requirements', 'Compliance checklists', 'Quality verification'].map((item) => (
                  <li key={item} className="flex items-start text-sm text-dark-400">
                    <Check className="w-4 h-4 text-accent-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 hover:border-primary-500/50 transition-all">
              <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Equity Verification</h3>
              <p className="text-dark-300 mb-4">
                Before/after valuation with transparent equity gain calculation. Generate 
                professional reports for stakeholders, lenders, and investors.
              </p>
              <ul className="space-y-2">
                {['Pre/post valuations', 'Equity gain calculation', 'ROI analysis', 'Stakeholder reports'].map((item) => (
                  <li key={item} className="flex items-start text-sm text-dark-400">
                    <Check className="w-4 h-4 text-accent-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 hover:border-primary-500/50 transition-all">
              <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Intelligence Center</h3>
              <p className="text-dark-300 mb-4">
                Central command dashboard with real-time property overview, evidence timeline, 
                and actionable insights. Your mission control for equity optimization.
              </p>
              <ul className="space-y-2">
                {['Real-time dashboard', 'Evidence timeline', 'Stakeholder hub', 'Action recommendations'].map((item) => (
                  <li key={item} className="flex items-start text-sm text-dark-400">
                    <Check className="w-4 h-4 text-accent-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              From Storm Damage to Equity Gain
            </h2>
            <p className="text-xl text-dark-300">
              A proven process designed for maximum legitimate claim value
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500 transform -translate-x-1/2 hidden lg:block"></div>
            
            <div className="space-y-12">
              {[
                { step: 1, title: 'Property Intake', desc: 'Submit your property and incident details. Our system creates a comprehensive property profile and schedules forensic inspection.' },
                { step: 2, title: 'Forensic Inspection', desc: 'Certified inspector documents every detail with HD photos, videos, and measurements. AI analyzes damage and estimates scope.' },
                { step: 3, title: 'Claim Submission', desc: 'Professional claim package submitted to carrier. ATOS ensures all required documentation is complete and compelling.' },
                { step: 4, title: 'Scope Comparison', desc: 'Insurance estimate analyzed against forensic assessment. Discrepancies flagged and supplement requests generated automatically.' },
                { step: 5, title: 'Contractor Execution', desc: 'Qualified contractor assigned with clear scope. Progress monitored with photo requirements and milestone verification.' },
                { step: 6, title: 'Settlement & Equity Verification', desc: 'Final payout received. Before/after valuation calculated. Equity gain documented in professional outcome report.' },
              ].map((item, index) => (
                <div key={item.step} className={`flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="flex-1 lg:text-right">
                    <div className="inline-block text-left">
                      <div className="text-sm font-bold text-primary-400 mb-2">STEP {item.step}</div>
                      <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-dark-300 max-w-md">{item.desc}</p>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold shadow-forensic-lg z-10 relative">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Property Damage Into Equity?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join property owners who trust Equity Builders for forensic intelligence and proven results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/auth/register" 
              className="forensic-button text-lg px-8 py-4 bg-white text-primary-700 hover:bg-dark-50"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              href="/contact" 
              className="forensic-button text-lg px-8 py-4 bg-primary-700 text-white hover:bg-primary-800 border border-primary-500"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-950 border-t border-dark-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className="w-8 h-8 text-primary-400" />
                <span className="text-xl font-bold text-white">Equity Builders</span>
              </div>
              <p className="text-dark-400 text-sm">
                Forensic Property Intelligence Platform for commercial storm damage recovery.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="text-dark-400 hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="text-dark-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/demo" className="text-dark-400 hover:text-white">Demo</Link></li>
                <li><Link href="/docs" className="text-dark-400 hover:text-white">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-dark-400 hover:text-white">About</Link></li>
                <li><Link href="/contact" className="text-dark-400 hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="text-dark-400 hover:text-white">Careers</Link></li>
                <li><Link href="/partners" className="text-dark-400 hover:text-white">Partners</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-dark-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-dark-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/security" className="text-dark-400 hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-800 mt-12 pt-8 text-center text-sm text-dark-400">
            <p>© 2026 Equity Builders. All rights reserved. Built with precision. Powered by intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
