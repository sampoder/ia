-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT E'https://www.gravatar.com/avatar/3a794f7bbeb6e5d4287debf1454ebcf5?d=identicon&r=pg',
ADD COLUMN     "cover" TEXT;
