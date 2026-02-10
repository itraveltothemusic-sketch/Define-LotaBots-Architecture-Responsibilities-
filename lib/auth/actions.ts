/**
 * Authentication Server Actions
 * 
 * Server-side actions for login, registration, and logout.
 */

"use server";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "./password";
import { createToken } from "./jwt";
import { setSessionCookie, clearSessionCookie } from "./session";
import { loginSchema, registerSchema } from "@/lib/utils/validation";
import type { ApiResponse } from "@/types";
import { redirect } from "next/navigation";

/**
 * Register a new user
 */
export async function registerUser(formData: FormData): Promise<ApiResponse> {
  try {
    const phoneValue = formData.get("phone");
    const companyValue = formData.get("company");

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      role: "owner",
      phone: typeof phoneValue === "string" ? phoneValue : undefined,
      company: typeof companyValue === "string" ? companyValue : undefined,
    };

    // Validate input
    const validated = registerSchema.parse(data);

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1);

    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists",
      };
    }

    // Hash password
    const passwordHash = await hashPassword(validated.password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: validated.email,
        passwordHash,
        name: validated.name,
        role: validated.role,
        phone: validated.phone || null,
        company: validated.company || null,
      })
      .returning();

    // Create session token
    const token = createToken(newUser);
    await setSessionCookie(token);

    return {
      success: true,
      message: "Account created successfully",
      data: {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error.message || "Failed to create account",
    };
  }
}

/**
 * Login user
 */
export async function loginUser(formData: FormData): Promise<ApiResponse> {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate input
    const validated = loginSchema.parse(data);

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        error: "Account is inactive. Please contact support.",
      };
    }

    // Verify password
    const isValid = await verifyPassword(validated.password, user.passwordHash);

    if (!isValid) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Create session token
    const token = createToken(user);
    await setSessionCookie(token);

    return {
      success: true,
      message: "Login successful",
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error.message || "Failed to login",
    };
  }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
