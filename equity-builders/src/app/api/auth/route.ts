/**
 * Auth API Route
 *
 * Handles login, registration, and demo access.
 * Uses JWT tokens stored in httpOnly cookies.
 *
 * In production, this would validate against a real database.
 * Currently uses a demo mode for platform evaluation.
 */
import { NextRequest, NextResponse } from "next/server";
import { createToken, setSession } from "@/lib/auth";
import type { UserRole } from "@/types";

/**
 * Demo users for platform evaluation.
 * These allow anyone to explore the full platform
 * without setting up a database.
 */
const DEMO_USERS = {
  "demo@equitybuilders.com": {
    id: "demo-user-001",
    email: "demo@equitybuilders.com",
    name: "Alex Morgan",
    role: "INTERNAL" as UserRole,
    password: "demo123",
  },
  "owner@equitybuilders.com": {
    id: "demo-user-002",
    email: "owner@equitybuilders.com",
    name: "Sarah Chen",
    role: "OWNER" as UserRole,
    password: "demo123",
  },
  "contractor@equitybuilders.com": {
    id: "demo-user-003",
    email: "contractor@equitybuilders.com",
    name: "Mike Rivera",
    role: "CONTRACTOR" as UserRole,
    password: "demo123",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "login": {
        const { email, password } = body;

        if (!email || !password) {
          return NextResponse.json(
            { success: false, error: "Email and password are required" },
            { status: 400 }
          );
        }

        // Check demo users first
        const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];
        if (demoUser && demoUser.password === password) {
          const token = await createToken({
            userId: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
          });

          await setSession(token);

          return NextResponse.json({
            success: true,
            data: {
              user: {
                id: demoUser.id,
                email: demoUser.email,
                name: demoUser.name,
                role: demoUser.role,
              },
            },
          });
        }

        // TODO: In production, validate against the database
        // const user = await db.user.findUnique({ where: { email } });
        // if (!user || !await bcrypt.compare(password, user.passwordHash)) { ... }

        return NextResponse.json(
          { success: false, error: "Invalid email or password" },
          { status: 401 }
        );
      }

      case "register": {
        const { name, email, password, role, organization } = body;

        if (!name || !email || !password || !role) {
          return NextResponse.json(
            { success: false, error: "All fields are required" },
            { status: 400 }
          );
        }

        // TODO: In production, create the user in the database
        // const hashedPassword = await bcrypt.hash(password, 12);
        // const user = await db.user.create({ data: { ... } });

        // For now, create a session with the provided data
        const userId = crypto.randomUUID();
        const token = await createToken({
          userId,
          email,
          name,
          role: role as UserRole,
        });

        await setSession(token);

        return NextResponse.json({
          success: true,
          data: {
            user: { id: userId, email, name, role, organization },
          },
        });
      }

      case "demo": {
        // Quick demo access — creates an INTERNAL session immediately
        const demoUser = DEMO_USERS["demo@equitybuilders.com"];
        const token = await createToken({
          userId: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
        });

        await setSession(token);

        return NextResponse.json({
          success: true,
          data: {
            user: {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
              role: demoUser.role,
            },
          },
        });
      }

      case "logout": {
        // Clear the session cookie
        const response = NextResponse.json({ success: true });
        response.cookies.delete("eb-session");
        return response;
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
