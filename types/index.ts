// ============================================
// CORE TYPE DEFINITIONS
// Equity Builders Platform
// ============================================

// --------------------------------------------
// USER & AUTHENTICATION
// --------------------------------------------

export type UserRole = 'owner' | 'contractor' | 'adjuster' | 'internal' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  company?: string;
  licenseNumber?: string; // For contractors and adjusters
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastLogin?: Date;
}

export interface AuthToken {
  token: string;
  expiresAt: Date;
  user: User;
}

// --------------------------------------------
// PROPERTY
// --------------------------------------------

export type PropertyType = 'commercial' | 'industrial' | 'retail' | 'office' | 'multifamily' | 'mixed-use';
export type PropertyStatus = 'active' | 'inspection_pending' | 'claim_submitted' | 'repair_in_progress' | 'completed' | 'closed';

export interface Property {
  id: string;
  ownerId: string;
  
  // Basic Information
  name: string;
  type: PropertyType;
  status: PropertyStatus;
  
  // Location
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    county: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Property Details
  squareFootage: number;
  yearBuilt: number;
  storiesCount: number;
  constructionType: string;
  roofType: string;
  
  // Valuation
  preIncidentValue: number;
  estimatedRepairCost?: number;
  projectedPostRepairValue?: number;
  
  // Dates
  incidentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  owner?: User;
  inspections?: Inspection[];
  claims?: InsuranceClaim[];
}

// --------------------------------------------
// INSPECTION & DAMAGE
// --------------------------------------------

export type DamageCategory = 
  | 'structural'
  | 'roof'
  | 'water'
  | 'wind'
  | 'electrical'
  | 'hvac'
  | 'interior'
  | 'exterior'
  | 'foundation'
  | 'other';

export type DamageSeverity = 'minor' | 'moderate' | 'major' | 'severe' | 'catastrophic';

export interface DamageItem {
  id: string;
  category: DamageCategory;
  severity: DamageSeverity;
  description: string;
  location: string; // e.g., "Building A, 2nd Floor, Room 201"
  
  // Forensic Details
  measurements?: {
    length?: number;
    width?: number;
    height?: number;
    area?: number;
    unit: 'feet' | 'meters' | 'sqft' | 'sqm';
  };
  
  estimatedCost: number;
  
  // Evidence
  photoIds: string[];
  videoIds?: string[];
  
  // AI Analysis
  aiConfidence?: number; // 0-1 confidence score
  aiTags?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export type InspectionStatus = 'scheduled' | 'in_progress' | 'completed' | 'reviewed';

export interface Inspection {
  id: string;
  propertyId: string;
  inspectorId: string;
  
  status: InspectionStatus;
  scheduledDate: Date;
  completedDate?: Date;
  
  // Summary
  summary: string;
  totalDamageEstimate: number;
  
  // Damage Items
  damageItems: DamageItem[];
  
  // Documentation
  photos: Media[];
  videos: Media[];
  documents: Media[];
  
  // Weather Data (at time of incident)
  weatherData?: {
    event: string; // e.g., "Hurricane Ian"
    windSpeed?: number;
    rainfall?: number;
    hailSize?: number;
  };
  
  // Relationships
  property?: Property;
  inspector?: User;
  
  createdAt: Date;
  updatedAt: Date;
}

// --------------------------------------------
// MEDIA & DOCUMENTS
// --------------------------------------------

export type MediaType = 'photo' | 'video' | 'document' | 'report';

export interface Media {
  id: string;
  type: MediaType;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  
  // Metadata
  size: number; // bytes
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
  
  // Context
  propertyId?: string;
  inspectionId?: string;
  claimId?: string;
  
  // AI Analysis (for photos/videos)
  aiAnalysis?: {
    labels: string[];
    damageDetected: boolean;
    confidence: number;
    description?: string;
  };
  
