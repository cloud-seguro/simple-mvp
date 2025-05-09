-- Add guest details fields to the Evaluation table (if they don't exist)
DO $$
BEGIN
    -- Check and add guestFirstName column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'evaluations' AND column_name = 'guestFirstName') THEN
        ALTER TABLE "evaluations" ADD COLUMN "guestFirstName" TEXT;
    END IF;

    -- Check and add guestLastName column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'evaluations' AND column_name = 'guestLastName') THEN
        ALTER TABLE "evaluations" ADD COLUMN "guestLastName" TEXT;
    END IF;

    -- Check and add guestCompany column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'evaluations' AND column_name = 'guestCompany') THEN
        ALTER TABLE "evaluations" ADD COLUMN "guestCompany" TEXT;
    END IF;

    -- Check and add guestPhoneNumber column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'evaluations' AND column_name = 'guestPhoneNumber') THEN
        ALTER TABLE "evaluations" ADD COLUMN "guestPhoneNumber" TEXT;
    END IF;

    -- Add a comment to explain the purpose of these fields
    COMMENT ON COLUMN "evaluations"."guestFirstName" IS 'First name for guest users (non-registered users)';
    COMMENT ON COLUMN "evaluations"."guestLastName" IS 'Last name for guest users (non-registered users)';
    COMMENT ON COLUMN "evaluations"."guestCompany" IS 'Company name for guest users (non-registered users)';
    COMMENT ON COLUMN "evaluations"."guestPhoneNumber" IS 'Phone number for guest users (non-registered users)';
END $$; 