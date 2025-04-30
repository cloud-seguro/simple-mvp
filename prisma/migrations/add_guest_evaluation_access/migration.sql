-- Add guest email and access code fields to the Evaluation table
ALTER TABLE "evaluations" ADD COLUMN "guestEmail" TEXT;
ALTER TABLE "evaluations" ADD COLUMN "accessCode" TEXT;

-- Create an index on accessCode for faster lookups
CREATE INDEX "Evaluation_accessCode_idx" ON "evaluations"("accessCode");

-- Add a comment to explain the purpose of these fields
COMMENT ON COLUMN "evaluations"."guestEmail" IS 'Email address for guest users (non-registered users)';
COMMENT ON COLUMN "evaluations"."accessCode" IS 'Unique access code for retrieving evaluation results without authentication'; 