-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "timezone" TEXT,
ALTER COLUMN "description" SET DEFAULT E'More information coming soon!';
