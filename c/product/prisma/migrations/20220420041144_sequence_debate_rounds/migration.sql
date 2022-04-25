/*
  Warnings:

  - You are about to drop the column `createdAt` on the `DebateRound` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DebateRound" DROP COLUMN "createdAt",
ADD COLUMN     "sequence" SERIAL NOT NULL;
