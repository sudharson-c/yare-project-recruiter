/*
  Warnings:

  - The `collaborators_id` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "collaborators_id",
ADD COLUMN     "collaborators_id" TEXT[] DEFAULT ARRAY[]::TEXT[];
