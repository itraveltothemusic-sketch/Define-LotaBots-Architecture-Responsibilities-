import { jwtVerify, SignJWT } from "jose";
import type { PlatformUser } from "@/types/domain";

export const SESSION_ISSUER = "equity-builders";
export const SESSION_AUDIENCE = "equity-builders-platform";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

const encoder = new TextEncoder();

function getSessionSecret() {
  return encoder.encode(
    process.env.AUTH_SECRET ?? "equity-builders-dev-secret-change-in-prod",
  );
}

export async function signSessionToken(user: PlatformUser) {
  return new SignJWT({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSessionSecret());
}

export async function verifySessionToken(token: string): Promise<PlatformUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role as PlatformUser["role"],
    };
  } catch {
    return null;
  }
}
