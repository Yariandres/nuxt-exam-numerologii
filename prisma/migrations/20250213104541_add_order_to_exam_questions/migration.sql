/*
  Warnings:

  - You are about to drop the column `isCorrect` on the `ExamQuestion` table. All the data in the column will be lost.
  - Added the required column `order` to the `ExamQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamQuestion" DROP COLUMN "isCorrect",
ADD COLUMN     "order" INTEGER NOT NULL;
