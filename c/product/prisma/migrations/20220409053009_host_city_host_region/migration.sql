/*
  Warnings:

  - You are about to drop the column `hostCity` on the `Tournament` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "hostCity",
ADD COLUMN     "hostRegion" TEXT;
