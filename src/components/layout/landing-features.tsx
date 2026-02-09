import {
  Brain,
  Camera,
  FileSearch,
  HardHat,
  TrendingUp,
  Zap,
} from "lucide-react";

/**
 * Landing Features Section
 *
 * Presents the five core modules + ATOS.
 * Each feature must communicate both WHAT it does and WHY it matters.
 */
export function LandingFeatures() {
  const features = [
    {
      icon: Brain,
      title: "ATOS Intelligence Engine",
      description:
        "Your forensic guide and strategist. ATOS analyzes every data point, surfaces risks before they become problems, and explains exactly why each action matters.",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: Camera,
      title: "Forensic Property Module",
      description:
        "Capture, classify, and organize storm damage with photographic evidence, GPS-tagged inspections, and structured damage assessments that hold up to carrier scrutiny.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: FileSearch,
      title: "Insurance Intelligence",
      description:
        "Track every claim from filing to settlement. Detect discrepancies between your forensic scope and carrier approvals. Never leave money on the table.",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: HardHat,
      title: "Contractor Execution",
      description:
        "Onboard verified contractors, assign scopes with line-item precision, track progress with photographic verification, and enforce compliance at every step.",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: TrendingUp,
      title: "Equity Outcomes",
      description:
        "Generate defensible before-and-after valuations, calculate net equity gains, and produce investor-ready reports backed by forensic evidence.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Zap,
      title: "Real-Time Intelligence Center",
      description:
        "A unified command center showing every property, every claim, every active restoration — with AI-surfaced insights telling you exactly what needs attention now.",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">
            The Platform
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Every Module, One Mission
          </h2>
          <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto">
            From first inspection to final equity report — every step is
            documented, verified, and guided by intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/50 hover:border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} mb-5`}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
