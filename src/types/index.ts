/**
 * Core type definitions for Equity Builders platform.
 * 
 * These types form the domain model for the entire system.
 * Every entity is designed to be auditable, timestamped, and traceable.
 */

// ─── User & Auth ──────────────────────────────────────────────

export type UserRole = 'owner' | 'contractor' | 'adjuster' | 'internal';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  organization?: string;
  phone?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

// ─── Property ─────────────────────────────────────────────────

export type PropertyStatus = 
  | 'intake'           // Just entered the system
  | 'inspection'       // Under forensic inspection
  | 'claim-filed'      // Insurance claim submitted
  | 'claim-review'     // Carrier reviewing claim
  | 'approved'         // Claim approved
  | 'in-repair'        // Contractor work in progress
  | 'verification'     // Post-repair verification
  | 'complete'         // Fully resolved
  | 'disputed';        // In dispute

export type DamageClassification = 
  | 'wind'
  | 'hail'
  | 'water'
  | 'structural'
  | 'roof'
  | 'facade'
  | 'interior'
  | 'electrical'
  | 'hvac'
  | 'other';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: 'commercial' | 'industrial' | 'mixed-use' | 'multi-family';
  status: PropertyStatus;
  ownerId: string;
  ownerName: string;
  squareFootage?: number;
  yearBuilt?: number;
  estimatedValue?: number;
  damageDate?: string;
  damageClassifications: DamageClassification[];
  /** URL to primary photo */
  primaryImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Inspection ───────────────────────────────────────────────

export type InspectionType = 'initial' | 'follow-up' | 'verification' | 'final';

export interface Inspection {
  id: string;
  propertyId: string;
  type: InspectionType;
  inspectorName: string;
  inspectorId: string;
  date: string;
  findings: string;
  damageClassifications: DamageClassification[];
  /** Severity 1-10 scale */
  severityScore: number;
  photos: Evidence[];
  documents: Evidence[];
  createdAt: string;
}

// ─── Evidence ─────────────────────────────────────────────────

export type EvidenceType = 'photo' | 'video' | 'document' | 'report' | 'correspondence';

export interface Evidence {
  id: string;
  propertyId: string;
  type: EvidenceType;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  /** Tags for categorization */
  tags: string[];
}

// ─── Insurance ────────────────────────────────────────────────

export type ClaimStatus = 
  | 'draft'
  | 'filed'
  | 'acknowledged'
  | 'under-review'
  | 'additional-info-requested'
  | 'approved'
  | 'partially-approved'
  | 'denied'
  | 'appealed'
  | 'settled';

export interface InsuranceClaim {
  id: string;
  propertyId: string;
  propertyName: string;
  claimNumber?: string;
  carrier: string;
  policyNumber?: string;
  status: ClaimStatus;
  filedDate?: string;
  amountClaimed: number;
  amountApproved?: number;
  amountPaid?: number;
  adjusterName?: string;
  adjusterContact?: string;
  /** Discrepancy between claimed and approved scope */
  scopeDiscrepancy?: number;
  notes?: string;
  interactions: CarrierInteraction[];
  createdAt: string;
  updatedAt: string;
}

export interface CarrierInteraction {
  id: string;
  claimId: string;
  date: string;
  type: 'call' | 'email' | 'letter' | 'meeting' | 'inspection' | 'document';
  summary: string;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  recordedBy: string;
}

// ─── Contractor ───────────────────────────────────────────────

export type ContractorStatus = 'pending' | 'verified' | 'active' | 'suspended' | 'inactive';

export interface Contractor {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  licenseNumber?: string;
  insuranceVerified: boolean;
  specialties: string[];
  status: ContractorStatus;
  rating?: number;
  completedProjects: number;
  activeAssignments: number;
  createdAt: string;
}

export type AssignmentStatus = 
  | 'pending'
  | 'accepted'
  | 'in-progress'
  | 'paused'
  | 'completed'
  | 'verified'
  | 'disputed';

export interface ContractorAssignment {
  id: string;
  contractorId: string;
  contractorName: string;
  propertyId: string;
  propertyName: string;
  scope: string;
  status: AssignmentStatus;
  estimatedCost: number;
  actualCost?: number;
  startDate?: string;
  estimatedEndDate?: string;
  actualEndDate?: string;
  complianceScore?: number;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Equity ───────────────────────────────────────────────────

export interface EquityOutcome {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  /** Value before damage/repairs */
  valueBefore: number;
  /** Value after repairs */
  valueAfter: number;
  /** Total insurance payout */
  insurancePayout: number;
  /** Total repair cost */
  repairCost: number;
  /** Net equity gain */
  equityGain: number;
  /** Percentage gain */
  equityGainPercent: number;
  /** AI-generated narrative explaining the equity gain */
  narrative?: string;
  status: 'calculating' | 'draft' | 'verified' | 'published';
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── ATOS Intelligence ────────────────────────────────────────

export type AtosMessageRole = 'user' | 'assistant' | 'system';

export interface AtosMessage {
  id: string;
  role: AtosMessageRole;
  content: string;
  timestamp: string;
  /** Context about what the user was viewing when this message was sent */
  context?: {
    module: string;
    entityId?: string;
    entityType?: string;
  };
}

export type AtosInsightSeverity = 'info' | 'warning' | 'critical' | 'opportunity';

export interface AtosInsight {
  id: string;
  title: string;
  description: string;
  severity: AtosInsightSeverity;
  module: string;
  entityId?: string;
  entityType?: string;
  actionLabel?: string;
  actionUrl?: string;
  dismissed: boolean;
  createdAt: string;
}

// ─── Dashboard / Analytics ────────────────────────────────────

export interface DashboardMetrics {
  totalProperties: number;
  activeInspections: number;
  pendingClaims: number;
  activeRepairs: number;
  totalEquityGained: number;
  avgClaimApprovalRate: number;
  propertiesByStatus: Record<PropertyStatus, number>;
  recentActivity: ActivityEntry[];
  atosInsights: AtosInsight[];
}

export interface ActivityEntry {
  id: string;
  type: 'property' | 'inspection' | 'claim' | 'contractor' | 'equity' | 'system';
  title: string;
  description: string;
  entityId?: string;
  entityUrl?: string;
  timestamp: string;
  userId: string;
  userName: string;
}

// ─── Navigation ───────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}
