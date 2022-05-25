-- CreateTable
CREATE TABLE "RoomDebateRelationship" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,

    CONSTRAINT "RoomDebateRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomDebateRelationship_debateId_key" ON "RoomDebateRelationship"("debateId");

-- AddForeignKey
ALTER TABLE "RoomDebateRelationship" ADD CONSTRAINT "RoomDebateRelationship_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomDebateRelationship" ADD CONSTRAINT "RoomDebateRelationship_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
