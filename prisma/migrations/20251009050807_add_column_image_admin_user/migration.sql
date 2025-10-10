/*
  Warnings:

  - Added the required column `image` to the `AdminUsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adminusers` ADD COLUMN `image` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191) NULL;
