import { requireUser } from "@/server/auth/require-user";
import { getIntelligenceSnapshot } from "@/modules/intelligence-center/data";
import { deriveAtosGuidance } from "@/modules/atos/engine";
import { AtosPanel } from "@/modules/atos/panel";

export default async function IntelligenceAtosSlot() {
  const session = await requireUser();
  const snapshot = await getIntelligenceSnapshot({
    userId: session.user.id,
    role: session.user.role,
  });
  const guidance = deriveAtosGuidance(snapshot);

  return <AtosPanel guidance={guidance} />;
}

