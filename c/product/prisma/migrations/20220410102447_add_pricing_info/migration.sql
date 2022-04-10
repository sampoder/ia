/*
  Warnings:

  - You are about to drop the column `stripeId` on the `Tournament` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "stripeId",
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "priceISOCode" TEXT NOT NULL DEFAULT E'SGD';

-- RenameIndex
ALTER INDEX "StripeAccount_tournamentId_unique" RENAME TO "StripeAccount.tournamentId_unique";
