/*
  Warnings:

  - You are about to drop the column `userId` on the `Token` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
