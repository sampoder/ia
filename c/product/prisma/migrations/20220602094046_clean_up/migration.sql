/*
  Warnings:

  - You are about to drop the column `breakRound` on the `DebateRound` table. All the data in the column will be lost.
  - You are about to drop the column `breakId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `stillInBreak` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `breakLevel` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `institutionId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AdjudicatorInstitutionConflictsRelationship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdjudicatorTeamConflictsRelationship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Break` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BreakDebate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Institution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamInstitutionConflictsRelationship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdjudicatorInstitutionConflictsRelationship" DROP CONSTRAINT "AdjudicatorInstitutionConflictsRelationship_adjudicatorId_fkey";

-- DropForeignKey
ALTER TABLE "AdjudicatorInstitutionConflictsRelationship" DROP CONSTRAINT "AdjudicatorInstitutionConflictsRelationship_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "AdjudicatorTeamConflictsRelationship" DROP CONSTRAINT "AdjudicatorTeamConflictsRelationship_adjudicatorId_fkey";

-- DropForeignKey
ALTER TABLE "AdjudicatorTeamConflictsRelationship" DROP CONSTRAINT "AdjudicatorTeamConflictsRelationship_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Break" DROP CONSTRAINT "Break_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "BreakDebate" DROP CONSTRAINT "BreakDebate_breakId_fkey";

-- DropForeignKey
ALTER TABLE "BreakDebate" DROP CONSTRAINT "BreakDebate_debateId_fkey";

-- DropForeignKey
ALTER TABLE "BreakDebate" DROP CONSTRAINT "BreakDebate_nextDebateId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_breakId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInstitutionConflictsRelationship" DROP CONSTRAINT "TeamInstitutionConflictsRelationship_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInstitutionConflictsRelationship" DROP CONSTRAINT "TeamInstitutionConflictsRelationship_teamId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_institutionId_fkey";

-- AlterTable
ALTER TABLE "DebateRound" DROP COLUMN "breakRound";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "breakId",
DROP COLUMN "stillInBreak";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "breakLevel";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "institutionId";

-- DropTable
DROP TABLE "AdjudicatorInstitutionConflictsRelationship";

-- DropTable
DROP TABLE "AdjudicatorTeamConflictsRelationship";

-- DropTable
DROP TABLE "Break";

-- DropTable
DROP TABLE "BreakDebate";

-- DropTable
DROP TABLE "Institution";

-- DropTable
DROP TABLE "TeamInstitutionConflictsRelationship";
