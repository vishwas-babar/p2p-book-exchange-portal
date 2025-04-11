-- AlterEnum
ALTER TYPE "BookStatus" ADD VALUE 'EXCHANGED';

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "exchangedWithId" TEXT;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_exchangedWithId_fkey" FOREIGN KEY ("exchangedWithId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