  // EXIF data (for photos)
  metadata?: {
    location?: { lat: number; lng: number };
    timestamp?: Date;
    camera?: string;
  };
}

// --------------------------------------------
// INSURANCE CLAIM
// --------------------------------------------

export type ClaimStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'additional_info_required'
  | 'approved'
  | 'partial_approval'
  | 'denied'
  | 'settled'
  | 'closed';

export interface InsuranceClaim {
  id: string;
  propertyId: string;
  
  // Claim Details
  claimNumber?: string; // Assigned by insurance carrier
  carrier: string;
  policyNumber: string;
  adjusterId?: string;
  
  status: ClaimStatus;
  
  // Financial
  claimedAmount: number;
  approvedAmount?: number;
  paidAmount?: number;
  deductible: number;
  
  // Dates
  incidentDate: Date;
  submittedDate?: Date;
  approvedDate?: Date;
  settlementDate?: Date;
  
  // Scopes
  forensicScope: {
    totalEstimate: number;
    lineItems: ClaimLineItem[];
  };
  
  insuranceScope?: {
    totalEstimate: number;
    lineItems: ClaimLineItem[];
  };
  
  // Discrepancies (calculated)
  discrepancies?: ScopeDiscrepancy[];
  
  // Communication Log
  interactions: ClaimInteraction[];
  
  // Documents
  documentIds: string[];
  
  // Relationships
  property?: Property;
  adjuster?: User;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ClaimLineItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  
  // Justification
  notes?: string;
  photoIds?: string[];
}

export interface ScopeDiscrepancy {
  id: string;
  lineItemId: string;
  type: 'missing' | 'underpaid' | 'overpaid' | 'quantity_mismatch' | 'price_mismatch';
  
  forensicValue: number;
  insuranceValue: number;
  delta: number;
  
  explanation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  // ATOS Analysis
  aiRecommendation?: string;
}

export type InteractionType = 
  | 'email'
  | 'phone'
  | 'meeting'
  | 'document_upload'
  | 'inspection_request'
  | 'supplement_request'
  | 'payment_received'
  | 'status_update'
  | 'other';

export interface ClaimInteraction {
  id: string;
  claimId: string;
  type: InteractionType;
  
  timestamp: Date;
  initiatedBy: string; // User ID
  
  summary: string;
  details?: string;
  
  // Attachments
  documentIds?: string[];
  
  // Outcomes
  actionRequired?: string;
  dueDate?: Date;
}

// --------------------------------------------
// CONTRACTOR
// --------------------------------------------

export type ContractorStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export interface Contractor {
  id: string;
  userId: string;
  
  // Business Information
  companyName: string;
  licenseNumber: string;
  insuranceCertificate: string;
  bondNumber?: string;
  
  // Qualifications
  specialties: string[]; // e.g., ["roofing", "water damage", "electrical"]
  serviceAreas: string[]; // ZIP codes or counties
  
  // Verification
  status: ContractorStatus;
  verifiedAt?: Date;
  verifiedBy?: string;
  
  // Performance Metrics
  metrics: {
    completedProjects: number;
    averageRating: number;
    onTimeCompletionRate: number;
    complianceScore: number;
  };
  
  // Relationships
  user?: User;
  workOrders?: WorkOrder[];
  
  createdAt: Date;
  updatedAt: Date;
}

export type WorkOrderStatus = 
  | 'draft'
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'verification_pending'
  | 'completed'
  | 'cancelled';

export interface WorkOrder {
  id: string;
  propertyId: string;
  contractorId: string;
  claimId?: string;
  
  status: WorkOrderStatus;
  
  // Scope
  title: string;
  description: string;
  scope: ClaimLineItem[];
  totalValue: number;
  
  // Schedule
  startDate: Date;
  expectedCompletionDate: Date;
  actualCompletionDate?: Date;
  
  // Progress Tracking
  progressPercentage: number;
  milestones: Milestone[];
  
  // Compliance
  permitsRequired: boolean;
  permits?: Permit[];
  
  // Documentation
  progressPhotos: Media[];
  completionPhotos: Media[];
  
  // Verification
  verifiedBy?: string;
  verifiedAt?: Date;
  verificationNotes?: string;
  
