import "server-only";

import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";

export async function getSession() {
  return getServerSession(authOptions);
}

