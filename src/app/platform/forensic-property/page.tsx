import { analyzeModule } from "@/lib/atos/engine";
import { getForensicPropertyData } from "@/lib/data/repository";
import { ForensicPropertyModule } from "@/features/forensic/forensic-property-module";

export default async function ForensicPropertyPage() {
  const data = await getForensicPropertyData();
  const atos = analyzeModule("forensic-property", data);

  return <ForensicPropertyModule data={data} atos={atos} />;
}
