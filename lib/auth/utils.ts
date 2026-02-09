/**
 * Authentication Utilities
 * 
 * Helper functions for role-based access control and session management.
 */

import { auth } from './config';
import { redirect } from 'next/navigation';

export type UserRole = 'owner' | 'contractor' | 'adjuster' | 'internal';

/**
 * Get current session or throw error
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  return session;
}

/**
 * Check if user has required role
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth();
  
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/unauthorized');
  }
  
  return session;
}

/**
 * Check if user is internal team member
 */
export async function requireInternal() {
  return requireRole(['internal']);
}

/**
 * Check if user has any of the elevated roles
 */
export async function requireElevated() {
  return requireRole(['internal', 'adjuster']);
}

/**
 * Get current user or null
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Check if user has role (non-throwing)
 */
export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Hash password for storage
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs');
  return bcrypt.hash(password, 12);
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    owner: 'Property Owner',
    contractor: 'Contractor',
    adjuster: 'Insurance Adjuster',
    internal: 'Internal Team',
  };
  
  return roleNames[role];
}

/**
 * Get role permissions
 */
export function getRolePermissions(role: UserRole) {
  const permissions = {
    owner: {
      canViewOwnProperties: true,
      canUploadDocuments: true,
      canViewClaims: true,
      canViewContractors: true,
      canEditProperties: false,
      canManageContractors: false,
      canManageClaims: false,
      canAccessIntelligence: true,
    },
    contractor: {
      canViewOwnProperties: false,
      canUploadDocuments: true,
      canViewClaims: false,
      canViewContractors: false,
      canEditProperties: false,
      canManageContractors: false,
      canManageClaims: false,
      canAccessIntelligence: false,
      canUpdateWorkOrders: true,
    },
    adjuster: {
      canViewOwnProperties: false,
      canUploadDocuments: true,
      canViewClaims: true,
      canViewContractors: false,
      canEditProperties: false,
      canManageContractors: false,
      canManageClaims: true,
      canAccessIntelligence: true,
    },
    internal: {
      canViewOwnProperties: true,
      canUploadDocuments: true,
      canViewClaims: true,
      canViewContractors: true,
      canEditProperties: true,
      canManageContractors: true,
      canManageClaims: true,
      canAccessIntelligence: true,
      canManageUsers: true,
      canViewAnalytics: true,
    },
  };
  
  return permissions[role];
}
