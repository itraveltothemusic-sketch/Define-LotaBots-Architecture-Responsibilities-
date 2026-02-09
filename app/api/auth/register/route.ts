/**
 * User Registration API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['owner', 'contractor', 'adjuster', 'internal']),
  companyName: z.string().optional(),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1);
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(validated.password, 12);
    
    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name: validated.name,
        email: validated.email,
        passwordHash,
        role: validated.role,
        companyName: validated.companyName,
        phone: validated.phone,
      })
      .returning();
    
    return NextResponse.json(
      { 
        message: 'User created successfully',
        userId: newUser.id,
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
    
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
