import { analyzeModule } from "@/lib/atos/engine";
import { getIntelligenceCenterData } from "@/lib/data/repository";
import { IntelligenceCenter } from "@/features/intelligence/intelligence-center";

export default async function IntelligenceCenterPage() {
  const data = await getIntelligenceCenterData();
  const atos = analyzeModule("intelligence", data);

  return <IntelligenceCenter data={data} atos={atos} />;
}
