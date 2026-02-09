import { ContractorExecutionModule } from "@/features/contractor/contractor-execution-module";
import { analyzeModule } from "@/lib/atos/engine";
import { getContractorExecutionData } from "@/lib/data/repository";

export default async function ContractorExecutionPage() {
  const data = await getContractorExecutionData();
  const atos = analyzeModule("contractor-execution", data);

  return <ContractorExecutionModule data={data} atos={atos} />;
}
