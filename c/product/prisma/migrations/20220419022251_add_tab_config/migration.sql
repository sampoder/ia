-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "maxSpeakerScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
ADD COLUMN     "minSpeakerScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "missableSpeeches" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "opposingSideLabel" TEXT NOT NULL DEFAULT E'Opposition',
ADD COLUMN     "speakerScoreStep" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "supportingSideLabel" TEXT NOT NULL DEFAULT E'Proposition';
