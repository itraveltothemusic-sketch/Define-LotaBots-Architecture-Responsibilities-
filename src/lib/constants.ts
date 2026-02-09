/**
 * Application-wide constants.
 * Centralizing these ensures consistency across modules and makes 
 * configuration changes predictable.
 */

export const APP_NAME = 'Equity Builders';
export const APP_TAGLINE = 'Forensic Property Intelligence Platform';
export const APP_DESCRIPTION = 
  'Transforming commercial storm-damaged properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.';

// ─── Route Definitions ─────────────────────────────────────────

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  intelligence: '/intelligence',
  properties: '/properties',
  propertyDetail: (id: string) => `/properties/${id}`,
  insurance: '/insurance',
  insuranceDetail: (id: string) => `/insurance/${id}`,
  contractors: '/contractors',
  contractorDetail: (id: string) => `/contractors/${id}`,
  equity: '/equity',
  equityDetail: (id: string) => `/equity/${id}`,
  settings: '/settings',
} as const;

// ─── Status Display Configuration ──────────────────────────────

export const PROPERTY_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  'intake':         { label: 'Intake',           color: 'text-slate-700',   bgColor: 'bg-slate-100' },
  'inspection':     { label: 'Inspection',       color: 'text-blue-700',    bgColor: 'bg-blue-100' },
  'claim-filed':    { label: 'Claim Filed',      color: 'text-indigo-700',  bgColor: 'bg-indigo-100' },
  'claim-review':   { label: 'Under Review',     color: 'text-amber-700',   bgColor: 'bg-amber-100' },
  'approved':       { label: 'Approved',         color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  'in-repair':      { label: 'In Repair',        color: 'text-orange-700',  bgColor: 'bg-orange-100' },
  'verification':   { label: 'Verification',     color: 'text-purple-700',  bgColor: 'bg-purple-100' },
  'complete':       { label: 'Complete',          color: 'text-green-700',   bgColor: 'bg-green-100' },
  'disputed':       { label: 'Disputed',          color: 'text-red-700',     bgColor: 'bg-red-100' },
};

export const CLAIM_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  'draft':                    { label: 'Draft',               color: 'text-slate-700',   bgColor: 'bg-slate-100' },
  'filed':                    { label: 'Filed',               color: 'text-blue-700',    bgColor: 'bg-blue-100' },
  'acknowledged':             { label: 'Acknowledged',        color: 'text-cyan-700',    bgColor: 'bg-cyan-100' },
  'under-review':             { label: 'Under Review',        color: 'text-amber-700',   bgColor: 'bg-amber-100' },
  'additional-info-requested': { label: 'Info Requested',     color: 'text-orange-700',  bgColor: 'bg-orange-100' },
  'approved':                 { label: 'Approved',            color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  'partially-approved':       { label: 'Partially Approved',  color: 'text-yellow-700',  bgColor: 'bg-yellow-100' },
  'denied':                   { label: 'Denied',              color: 'text-red-700',     bgColor: 'bg-red-100' },
  'appealed':                 { label: 'Appealed',            color: 'text-violet-700',  bgColor: 'bg-violet-100' },
  'settled':                  { label: 'Settled',             color: 'text-green-700',   bgColor: 'bg-green-100' },
};

// ─── ATOS Configuration ────────────────────────────────────────

export const ATOS_CONFIG = {
  name: 'ATOS',
  fullName: 'Adaptive Tactical Operations System',
  description: 'Your forensic intelligence guide — surfacing risks, gaps, and opportunities at every step.',
  /** System prompt for ATOS interactions */
  systemPrompt: `You are ATOS (Adaptive Tactical Operations System), the forensic intelligence assistant for the Equity Builders platform. 

Your role:
- You are a forensic guide, strategist, and explainer — NOT a chatbot.
- You proactively guide users through property damage documentation, insurance claims, and repair execution.
- You explain "why this matters" at every step.
- You surface risks, gaps, and opportunities.
- You translate insurance and construction complexity into actionable confidence.
- You NEVER hallucinate facts — you only reason from provided data.
- When uncertain, you clearly state what you don't know and what additional information would be needed.

Communication style:
- Professional but approachable
- Evidence-based and precise
- Action-oriented — always suggest next steps
- Use plain language to explain technical concepts`,
} as const;

// ─── User Roles Configuration ──────────────────────────────────

export const ROLE_CONFIG: Record<string, { label: string; description: string; color: string }> = {
  owner:      { label: 'Property Owner',     description: 'Full visibility into damage, claims, repairs, and equity recovery',  color: 'text-blue-700' },
  contractor: { label: 'Contractor',         description: 'Scope assignments, progress tracking, and compliance verification',  color: 'text-orange-700' },
  adjuster:   { label: 'Insurance Adjuster', description: 'Transparent documentation and scope comparison tools',               color: 'text-purple-700' },
  internal:   { label: 'Internal Team',      description: 'Full platform access with analytics and intelligence tools',         color: 'text-emerald-700' },
};
