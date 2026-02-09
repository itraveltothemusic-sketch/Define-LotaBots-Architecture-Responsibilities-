/**
 * Landing Stats Section
 *
 * Numbers build trust faster than words.
 * These represent realistic portfolio-level outcomes.
 */
export function LandingStats() {
  const stats = [
    {
      value: "$1.36M",
      label: "Equity Gained",
      detail: "Verified across active portfolio",
    },
    {
      value: "94.6%",
      label: "Claim Recovery Rate",
      detail: "Forensic documentation advantage",
    },
    {
      value: "26.7%",
      label: "Average Equity Gain",
      detail: "Post-restoration value increase",
    },
    {
      value: "12 Days",
      label: "Faster Claim Filing",
      detail: "vs. traditional process",
    },
  ];

  return (
    <section id="stats" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Intelligence-Driven Results
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-lg mx-auto">
            Every metric is derived from documented outcomes — not projections.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-slate-500">{stat.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
