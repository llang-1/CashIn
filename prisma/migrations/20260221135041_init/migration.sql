-- CreateEnum
CREATE TYPE "StatusSiswa" AS ENUM ('paid', 'unpaid');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'waiting', 'success');

-- CreateTable
CREATE TABLE "Siswa" (
    "id" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status_bayar" "StatusSiswa" NOT NULL DEFAULT 'unpaid',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id")
);

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
