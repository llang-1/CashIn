-- CreateTable
CREATE TABLE "Siswa" (
    "id" SERIAL NOT NULL,
    "nis" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status_bayar" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kas" (
    "id" SERIAL NOT NULL,
    "nominal" TEXT NOT NULL,
    "tanggal_bayar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "siswa_id" INTEGER NOT NULL,

    CONSTRAINT "Kas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Kas" ADD CONSTRAINT "Kas_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
