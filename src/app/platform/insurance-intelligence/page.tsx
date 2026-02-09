import { analyzeModule } from "@/lib/atos/engine";
import { InsuranceIntelligenceModule } from "@/features/insurance/insurance-intelligence-module";
import { getInsuranceIntelligenceData } from "@/lib/data/repository";

export default async function InsuranceIntelligencePage() {
  const data = await getInsuranceIntelligenceData();
  const atos = analyzeModule("insurance-intelligence", data);

  return <InsuranceIntelligenceModule data={data} atos={atos} />;
}
