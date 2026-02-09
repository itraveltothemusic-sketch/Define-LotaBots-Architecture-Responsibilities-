import {
  listClaims,
  listDamageClassifications,
  listEquityOutcomes,
  listEvidence,
  listPropertyProfiles,
} from "@/lib/db/repositories";

export async function getPortfolioKpis() {
  const [properties, claims, evidence, damage, outcomes] = await Promise.all([
    listPropertyProfiles(),
    listClaims(),
    listEvidence(),
    listDamageClassifications(),
    listEquityOutcomes(),
  ]);

  const totalInsuredValueUsd = properties.reduce(
    (total, property) => total + property.insuredValueUsd,
    0,
  );
  const totalSubmittedClaimUsd = claims.reduce(
    (total, claim) => total + claim.submittedScopeUsd,
    0,
  );
  const totalPayoutUsd = claims.reduce((total, claim) => total + claim.payoutUsd, 0);
  const verifiedEvidencePct =
    evidence.length === 0
      ? 0
      : evidence.filter((item) => item.verificationStatus === "Verified").length /
        evidence.length;
  const severeDamageCount = damage.filter(
    (item) => item.severity === "critical" || item.severity === "high",
  ).length;
  const totalEquityGainUsd = outcomes.reduce(
    (total, outcome) => total + outcome.equityGainUsd,
    0,
  );

  return {
    totalInsuredValueUsd,
    totalSubmittedClaimUsd,
    totalPayoutUsd,
    verifiedEvidencePct,
    severeDamageCount,
    totalEquityGainUsd,
  };
}
