/*
  Warnings:

  - Added the required column `category` to the `Pengeluaran` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pengeluaran" ADD COLUMN     "category" TEXT NOT NULL;
