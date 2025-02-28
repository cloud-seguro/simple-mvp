/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "profiles_userId_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "avatarUrl",
DROP COLUMN "bio",
DROP COLUMN "birthDate",
DROP COLUMN "createdAt",
DROP COLUMN "fullName",
DROP COLUMN "location",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "website",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "profiles_user_id_idx" ON "profiles"("user_id");
