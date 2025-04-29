-- AlterTable
ALTER TABLE "evaluations" ADD COLUMN     "accessCode" TEXT,
ADD COLUMN     "guestEmail" TEXT,
ALTER COLUMN "profileId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "evaluations_accessCode_idx" ON "evaluations"("accessCode");
