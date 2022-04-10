/*
  Warnings:

  - You are about to drop the column `userId` on the `StripeAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tournamentId]` on the table `StripeAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tournamentId` to the `StripeAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StripeAccount" DROP CONSTRAINT "StripeAccount_userId_fkey";

-- AlterTable
ALTER TABLE "StripeAccount" DROP COLUMN "userId",
ADD COLUMN     "tournamentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StripeAccount_tournamentId_unique" ON "StripeAccount"("tournamentId");

-- AddForeignKey
ALTER TABLE "StripeAccount" ADD FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
