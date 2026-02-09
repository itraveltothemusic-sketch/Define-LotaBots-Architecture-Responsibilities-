/**
 * NextAuth.js v5 Configuration
 * 
 * Implements role-based authentication for Equity Builders platform.
 * Roles: owner, contractor, adjuster, internal
 */

import NextAuth, { NextAuthConfig, User, Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Extend NextAuth types
declare module 'next-auth' {
  interface User {
    role: 'owner' | 'contractor' | 'adjuster' | 'internal';
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'owner' | 'contractor' | 'adjuster' | 'internal';
    };
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validated = credentialsSchema.safeParse(credentials);
        
        if (!validated.success) {
          return null;
        }
        
        const { email, password } = validated.data;
        
        // Find user in database
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        
        if (!user || !user.passwordHash) {
          return null;
        }
        
        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        
        if (!isValid) {
          return null;
        }
        
        // Check if user is active
        if (!user.isActive) {
          throw new Error('Account is inactive');
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'owner' | 'contractor' | 'adjuster' | 'internal';
      }
      return session;
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
