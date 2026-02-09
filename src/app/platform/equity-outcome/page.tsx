import { EquityOutcomeModule } from "@/features/equity/equity-outcome-module";
import { analyzeModule } from "@/lib/atos/engine";
import { getEquityOutcomeData } from "@/lib/data/repository";

export default async function EquityOutcomePage() {
  const data = await getEquityOutcomeData();
  const atos = analyzeModule("equity-outcome", data);

  return <EquityOutcomeModule data={data} atos={atos} />;
}
