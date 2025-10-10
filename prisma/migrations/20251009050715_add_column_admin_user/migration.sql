/*
  Warnings:

  - Added the required column `address` to the `AdminUsers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `AdminUsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adminusers` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `nama` VARCHAR(191) NOT NULL;
