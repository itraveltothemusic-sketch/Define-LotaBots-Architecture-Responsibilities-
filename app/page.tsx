/**
 * Landing Page
 * 
 * Public-facing homepage that introduces the Equity Builders platform
 * and guides users to sign in or learn more.
 */

import Link from 'next/link';
import { ArrowRight, Shield, TrendingUp, FileSearch, Users, CheckCircle, Brain } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forensic-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-forensic-600" />
              <span className="text-xl font-bold text-gray-900">Equity Builders</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Storm Damage Into
              <span className="block text-forensic-600 mt-2">Verified Equity Gains</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              The forensic property intelligence platform that bridges damage assessment, 
              insurance claims, and strategic rehabilitation—all powered by AI-guided execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                Start Your First Property
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
                See How It Works
              </Link>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Properties Analyzed', value: '2,400+' },
              { label: 'Equity Recovered', value: '$45M+' },
              { label: 'Claim Success Rate', value: '94%' },
              { label: 'Avg. Processing Time', value: '18 days' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-forensic-600">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATOS Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center space-x-2 bg-forensic-100 text-forensic-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Brain className="h-4 w-4" />
                <span>AI-Powered Intelligence</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Meet ATOS: Your Forensic Strategist
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                ATOS isn't a chatbot. It's a forensic guide, strategist, and explainer that proactively 
                surfaces risks, gaps, and opportunities at every step of your property recovery journey.
              </p>
              <div className="space-y-4">
                {[
                  'Proactive guidance based on real-time property state',
                  'Risk detection and gap analysis in documentation',
                  'Plain-English explanations of complex insurance terms',
                  'Context-aware assistance tailored to your role',
                ].map((feature) => (
                  <div key={feature} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-equity-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="atos-panel">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-forensic-600 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-forensic-900">ATOS</div>
                    <div className="text-sm text-forensic-600">Forensic Intelligence Assistant</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-700">
                      <strong>Insight Detected:</strong> Your claim documentation is missing 
                      3 critical photos of the roof damage. This could reduce your claim approval 
                      by up to 30%.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-700">
                      <strong>Recommended Action:</strong> Schedule a follow-up inspection 
                      to capture north-facing roof section and HVAC unit damage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              From Damage to Equity in Five Steps
            </h2>
            <p className="text-lg text-gray-600">
              A systematic, intelligence-driven approach to property recovery
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8">
            {[
              {
                step: '01',
                title: 'Property Onboarding',
                description: 'Register property with photos, videos, and initial damage assessment',
                icon: FileSearch,
              },
              {
                step: '02',
                title: 'Forensic Inspection',
                description: 'Certified inspectors document every detail with timestamped evidence',
                icon: Shield,
              },
              {
                step: '03',
                title: 'Insurance Intelligence',
                description: 'Track claims, detect discrepancies, and optimize negotiation strategy',
                icon: Brain,
              },
              {
                step: '04',
                title: 'Contractor Execution',
                description: 'Assign verified contractors and monitor progress with visual verification',
                icon: Users,
              },
              {
                step: '05',
                title: 'Equity Validation',
                description: 'Generate comprehensive reports showing verified equity gains',
                icon: TrendingUp,
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="forensic-card text-center h-full">
                  <div className="text-forensic-600 font-mono text-sm font-bold mb-3">
                    {item.step}
                  </div>
                  <item.icon className="h-10 w-10 text-forensic-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Trust, Precision, and Authority
            </h2>
            <p className="text-lg text-gray-600">
              Every feature designed to maximize equity outcomes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Forensic Documentation',
                description: 'Timestamped, geotagged evidence with complete audit trails for unquestionable verification',
              },
              {
                title: 'Claim Intelligence',
                description: 'Track every carrier interaction, scope comparison, and negotiation milestone in real-time',
              },
              {
                title: 'Contractor Network',
                description: 'Pre-verified contractors with compliance tracking and visual progress verification',
              },
              {
                title: 'Role-Based Access',
                description: 'Secure permissions for owners, contractors, adjusters, and internal teams',
              },
              {
                title: 'Real-Time Analytics',
                description: 'Live dashboards showing claim status, repair progress, and projected equity gains',
              },
              {
                title: 'Equity Reports',
                description: 'Comprehensive before/after analysis with exportable documentation for stakeholders',
              },
            ].map((feature) => (
              <div key={feature.title} className="intelligence-card">
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-forensic-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Properties?
          </h2>
          <p className="text-xl text-forensic-100 mb-8">
            Join property owners, contractors, and adjusters who trust Equity Builders 
            for forensic property intelligence.
          </p>
          <Link href="/register" className="bg-white text-forensic-600 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center hover:bg-forensic-50 transition-colors">
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-forensic-400" />
                <span className="text-white font-bold">Equity Builders</span>
              </div>
              <p className="text-sm">
                Forensic Property Intelligence Platform
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Intelligence Center</Link></li>
                <li><Link href="#" className="hover:text-white">Property Module</Link></li>
                <li><Link href="#" className="hover:text-white">Insurance Intelligence</Link></li>
                <li><Link href="#" className="hover:text-white">Contractor Network</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">About Us</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
                <li><Link href="#" className="hover:text-white">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; 2026 Equity Builders. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
