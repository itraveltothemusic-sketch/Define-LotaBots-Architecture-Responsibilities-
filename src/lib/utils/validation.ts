/**
 * Input Validation Schemas using Zod
 * 
 * Centralizes validation logic for all user inputs to ensure
 * data integrity and security throughout the application.
 */

import { z } from 'zod';

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['OWNER', 'CONTRACTOR', 'ADJUSTER', 'INTERNAL']),
  phone: z.string().optional(),
});

// ============================================================================
// PROPERTY SCHEMAS
// ============================================================================

export const createPropertySchema = z.object({
  name: z.string().min(2, 'Property name is required'),
  addressStreet: z.string().min(5, 'Street address is required'),
  addressCity: z.string().min(2, 'City is required'),
  addressState: z.string().length(2, 'State must be 2 characters'),
  addressZip: z.string().min(5, 'ZIP code is required'),
  addressCountry: z.string().default('USA'),
  propertyType: z.enum(['RETAIL', 'OFFICE', 'INDUSTRIAL', 'MULTIFAMILY', 'MIXED_USE', 'HOSPITALITY', 'WAREHOUSE', 'OTHER']),
  squareFootage: z.number().positive().optional(),
  yearBuilt: z.number().min(1800).max(new Date().getFullYear()).optional(),
  stories: z.number().positive().optional(),
});

export const updatePropertyStatusSchema = z.object({
  propertyId: z.string().uuid(),
  status: z.enum(['INITIAL_ASSESSMENT', 'DOCUMENTATION_IN_PROGRESS', 'CLAIM_FILED', 'NEGOTIATION', 'WORK_IN_PROGRESS', 'COMPLETED', 'ARCHIVED']),
});

// ============================================================================
// DAMAGE ASSESSMENT SCHEMAS
// ============================================================================

export const createDamageAssessmentSchema = z.object({
  propertyId: z.string().uuid(),
  category: z.enum(['STRUCTURAL', 'ROOF', 'WATER', 'ELECTRICAL', 'HVAC', 'INTERIOR', 'EXTERIOR', 'FOUNDATION', 'WINDOWS_DOORS', 'OTHER']),
  severity: z.enum(['MINOR', 'MODERATE', 'MAJOR', 'CATASTROPHIC']),
  description: z.string().min(10, 'Description must be detailed'),
  estimatedCost: z.number().positive('Cost must be positive'),
  location: z.string().min(2, 'Location is required'),
});

// ============================================================================
// INSURANCE CLAIM SCHEMAS
// ============================================================================

export const createClaimSchema = z.object({
  propertyId: z.string().uuid(),
  claimNumber: z.string().min(5, 'Claim number is required'),
  carrier: z.string().min(2, 'Carrier name is required'),
  policyNumber: z.string().min(5, 'Policy number is required'),
  dateOfLoss: z.string().or(z.date()),
  claimedAmount: z.number().positive('Claimed amount must be positive'),
  deductible: z.number().nonnegative('Deductible cannot be negative'),
  adjusterId: z.string().uuid().optional(),
});

export const updateClaimStatusSchema = z.object({
  claimId: z.string().uuid(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUESTED', 'APPROVED', 'PARTIALLY_APPROVED', 'DENIED', 'APPEALED', 'SETTLED']),
  approvedAmount: z.number().positive().optional(),
  paidAmount: z.number().positive().optional(),
});

// ============================================================================
// CONTRACTOR SCHEMAS
// ============================================================================

export const createContractorSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  licenseNumber: z.string().min(5, 'License number is required'),
  licenseState: z.string().length(2, 'State must be 2 characters'),
  licenseExpiry: z.string().or(z.date()),
  specialties: z.array(z.string()).min(1, 'At least one specialty required'),
  bondAmount: z.number().positive().optional(),
});

export const createWorkOrderSchema = z.object({
  propertyId: z.string().uuid(),
  contractorId: z.string().uuid(),
  title: z.string().min(5, 'Title is required'),
  description: z.string().min(20, 'Detailed description is required'),
  scope: z.array(z.string()).min(1, 'Scope items required'),
  estimatedCost: z.number().positive('Estimated cost must be positive'),
  permitRequired: z.boolean(),
});

// ============================================================================
// FILE UPLOAD SCHEMAS
// ============================================================================

export const fileUploadSchema = z.object({
  propertyId: z.string().uuid(),
  damageAssessmentId: z.string().uuid().optional(),
  type: z.enum(['PHOTO', 'VIDEO', 'DOCUMENT', 'REPORT']),
  caption: z.string().optional(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate data against a schema and return typed result
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}
