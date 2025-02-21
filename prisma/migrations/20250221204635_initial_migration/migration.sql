-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "bio" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "website" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");
