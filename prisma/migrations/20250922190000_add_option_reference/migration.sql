-- Add optionId column to Response to track selected option
ALTER TABLE "Response" ADD COLUMN "optionId" TEXT;

-- Index for faster lookups by optionId
CREATE INDEX "Response_optionId_idx" ON "Response"("optionId");

-- Maintain referential integrity with Option records
ALTER TABLE "Response" ADD CONSTRAINT "Response_optionId_fkey"
  FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;
