/*
  Warnings:

  - The primary key for the `Siswa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Kas` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'waiting', 'success');

-- DropForeignKey
ALTER TABLE "Kas" DROP CONSTRAINT "Kas_siswa_id_fkey";

-- AlterTable
ALTER TABLE "Siswa" DROP CONSTRAINT "Siswa_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Siswa_id_seq";

-- DropTable
DROP TABLE "Kas";

-- CreateTable
CREATE TABLE "Transaksi" (
    "id" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "tanggal_bayar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "siswa_id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
