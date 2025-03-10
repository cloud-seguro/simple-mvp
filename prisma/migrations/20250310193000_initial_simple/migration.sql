/*
  Warnings:

  - The values [USER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[email]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EvaluationType" AS ENUM ('INITIAL', 'ADVANCED');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('FREE', 'PREMIUM', 'SUPERADMIN');
ALTER TABLE "profiles" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "profiles" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "profiles" ALTER COLUMN "role" SET DEFAULT 'FREE';
COMMIT;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "company" TEXT,
ADD COLUMN     "company_role" TEXT,
ADD COLUMN     "email" TEXT,
ALTER COLUMN "role" SET DEFAULT 'FREE';

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "type" "EvaluationType" NOT NULL,
    "title" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "profileId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "evaluations_profileId_idx" ON "evaluations"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
