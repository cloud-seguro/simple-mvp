-- CreateEnum
CREATE TYPE "BlogPostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "description" TEXT,
ADD COLUMN     "featuredImage" TEXT,
ADD COLUMN     "status" "BlogPostStatus" NOT NULL DEFAULT 'DRAFT';
