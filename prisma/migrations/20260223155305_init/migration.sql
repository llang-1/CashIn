/*
  Warnings:

  - A unique constraint covering the columns `[nama]` on the table `Siswa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nama_siswa` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaksi" ADD COLUMN     "nama_siswa" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nama_key" ON "Siswa"("nama");

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_nama_siswa_fkey" FOREIGN KEY ("nama_siswa") REFERENCES "Siswa"("nama") ON DELETE RESTRICT ON UPDATE CASCADE;