  // Relationships
  property?: Property;
  contractor?: Contractor;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  isCompleted: boolean;
  
  // Verification Requirements
  photoRequired: boolean;
  photoIds?: string[];
  
  notes?: string;
}

export interface Permit {
  id: string;
  type: string; // e.g., "Building Permit", "Electrical Permit"
  number: string;
  issuedBy: string;
  issuedDate: Date;
  expirationDate: Date;
  
  status: 'pending' | 'approved' | 'expired' | 'rejected';
  
  documentId?: string;
}

// --------------------------------------------
// EQUITY OUTCOME
// --------------------------------------------

export interface EquityOutcome {
  id: string;
  propertyId: string;
  
  // Valuation
  preIncidentValue: number;
  postRepairValue: number;
  valuationMethod: string;
  valuationDate: Date;
  
  // Claim Financial
  totalDamageEstimate: number; // Forensic scope
  insuranceApproved: number;
  insurancePaid: number;
  outOfPocketExpenses: number;
  
  // Repair Costs
  totalRepairCost: number;
  paidToContractors: number;
  
  // Equity Calculation
  equityGain: number; // postRepairValue - (preIncidentValue + outOfPocketExpenses)
  roi: number; // equityGain / outOfPocketExpenses
  
  // Narrative
  summary: string;
  
  // Generated Reports
  reportIds: string[];
  
  // Relationships
  property?: Property;
  
  createdAt: Date;
  updatedAt: Date;
}

// --------------------------------------------
// ATOS AI ASSISTANT
// --------------------------------------------

export type ATOSContextType = 
  | 'property_overview'
  | 'inspection_analysis'
  | 'claim_strategy'
  | 'scope_comparison'
  | 'contractor_selection'
  | 'risk_assessment'
  | 'equity_forecast'
  | 'general';

export interface ATOSMessage {
  id: string;
  userId: string;
  context: ATOSContextType;
  contextId?: string; // ID of related entity (property, claim, etc.)
  
  // Message
  userQuery?: string;
  systemPrompt?: string;
  aiResponse: string;
  
  // Metadata
  confidence: number;
  sources?: string[]; // Data sources used for response
  actionable: boolean;
  
  timestamp: Date;
}

export interface ATOSGuidance {
  type: 'info' | 'warning' | 'opportunity' | 'action_required';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  title: string;
  message: string;
  explanation?: string;
  
  // Suggested Actions
  suggestedActions?: {
    label: string;
    action: string;
    url?: string;
  }[];
  
  // Context
  contextType: ATOSContextType;
  contextId?: string;
  
  // Dismissal
  dismissable: boolean;
  dismissedAt?: Date;
}

// --------------------------------------------
// NOTIFICATIONS
// --------------------------------------------

export type NotificationType = 
  | 'claim_status_change'
  | 'inspection_scheduled'
  | 'document_uploaded'
  | 'payment_received'
  | 'contractor_assigned'
  | 'milestone_completed'
  | 'action_required'
  | 'atos_alert';

export interface Notification {
  id: string;
  userId: string;
  
  type: NotificationType;
  title: string;
  message: string;
  
  // Context
  entityType?: string; // 'property', 'claim', 'workorder', etc.
  entityId?: string;
  
  // Status
  read: boolean;
  readAt?: Date;
  
  // Actions
  actionUrl?: string;
  actionLabel?: string;
  
  createdAt: Date;
}

// --------------------------------------------
// API RESPONSES
// --------------------------------------------

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: Date;
    requestId: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

// --------------------------------------------
// DASHBOARD STATISTICS
// --------------------------------------------

export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalClaims: number;
  activeClaims: number;
  totalEquityGain: number;
  averageRoi: number;
  
  // Recent Activity
  recentInspections: Inspection[];
  recentClaims: InsuranceClaim[];
  pendingActions: number;
  
  // Charts Data
  claimsByStatus: Record<ClaimStatus, number>;
  equityGainOverTime: { date: Date; value: number }[];
}
