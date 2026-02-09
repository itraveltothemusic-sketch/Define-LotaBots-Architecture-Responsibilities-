/**
 * Landing Page
 * 
 * Public-facing landing page that explains the platform and drives sign-ups.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle, Shield, TrendingUp, FileSearch, Zap, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-primary">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Equity Builders</h1>
            <p className="text-slate-400 text-xs">Forensic Property Intelligence</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:bg-slate-800">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-brand-accent hover:bg-amber-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transform Storm Damage Into{' '}
            <span className="text-brand-accent">Verified Equity Gains</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            The only platform that combines forensic property inspections, insurance intelligence, 
            and AI-guided execution to maximize legitimate recovery from commercial property damage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-brand-accent hover:bg-amber-600 px-8">
                Start Your Assessment
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="bg-white text-brand-primary hover:bg-slate-100">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-accent mb-2">$847M</div>
            <div className="text-slate-300">Total Claims Managed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-accent mb-2">94%</div>
            <div className="text-slate-300">Claim Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-accent mb-2">32%</div>
            <div className="text-slate-300">Avg. Recovery Increase</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-4">
              Built for Trust, Precision, and Authority
            </h2>
            <p className="text-lg text-brand-muted">
              Every feature designed to maximize your legitimate insurance recovery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card hover>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileSearch className="w-6 h-6 text-brand-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-brand-primary mb-2">
                Forensic Documentation
              </h3>
              <p className="text-brand-muted">
                Military-grade documentation with timestamped evidence, damage classification, 
                and verification workflows that hold up to carrier scrutiny.
              </p>
            </Card>

            <Card hover>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-brand-success" />
              </div>
              <h3 className="text-lg font-semibold text-brand-primary mb-2">
                Insurance Intelligence
              </h3>
              <p className="text-brand-muted">
                Track claims with carrier-grade precision. Automatic discrepancy detection 
                finds gaps between your scope and adjuster assessments.
              </p>
            </Card>

            <Card hover>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-brand-primary mb-2">
                ATOS AI Assistant
              </h3>
              <p className="text-brand-muted">
                Not a chatbot - a forensic strategist. ATOS guides every decision with 
                evidence-based reasoning and proactive risk identification.
              </p>
            </Card>

            <Card hover>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="text-lg font-semibold text-brand-primary mb-2">
                Contractor Verification
              </h3>
              <p className="text-brand-muted">
                Vetted contractors with real-time progress tracking, compliance monitoring, 
                and photographic verification of every milestone.
              </p>
            </Card>

            <Card hover>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-brand-primary mb-2">
                Equity Outcomes
              </h3>
              <p className="text-brand-muted">
                Measure true value creation. Before/after valuations with complete 
                documentation of equity gain and ROI.
              </p>
            </Card>

            <Card hover>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-brand-primary mb-2">
                Complete Audit Trail
              </h3>
              <p className="text-brand-muted">
                Every action logged, every decision documented. Complete transparency 
                for audits, appeals, or legal proceedings.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-brand-secondary to-blue-800 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Maximize Your Property Recovery?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join property owners who have recovered millions in legitimate claims 
            through forensic documentation and strategic execution.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-brand-accent hover:bg-amber-600 px-8">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-3">Equity Builders</h3>
              <p className="text-slate-400 text-sm">
                Forensic Property Intelligence Platform
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            © {new Date().getFullYear()} Equity Builders. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
