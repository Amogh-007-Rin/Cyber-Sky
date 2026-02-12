-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "remediationSteps" TEXT[] DEFAULT ARRAY[]::TEXT[];
