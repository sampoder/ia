-- AlterTable
ALTER TABLE "Debate" ADD COLUMN     "carried" BOOLEAN;

-- CreateTable
CREATE TABLE "AdjudicatorRoundAvailabilityRelationship" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "adjudicatorId" TEXT NOT NULL,
    "teamId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdjudicatorRoundAvailabilityRelationship.roundId_unique" ON "AdjudicatorRoundAvailabilityRelationship"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "AdjudicatorRoundAvailabilityRelationship.adjudicatorId_unique" ON "AdjudicatorRoundAvailabilityRelationship"("adjudicatorId");

-- AddForeignKey
ALTER TABLE "AdjudicatorRoundAvailabilityRelationship" ADD FOREIGN KEY ("roundId") REFERENCES "DebateRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorRoundAvailabilityRelationship" ADD FOREIGN KEY ("adjudicatorId") REFERENCES "Adjudicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjudicatorRoundAvailabilityRelationship" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
