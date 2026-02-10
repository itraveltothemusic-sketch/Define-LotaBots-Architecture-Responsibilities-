import "server-only";

import { scryptSync, timingSafeEqual } from "node:crypto";

import type { SessionUser } from "@/types/domain";

interface StoredUser extends SessionUser {
  salt: string;
  passwordHash: string;
}

const SEEDED_USERS: StoredUser[] = [
  {
    id: "usr_owner_001",
    name: "Riley Morgan",
    email: "owner@equitybuilders.io",
    role: "OWNER",
    salt: "6711f20303192385401f054c88d01872",
    passwordHash:
      "64e9795d3e493feeabea13eba6cd6002e6bd3108cc6a00182103e1d7aa23d61beb2bc2ce4ed455803fd02b2778d643b3f90ca0217a10ad34eb2ea71110c0cf2a",
  },
  {
    id: "usr_contractor_001",
    name: "Jesse Patel",
    email: "contractor@equitybuilders.io",
    role: "CONTRACTOR",
    salt: "1fe109b6571845a9d5d90476e1c1e7de",
    passwordHash:
      "66921bff868151bda15b7616ca43ff5aa2d0dc1788437a9dc950ced2d99c300794168deec99f0f59ba0f744ef06ca36a2722ff8eceb1dda62be39a15cbf29bdb",
  },
  {
    id: "usr_adjuster_001",
    name: "Taylor Reed",
    email: "adjuster@equitybuilders.io",
    role: "ADJUSTER",
    salt: "6ec3ec81be7e7599c7e50df22ddf12f1",
    passwordHash:
      "602158888bebfaa5be0c70058537bd6f9066bba83e33c9bf76db1a386f9ef21e38c4347dcacc37fee65ceb1000e29679a11480a39f7bd80c041cd413f06bcb46",
  },
  {
    id: "usr_internal_001",
    name: "Casey Flynn",
    email: "internal@equitybuilders.io",
    role: "INTERNAL",
    salt: "c45ebf0942383bd096b277b895409370",
    passwordHash:
      "9bec95955933a431bf92e1cbc00336e208f745b0c8b21f7b74727b85f3bc9d34575cf86975a63e94624a3ab5cd95956dc5e637a283fb807819bf1562c4e69dbc",
  },
];

function verifyPassword(
  plainTextPassword: string,
  saltHex: string,
  hashHex: string,
): boolean {
  const candidateHash = scryptSync(plainTextPassword, saltHex, 64);
  const expectedHash = Buffer.from(hashHex, "hex");

  if (candidateHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(candidateHash, expectedHash);
}

export async function validateUserCredentials(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  const user = SEEDED_USERS.find(
    (candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
  );

  if (!user) {
    return null;
  }

  const valid = verifyPassword(password, user.salt, user.passwordHash);
  if (!valid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function getBootstrapUsers() {
  return SEEDED_USERS.map(({ email, role }) => ({ email, role }));
}
