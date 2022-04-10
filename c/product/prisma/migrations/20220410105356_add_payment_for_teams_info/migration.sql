-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "paymentSessionID" TEXT;
