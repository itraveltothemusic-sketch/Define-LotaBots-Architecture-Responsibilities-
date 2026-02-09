/**
 * Landing Page — The first thing visitors see.
 * 
 * Design philosophy: Authority + Trust + Precision.
 * This is not a SaaS marketing page. This is an enterprise platform
 * that communicates expertise and reliability. The design should feel
 * like walking into a high-end forensic consultancy.
 */

import Link from 'next/link';
import {
  Shield,
  TrendingUp,
  Brain,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BarChart3,
  FileSearch,
  HardHat,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">Equity Builders</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Launch Platform
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-6">
              <Brain className="w-3.5 h-3.5" />
              Powered by ATOS Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Forensic Property
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Intelligence Platform
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed max-w-2xl">
              Transform commercial storm-damaged properties into verified equity gains. 
              Forensic inspections. Insurance intelligence. AI-guided execution. 
              Every step documented. Every gain proven.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                Enter Intelligence Center
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
              >
                How It Works
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '$1.85M', label: 'Equity Gained', sublabel: 'Verified + Projected' },
              { value: '88.5%', label: 'Claim Approval Rate', sublabel: 'Above industry avg' },
              { value: '6', label: 'Active Properties', sublabel: 'In pipeline' },
              { value: '97%', label: 'Compliance Score', sublabel: 'Contractor average' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{stat.label}</p>
                <p className="text-xs text-slate-500">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Overview */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Every Property Is a Case. Every Document Is Evidence.</h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              Five integrated modules work together to move properties from damage discovery to verified equity gain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: 'Intelligence Center',
                description: 'Central command dashboard that surfaces what matters. Active properties, claim statuses, inspection timelines, and AI-recommended next actions.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: FileSearch,
                title: 'Forensic Property Module',
                description: 'Properties treated as forensic cases. Every inspection, photo, and document is timestamped, categorized, and linked to damage classifications.',
                color: 'from-emerald-500 to-emerald-600',
              },
              {
                icon: Shield,
                title: 'Insurance Intelligence',
                description: 'Claims tracked through full lifecycle. Scope comparisons detect discrepancies. The system surfaces gaps before they become losses.',
                color: 'from-violet-500 to-violet-600',
              },
              {
                icon: HardHat,
                title: 'Contractor Execution',
                description: 'Verified contractor networks. Precise scope assignments. Documented progress. Compliance is tracked, not assumed.',
                color: 'from-orange-500 to-orange-600',
              },
              {
                icon: TrendingUp,
                title: 'Equity Outcomes',
                description: 'Before/after valuations. Claim-vs-payout deltas. Equity gain narratives generated with full evidence backing.',
                color: 'from-rose-500 to-rose-600',
              },
              {
                icon: Brain,
                title: 'ATOS Intelligence',
                description: 'Embedded AI that proactively guides, explains, and surfaces risks. Not a chatbot — a forensic strategist that reasons from your data.',
                color: 'from-indigo-500 to-indigo-600',
              },
            ].map((module, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{module.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900">Built for Trust. Designed for Precision.</h2>
            <p className="mt-3 text-lg text-slate-600">
              Every feature exists to create transparency, accountability, and verifiable outcomes.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              'Every data point links back to verifiable evidence',
              'Forensic-grade documentation and audit trails',
              'AI that explains its reasoning — no black boxes',
              'Role-based access for owners, contractors, and adjusters',
              'Scope discrepancy detection catches gaps before they cost you',
              'Equity gain narratives backed by complete evidence chains',
              'Real-time compliance tracking for all contractors',
              'Insurance intelligence from historical carrier patterns',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Ready to See Your Portfolio&apos;s Intelligence?</h2>
          <p className="mt-3 text-lg text-slate-400">
            Enter the platform and let ATOS guide you through your first analysis.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            Launch Intelligence Center
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-400">Equity Builders</span>
          </div>
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} Equity Builders. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
