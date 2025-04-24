-- CreateEnum
CREATE TYPE "EngagementStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "engagements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "EngagementStatus" NOT NULL DEFAULT 'PENDING',
    "budget" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT NOT NULL,
    "specialistId" TEXT NOT NULL,
    "dealId" TEXT,

    CONSTRAINT "engagements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engagement_messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderIsUser" BOOLEAN NOT NULL,
    "engagementId" TEXT NOT NULL,

    CONSTRAINT "engagement_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialist_deals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "specialistId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "specialist_deals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "engagements_profileId_idx" ON "engagements"("profileId");

-- CreateIndex
CREATE INDEX "engagements_specialistId_idx" ON "engagements"("specialistId");

-- CreateIndex
CREATE INDEX "engagements_dealId_idx" ON "engagements"("dealId");

-- CreateIndex
CREATE INDEX "engagement_messages_engagementId_idx" ON "engagement_messages"("engagementId");

-- CreateIndex
CREATE INDEX "specialist_deals_specialistId_idx" ON "specialist_deals"("specialistId");

-- CreateIndex
CREATE INDEX "specialist_deals_createdById_idx" ON "specialist_deals"("createdById");

-- AddForeignKey
ALTER TABLE "engagements" ADD CONSTRAINT "engagements_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engagements" ADD CONSTRAINT "engagements_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "specialists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engagements" ADD CONSTRAINT "engagements_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "specialist_deals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engagement_messages" ADD CONSTRAINT "engagement_messages_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specialist_deals" ADD CONSTRAINT "specialist_deals_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "specialists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specialist_deals" ADD CONSTRAINT "specialist_deals_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
