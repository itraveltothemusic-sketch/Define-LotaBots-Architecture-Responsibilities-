import { canAccessModule } from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/session";
import type { ModuleKey } from "@/types/domain";

export async function getModuleAccess(module: ModuleKey) {
  const session = await requireSession();
  return {
    session,
    allowed: canAccessModule(session.role, module),
  };
}
