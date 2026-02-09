/**
 * Forensic Property Module — Property listing page.
 * 
 * Displays all properties as forensic cases with their current status,
 * damage classifications, and key metrics. Each row links to the
 * detailed property profile.
 * 
 * Design: Table view with status badges, damage tags, and value indicators.
 * This is a workspace tool — data density is valued over whitespace.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { PROPERTY_STATUS_CONFIG, ROUTES } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { properties } from '@/lib/mock-data';
import { useAtosStore } from '@/stores/atos-store';
import { Building2, Plus, Filter, Download } from 'lucide-react';
import type { Property } from '@/types';

export default function PropertiesPage() {
  const router = useRouter();
  const setContext = useAtosStore(s => s.setContext);

  useEffect(() => {
    setContext('properties');
  }, [setContext]);

  const columns = [
    {
      key: 'name',
      header: 'Property',
      render: (p: Property) => (
        <div>
          <p className="text-sm font-semibold text-slate-900">{p.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{p.address}, {p.city}, {p.state} {p.zip}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      className: 'hidden md:table-cell',
      render: (p: Property) => (
        <span className="text-sm text-slate-600 capitalize">{p.propertyType}</span>
      ),
    },
    {
      key: 'damage',
      header: 'Damage',
      className: 'hidden lg:table-cell',
      render: (p: Property) => (
        <div className="flex flex-wrap gap-1">
          {p.damageClassifications.slice(0, 3).map(dc => (
            <span key={dc} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded capitalize">
              {dc}
            </span>
          ))}
          {p.damageClassifications.length > 3 && (
            <span className="text-[10px] text-slate-400">+{p.damageClassifications.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: 'value',
      header: 'Est. Value',
      className: 'hidden md:table-cell text-right',
      render: (p: Property) => (
        <span className="text-sm font-medium text-slate-700 tabular-nums">
          {p.estimatedValue ? formatCurrency(p.estimatedValue) : '—'}
        </span>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      className: 'hidden xl:table-cell',
      render: (p: Property) => (
        <span className="text-sm text-slate-600">{p.ownerName}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: Property) => {
        const config = PROPERTY_STATUS_CONFIG[p.status];
        return config ? (
          <StatusBadge label={config.label} color={config.color} bgColor={config.bgColor} />
        ) : (
          <span className="text-sm text-slate-500">{p.status}</span>
        );
      },
    },
    {
      key: 'updated',
      header: 'Updated',
      className: 'hidden lg:table-cell',
      render: (p: Property) => (
        <span className="text-xs text-slate-500">{formatDate(p.updatedAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Properties</h1>
            <p className="text-sm text-slate-500">{properties.length} forensic cases in pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {[
          { label: 'Inspection', count: properties.filter(p => p.status === 'inspection').length, color: 'bg-blue-500' },
          { label: 'Claim Filed', count: properties.filter(p => p.status === 'claim-filed').length, color: 'bg-indigo-500' },
          { label: 'Under Review', count: properties.filter(p => p.status === 'claim-review').length, color: 'bg-amber-500' },
          { label: 'In Repair', count: properties.filter(p => p.status === 'in-repair').length, color: 'bg-orange-500' },
          { label: 'Complete', count: properties.filter(p => p.status === 'complete').length, color: 'bg-emerald-500' },
        ].map(stage => (
          <div key={stage.label} className="bg-white rounded-lg border border-slate-200 p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className={cn('w-2 h-2 rounded-full', stage.color)} />
              <span className="text-xs font-medium text-slate-500">{stage.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stage.count}</p>
          </div>
        ))}
      </div>

      {/* Property table */}
      <DataTable
        columns={columns}
        data={properties}
        keyExtractor={p => p.id}
        onRowClick={p => router.push(ROUTES.propertyDetail(p.id))}
        emptyMessage="No properties found. Add your first property to begin."
      />
    </div>
  );
}
