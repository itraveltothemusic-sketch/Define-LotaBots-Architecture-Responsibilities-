/**
 * Validation Schemas
 * 
 * Zod schemas for validating user input across the application.
 * These schemas ensure data integrity and provide type safety.
 */

import { z } from "zod";

// ==========================================
// AUTH VALIDATION
// ==========================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["owner", "contractor", "adjuster", "internal"]),
  phone: z.string().optional(),
  company: z.string().optional(),
});

// ==========================================
// PROPERTY VALIDATION
// ==========================================

export const propertySchema = z.object({
  name: z.string().min(3, "Property name must be at least 3 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  propertyType: z.string().min(1, "Property type is required"),
  squareFeet: z.number().int().positive().optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  stormDate: z.date().optional(),
  stormType: z.string().optional(),
  preStormValue: z.number().positive().optional(),
  estimatedDamageValue: z.number().positive().optional(),
});

// ==========================================
// CLAIM VALIDATION
// ==========================================

export const claimSchema = z.object({
  propertyId: z.string().uuid(),
  claimNumber: z.string().min(1, "Claim number is required"),
  carrierName: z.string().min(1, "Carrier name is required"),
  policyNumber: z.string().min(1, "Policy number is required"),
  filedDate: z.date().optional(),
  initialClaimAmount: z.number().positive().optional(),
  deductible: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

// ==========================================
// INSPECTION VALIDATION
// ==========================================

export const inspectionSchema = z.object({
  propertyId: z.string().uuid(),
  scheduledDate: z.date(),
  type: z.string().min(1, "Inspection type is required"),
  summary: z.string().optional(),
  findings: z.any().optional(),
});

// ==========================================
// DAMAGE ASSESSMENT VALIDATION
// ==========================================

export const damageAssessmentSchema = z.object({
  propertyId: z.string().uuid(),
  inspectionId: z.string().uuid().optional(),
  damageType: z.enum([
    "structural",
    "water",
    "fire",
    "wind",
    "hail",
    "electrical",
    "hvac",
    "roofing",
    "other",
  ]),
  severity: z.enum(["minor", "moderate", "major", "severe", "catastrophic"]),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  estimatedCost: z.number().positive().optional(),
  repairPriority: z.number().int().min(1).max(5).optional(),
});

// ==========================================
// CONTRACTOR VALIDATION
// ==========================================

export const contractorSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  licenseNumber: z.string().optional(),
  licenseState: z.string().length(2).optional(),
  specialties: z.array(z.string()).optional(),
});

// ==========================================
// WORK ORDER VALIDATION
// ==========================================

export const workOrderSchema = z.object({
  propertyId: z.string().uuid(),
  contractorId: z.string().uuid(),
  claimId: z.string().uuid().optional(),
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.date().optional(),
  targetCompletionDate: z.date().optional(),
});

// ==========================================
// DOCUMENT UPLOAD VALIDATION
// ==========================================

export const documentUploadSchema = z.object({
  propertyId: z.string().uuid(),
  type: z.enum([
    "photo",
    "video",
    "pdf",
    "inspection_report",
    "estimate",
    "invoice",
    "correspondence",
    "other",
  ]),
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  fileSize: z.number().int().positive().optional(),
  mimeType: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Export type inference
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
export type InspectionInput = z.infer<typeof inspectionSchema>;
export type DamageAssessmentInput = z.infer<typeof damageAssessmentSchema>;
export type ContractorInput = z.infer<typeof contractorSchema>;
export type WorkOrderInput = z.infer<typeof workOrderSchema>;
export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
