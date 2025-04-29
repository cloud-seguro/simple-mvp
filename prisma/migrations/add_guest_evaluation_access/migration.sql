-- Add guest email and access code fields to the Evaluation table
ALTER TABLE "Evaluation" ADD COLUMN "guestEmail" TEXT;
ALTER TABLE "Evaluation" ADD COLUMN "accessCode" TEXT;

-- Create an index on accessCode for faster lookups
CREATE INDEX "Evaluation_accessCode_idx" ON "Evaluation"("accessCode");

-- Add a comment to explain the purpose of these fields
COMMENT ON COLUMN "Evaluation"."guestEmail" IS 'Email address for guest users (non-registered users)';
COMMENT ON COLUMN "Evaluation"."accessCode" IS 'Unique access code for retrieving evaluation results without authentication'; 