/**
 * Properties API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { properties, activityLog } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const propertySchema = z.object({
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  propertyType: z.string(),
  squareFootage: z.number().optional().nullable(),
  yearBuilt: z.number().optional().nullable(),
  stormDate: z.string().optional(),
  stormType: z.string().optional(),
  preDamageValue: z.number().optional().nullable(),
  description: z.string().optional(),
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
    const validated = propertySchema.parse(body);
    
    // Create property
    const [newProperty] = await db
      .insert(properties)
      .values({
        ownerId: session.user.id,
        address: validated.address,
        city: validated.city,
        state: validated.state,
        zipCode: validated.zipCode,
        propertyType: validated.propertyType,
        squareFootage: validated.squareFootage,
        yearBuilt: validated.yearBuilt,
        stormDate: validated.stormDate ? new Date(validated.stormDate) : null,
        stormType: validated.stormType,
        preDamageValue: validated.preDamageValue?.toString(),
        status: 'pending',
      })
      .returning();
    
    // Log activity
    await db.insert(activityLog).values({
      userId: session.user.id,
      propertyId: newProperty.id,
      actionType: 'property_created',
      entityType: 'property',
      entityId: newProperty.id,
      description: `Property registered: ${validated.address}`,
    });
    
    return NextResponse.json(
      { 
        message: 'Property created successfully',
        propertyId: newProperty.id,
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
    
    console.error('Property creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Fetch properties based on user role
    const userProperties = session.user.role === 'internal'
      ? await db.select().from(properties)
      : await db.select().from(properties).where(eq(properties.ownerId, session.user.id));
    
    return NextResponse.json({ properties: userProperties });
  } catch (error) {
    console.error('Properties fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
