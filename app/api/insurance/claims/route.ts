/**
 * Insurance Claims API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { insuranceClaims, activityLog, properties } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const claimSchema = z.object({
  propertyId: z.string().uuid(),
  carrierName: z.string().min(1),
  policyNumber: z.string().optional(),
  claimedAmount: z.number().optional().nullable(),
  deductible: z.number().optional().nullable(),
  filedAt: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const validated = claimSchema.parse(body);
    
    // Verify property ownership or access
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, validated.propertyId))
      .limit(1);
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    if (session.user.role !== 'internal' && property.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Create claim
    const [newClaim] = await db
      .insert(insuranceClaims)
      .values({
        propertyId: validated.propertyId,
        carrierName: validated.carrierName,
        policyNumber: validated.policyNumber,
        claimedAmount: validated.claimedAmount?.toString(),
        deductible: validated.deductible?.toString(),
        filedAt: validated.filedAt ? new Date(validated.filedAt) : new Date(),
        notes: validated.notes,
        status: 'submitted',
        internalOwnerId: session.user.role === 'internal' ? session.user.id : undefined,
      })
      .returning();
    
    // Log activity
    await db.insert(activityLog).values({
      userId: session.user.id,
      propertyId: validated.propertyId,
      actionType: 'claim_filed',
      entityType: 'claim',
      entityId: newClaim.id,
      description: `Insurance claim filed with ${validated.carrierName}`,
    });
    
    return NextResponse.json(
      { 
        message: 'Claim created successfully',
        claimId: newClaim.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Claim creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
