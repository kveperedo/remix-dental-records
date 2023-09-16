/*
  Warnings:

  - Made the column `address` on table `Record` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telephone` on table `Record` required. This step will fail if there are existing NULL values in that column.
  - Made the column `occupation` on table `Record` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Record" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "telephone" SET NOT NULL,
ALTER COLUMN "occupation" SET NOT NULL;
