import type { PropertyProfile } from "@/types/domain";
import { formatCurrency, formatPercent, formatShortDate } from "@/lib/utils/format";

export function PropertyOverviewGrid({ properties }: { properties: PropertyProfile[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Property Overview</h2>
        <span className="text-xs text-slate-500">Storm impact intelligence</span>
      </header>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {properties.map((property) => (
          <article
            key={property.id}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <h3 className="text-sm font-semibold text-slate-900">{property.name}</h3>
            <p className="mt-1 text-xs text-slate-600">{property.address}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-slate-500">Asset Type</dt>
                <dd className="font-medium text-slate-800">{property.assetType}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Storm Date</dt>
                <dd className="font-medium text-slate-800">
                  {formatShortDate(property.stormDate)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Insured Value</dt>
                <dd className="font-medium text-slate-800">
                  {formatCurrency(property.insuredValueUsd)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Occupancy</dt>
                <dd className="font-medium text-slate-800">
                  {formatPercent(property.occupancyRate)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Valuation Before</dt>
                <dd className="font-medium text-slate-800">
                  {formatCurrency(property.valuationBeforeUsd)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Valuation After</dt>
                <dd className="font-medium text-emerald-700">
                  {formatCurrency(property.valuationAfterUsd)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-slate-600">
              Forensic confidence {(property.forensicConfidenceScore * 100).toFixed(0)}%
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
