/*
  Warnings:

  - The `status_bayar` column on the `Siswa` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusSiswa" AS ENUM ('paid', 'unpaid');

-- AlterTable
ALTER TABLE "Siswa" DROP COLUMN "status_bayar",
ADD COLUMN     "status_bayar" "StatusSiswa" NOT NULL DEFAULT 'unpaid';
