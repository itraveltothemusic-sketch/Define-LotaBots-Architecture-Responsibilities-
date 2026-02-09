-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM (
  'DRAFT',
  'OPEN',
  'SUBMITTED',
  'UNDER_REVIEW',
  'PARTIAL_PAYMENT',
  'SETTLED',
  'CLOSED'
);

-- CreateEnum
CREATE TYPE "InteractionChannel" AS ENUM (
  'EMAIL',
  'PHONE',
  'IN_PERSON',
  'PORTAL',
  'LETTER',
  'OTHER'
);

-- CreateTable
CREATE TABLE "Claim" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "carrierName" TEXT NOT NULL,
  "claimNumber" TEXT,
  "status" "ClaimStatus" NOT NULL DEFAULT 'OPEN',
  "lossDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrierInteraction" (
  "id" TEXT NOT NULL,
  "claimId" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "channel" "InteractionChannel" NOT NULL DEFAULT 'EMAIL',
  "summary" TEXT NOT NULL,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CarrierInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Claim_propertyId_idx" ON "Claim"("propertyId");

-- CreateIndex
CREATE INDEX "CarrierInteraction_claimId_idx" ON "CarrierInteraction"("claimId");

-- AddForeignKey
ALTER TABLE "Claim"
  ADD CONSTRAINT "Claim_propertyId_fkey"
  FOREIGN KEY ("propertyId") REFERENCES "Property"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierInteraction"
  ADD CONSTRAINT "CarrierInteraction_claimId_fkey"
  FOREIGN KEY ("claimId") REFERENCES "Claim"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierInteraction"
  ADD CONSTRAINT "CarrierInteraction_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

