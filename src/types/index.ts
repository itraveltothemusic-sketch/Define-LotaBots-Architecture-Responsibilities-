/**
 * Core Type Definitions for Equity Builders Platform
 * 
 * These types define the core domain models and data structures
 * used throughout the application. All types follow strict TypeScript
 * conventions for type safety and IntelliSense support.
 */

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export enum UserRole {
  OWNER = 'OWNER',           // Property owner
  CONTRACTOR = 'CONTRACTOR', // Licensed contractor
  ADJUSTER = 'ADJUSTER',     // Insurance adjuster
  INTERNAL = 'INTERNAL',     // Platform admin/operator
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface Session {
  userId: string;
  token: string;
  expiresAt: Date;
}

// ============================================================================
// PROPERTY TYPES
// ============================================================================

export enum PropertyType {
  RETAIL = 'RETAIL',
  OFFICE = 'OFFICE',
  INDUSTRIAL = 'INDUSTRIAL',
  MULTIFAMILY = 'MULTIFAMILY',
  MIXED_USE = 'MIXED_USE',
  HOSPITALITY = 'HOSPITALITY',
  WAREHOUSE = 'WAREHOUSE',
  OTHER = 'OTHER',
}

export enum PropertyStatus {
  INITIAL_ASSESSMENT = 'INITIAL_ASSESSMENT',
  DOCUMENTATION_IN_PROGRESS = 'DOCUMENTATION_IN_PROGRESS',
  CLAIM_FILED = 'CLAIM_FILED',
  NEGOTIATION = 'NEGOTIATION',
  WORK_IN_PROGRESS = 'WORK_IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  propertyType: PropertyType;
  status: PropertyStatus;
  squareFootage?: number;
  yearBuilt?: number;
  stories?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// DAMAGE & INSPECTION TYPES
// ============================================================================

export enum DamageCategory {
  STRUCTURAL = 'STRUCTURAL',
  ROOF = 'ROOF',
  WATER = 'WATER',
  ELECTRICAL = 'ELECTRICAL',
  HVAC = 'HVAC',
  INTERIOR = 'INTERIOR',
  EXTERIOR = 'EXTERIOR',
  FOUNDATION = 'FOUNDATION',
  WINDOWS_DOORS = 'WINDOWS_DOORS',
  OTHER = 'OTHER',
}

export enum DamageSeverity {
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  MAJOR = 'MAJOR',
  CATASTROPHIC = 'CATASTROPHIC',
}

export enum EvidenceType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  REPORT = 'REPORT',
}

export interface DamageAssessment {
  id: string;
  propertyId: string;
  category: DamageCategory;
  severity: DamageSeverity;
  description: string;
  estimatedCost: number;
  location: string; // Specific location within property
  assessedBy: string; // User ID
  assessedAt: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface Evidence {
  id: string;
  propertyId: string;
  damageAssessmentId?: string;
  type: EvidenceType;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  caption?: string;
  metadata?: Record<string, any>;
  verified: boolean;
}

// ============================================================================
// INSURANCE TYPES
// ============================================================================

export enum ClaimStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ADDITIONAL_INFO_REQUESTED = 'ADDITIONAL_INFO_REQUESTED',
  APPROVED = 'APPROVED',
  PARTIALLY_APPROVED = 'PARTIALLY_APPROVED',
  DENIED = 'DENIED',
  APPEALED = 'APPEALED',
  SETTLED = 'SETTLED',
}

export interface InsuranceClaim {
  id: string;
  propertyId: string;
  claimNumber: string;
  carrier: string;
  policyNumber: string;
  dateOfLoss: Date;
  dateSubmitted?: Date;
  status: ClaimStatus;
  claimedAmount: number;
  approvedAmount?: number;
  paidAmount?: number;
  deductible: number;
  adjusterId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClaimInteraction {
  id: string;
  claimId: string;
  date: Date;
  type: 'PHONE' | 'EMAIL' | 'MEETING' | 'DOCUMENT' | 'OTHER';
  summary: string;
  participants: string[];
  outcome?: string;
  recordedBy: string;
}

export interface ScopeDiscrepancy {
  id: string;
  claimId: string;
  category: DamageCategory;
  ourScope: string;
  adjustersScope: string;
  ourCost: number;
  adjustersCost: number;
  variance: number;
  variancePercent: number;
  flagged: boolean;
  resolution?: string;
  resolvedAt?: Date;
}

// ============================================================================
// CONTRACTOR TYPES
// ============================================================================

export enum ContractorStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

export interface Contractor {
  id: string;
  userId: string;
  companyName: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: Date;
  insuranceCertificate?: string;
  bondAmount?: number;
  specialties: string[];
  rating?: number;
  completedProjects: number;
  status: ContractorStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum WorkOrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  INSPECTION_REQUIRED = 'INSPECTION_REQUIRED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export interface WorkOrder {
  id: string;
  propertyId: string;
  contractorId: string;
  title: string;
  description: string;
  scope: string[];
  estimatedCost: number;
  actualCost?: number;
  startDate?: Date;
  completionDate?: Date;
  status: WorkOrderStatus;
  permitRequired: boolean;
  permitNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressUpdate {
  id: string;
  workOrderId: string;
  date: Date;
  percentComplete: number;
  description: string;
  photosUrls: string[];
  submittedBy: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

// ============================================================================
// EQUITY & OUTCOMES TYPES
// ============================================================================

export interface PropertyValuation {
  id: string;
  propertyId: string;
  valuationType: 'PRE_DAMAGE' | 'POST_DAMAGE' | 'POST_RESTORATION';
  valuationDate: Date;
  estimatedValue: number;
  valuationMethod: string;
  valuedBy?: string;
  notes?: string;
  documentUrl?: string;
}

export interface EquityOutcome {
  id: string;
  propertyId: string;
  preDamageValue: number;
  postDamageValue: number;
  postRestorationValue: number;
  totalClaimedAmount: number;
  totalReceivedAmount: number;
  totalRestorationCost: number;
  netEquityGain: number;
  roi: number;
  calculatedAt: Date;
  reportUrl?: string;
}

// ============================================================================
// ATOS (AI ASSISTANT) TYPES
// ============================================================================

export interface ATOSContext {
  userId: string;
  propertyId?: string;
  currentModule: 'intelligence' | 'forensic' | 'insurance' | 'contractor' | 'equity';
  currentAction?: string;
  recentActivity: string[];
}

export interface ATOSGuidance {
  id: string;
  context: ATOSContext;
  question?: string;
  guidance: string;
  reasoning: string;
  suggestedActions?: Array<{
    label: string;
    action: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  risks?: string[];
  opportunities?: string[];
  timestamp: Date;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// ============================================================================
// DASHBOARD & ANALYTICS TYPES
// ============================================================================

export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalClaimsValue: number;
  totalRecovered: number;
  averageRecoveryRate: number;
  pendingInspections: number;
  activeWorkOrders: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
