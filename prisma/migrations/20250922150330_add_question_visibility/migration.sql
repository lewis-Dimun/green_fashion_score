-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;
-- Add unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS "SurveyResult_userId_key" ON "public"."SurveyResult"("userId");
