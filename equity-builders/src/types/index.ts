/**
 * Equity Builders — Core Type Definitions
 *
 * These types represent the domain model of the platform.
 * Every type is documented because this system handles real property data,
 * insurance claims, and financial outcomes — precision matters.
 */

// ─── User & Auth ────────────────────────────────────────────

export type UserRole = "OWNER" | "CONTRACTOR" | "ADJUSTER" | "INTERNAL";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

// ─── Property ───────────────────────────────────────────────

export type PropertyStatus =
  | "INTAKE"           // Initial property registration
  | "INSPECTION"       // Forensic inspection in progress
  | "CLAIM_FILED"      // Insurance claim submitted
  | "UNDER_REVIEW"     // Carrier reviewing claim
  | "APPROVED"         // Claim approved
  | "IN_REPAIR"        // Contractor executing repairs
  | "COMPLETED"        // All work completed
  | "EQUITY_VERIFIED"; // Final equity gain verified

export type PropertyType = "COMMERCIAL" | "INDUSTRIAL" | "MIXED_USE" | "RETAIL" | "OFFICE" | "WAREHOUSE";

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  ownerId: string;
  owner?: User;
  yearBuilt?: number;
  squareFootage?: number;
  roofType?: string;
  lastInspectionDate?: Date;
  /** Pre-damage estimated value */
  estimatedValue?: number;
  /** Post-repair verified value */
  verifiedValue?: number;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Inspection ─────────────────────────────────────────────

export type InspectionType = "INITIAL" | "FOLLOW_UP" | "FINAL" | "SUPPLEMENTAL";

export type DamageSeverity = "NONE" | "MINOR" | "MODERATE" | "SEVERE" | "CATASTROPHIC";

export type DamageType =
  | "WIND"
  | "HAIL"
  | "WATER"
  | "STRUCTURAL"
  | "ROOF"
  | "FACADE"
  | "INTERIOR"
  | "ELECTRICAL"
  | "HVAC"
  | "OTHER";

export interface Inspection {
  id: string;
  propertyId: string;
  property?: Property;
  inspectorId: string;
  inspector?: User;
  type: InspectionType;
  scheduledDate: Date;
  completedDate?: Date;
  findings: string;
  overallSeverity: DamageSeverity;
  damageItems: DamageItem[];
  media: MediaItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DamageItem {
  id: string;
  inspectionId: string;
  damageType: DamageType;
  severity: DamageSeverity;
  location: string;
  description: string;
  estimatedCost?: number;
  /** AI-generated classification confidence (0-1) */
  classificationConfidence?: number;
  mediaIds: string[];
}

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: "PHOTO" | "VIDEO" | "DOCUMENT" | "REPORT";
  caption?: string;
  metadata?: Record<string, unknown>;
  uploadedBy: string;
  createdAt: Date;
}

// ─── Insurance / Claims ─────────────────────────────────────

export type ClaimStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "ACKNOWLEDGED"
  | "UNDER_REVIEW"
  | "ADDITIONAL_INFO_REQUESTED"
  | "APPROVED"
  | "PARTIALLY_APPROVED"
  | "DENIED"
  | "APPEALED"
  | "SETTLED";

export interface InsuranceClaim {
  id: string;
  propertyId: string;
  property?: Property;
  claimNumber?: string;
  carrier: string;
  policyNumber: string;
  status: ClaimStatus;
  filedDate: Date;
  /** Total amount claimed based on forensic inspection */
  claimedAmount: number;
  /** Amount approved by carrier */
  approvedAmount?: number;
  /** Difference between claimed and approved — key metric */
  discrepancyAmount?: number;
  adjusterName?: string;
  adjusterEmail?: string;
  adjusterPhone?: string;
  interactions: CarrierInteraction[];
  scopeComparisons: ScopeComparison[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CarrierInteraction {
  id: string;
  claimId: string;
  date: Date;
  type: "CALL" | "EMAIL" | "LETTER" | "MEETING" | "INSPECTION" | "NOTE";
  summary: string;
  outcome?: string;
  attachments: string[];
  recordedBy: string;
}

export interface ScopeComparison {
  id: string;
  claimId: string;
  /** Our forensic scope line item */
  forensicItem: string;
  forensicAmount: number;
  /** Carrier's scope line item */
  carrierItem?: string;
  carrierAmount?: number;
  /** Variance — positive means underpaid */
  variance: number;
  notes?: string;
}

// ─── Contractor ─────────────────────────────────────────────

export type ContractorStatus = "PENDING" | "APPROVED" | "ACTIVE" | "SUSPENDED" | "INACTIVE";

export interface Contractor {
  id: string;
  userId: string;
  user?: User;
  companyName: string;
  licenseNumber: string;
  insuranceCarrier: string;
  insurancePolicyNumber: string;
  specialties: string[];
  status: ContractorStatus;
  rating?: number;
  completedProjects: number;
  createdAt: Date;
  updatedAt: Date;
}

export type AssignmentStatus = "ASSIGNED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "VERIFIED" | "REJECTED";

export interface ContractorAssignment {
  id: string;
  contractorId: string;
  contractor?: Contractor;
  propertyId: string;
  property?: Property;
  scopeOfWork: string;
  estimatedCost: number;
  actualCost?: number;
  status: AssignmentStatus;
  startDate?: Date;
  completionDate?: Date;
  progressUpdates: ProgressUpdate[];
  complianceChecks: ComplianceCheck[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressUpdate {
  id: string;
  assignmentId: string;
  date: Date;
  percentComplete: number;
  description: string;
  mediaIds: string[];
  verifiedBy?: string;
}

export interface ComplianceCheck {
  id: string;
  assignmentId: string;
  checkType: string;
  status: "PASSED" | "FAILED" | "PENDING";
  notes?: string;
  checkedBy: string;
  checkedAt: Date;
}

// ─── Equity Outcome ─────────────────────────────────────────

export interface EquityOutcome {
  id: string;
  propertyId: string;
  property?: Property;
  /** Property value before the storm event */
  preEventValue: number;
  /** Insurance claim total */
  claimTotal: number;
  /** Actual repair costs */
  repairCosts: number;
  /** Property value after repairs */
  postRepairValue: number;
  /** Net equity gain = postRepairValue - preEventValue */
  equityGain: number;
  /** Return on investment percentage */
  roiPercent: number;
  /** Narrative explaining the equity outcome */
  narrative?: string;
  /** Whether this outcome has been independently verified */
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── ATOS (AI Intelligence) ─────────────────────────────────

export type ATOSContextType =
  | "PROPERTY_OVERVIEW"
  | "INSPECTION_GUIDANCE"
  | "CLAIM_STRATEGY"
  | "CONTRACTOR_REVIEW"
  | "EQUITY_ANALYSIS"
  | "GENERAL";

export interface ATOSMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  context?: ATOSContextType;
  /** References to entities this message relates to */
  references?: {
    propertyId?: string;
    inspectionId?: string;
    claimId?: string;
    contractorId?: string;
  };
  timestamp: Date;
}

export interface ATOSInsight {
  id: string;
  type: "RISK" | "OPPORTUNITY" | "GAP" | "RECOMMENDATION" | "ALERT";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  description: string;
  actionable: boolean;
  suggestedAction?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt: Date;
}

// ─── Dashboard / Analytics ──────────────────────────────────

export interface DashboardStats {
  totalProperties: number;
  activeInspections: number;
  pendingClaims: number;
  totalClaimedAmount: number;
  totalApprovedAmount: number;
  totalEquityGain: number;
  averageROI: number;
  propertiesByStatus: Record<PropertyStatus, number>;
}

// ─── API Response Types ─────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
