-- CreateEnum
CREATE TYPE "ExpertiseArea" AS ENUM ('NETWORK_SECURITY', 'APPLICATION_SECURITY', 'CLOUD_SECURITY', 'INCIDENT_RESPONSE', 'SECURITY_ASSESSMENT', 'COMPLIANCE', 'SECURITY_TRAINING', 'SECURITY_ARCHITECTURE', 'DATA_PROTECTION', 'GENERAL');

-- CreateTable
CREATE TABLE "specialists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "expertiseAreas" "ExpertiseArea"[],
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "website" TEXT,
    "imageUrl" TEXT,
    "minMaturityLevel" INTEGER NOT NULL,
    "maxMaturityLevel" INTEGER NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "specialists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "specialists_createdById_idx" ON "specialists"("createdById");

-- AddForeignKey
ALTER TABLE "specialists" ADD CONSTRAINT "specialists_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
