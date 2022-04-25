/*
  Warnings:

  - You are about to drop the `Motion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Motion" DROP CONSTRAINT "Motion_breakId_fkey";

-- DropForeignKey
ALTER TABLE "Motion" DROP CONSTRAINT "Motion_roundId_fkey";

-- AlterTable
ALTER TABLE "DebateRound" ADD COLUMN     "motion" TEXT NOT NULL DEFAULT E'';

-- DropTable
DROP TABLE "Motion";
