/*
  Warnings:

  - The primary key for the `adminusers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `adminusers` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `adminusers` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `adminusers` table. All the data in the column will be lost.
  - You are about to drop the `content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `AdminUsers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `AdminUsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adminusers` DROP PRIMARY KEY,
    DROP COLUMN `address`,
    DROP COLUMN `image`,
    DROP COLUMN `nama`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` VARCHAR(191) NULL DEFAULT 'admin',
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `content`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `EducationalContent` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `summary` VARCHAR(191) NULL,
    `thumbnailUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `category` VARCHAR(191) NULL DEFAULT 'general',

    INDEX `idx_educational_content_published`(`isPublished`),
    INDEX `idx_educational_content_category`(`category`),
    INDEX `idx_educational_content_created_at`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EducationalTag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `educationalContentId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `AdminUsers_email_key` ON `AdminUsers`(`email`);

-- AddForeignKey
ALTER TABLE `EducationalTag` ADD CONSTRAINT `EducationalTag_educationalContentId_fkey` FOREIGN KEY (`educationalContentId`) REFERENCES `EducationalContent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
