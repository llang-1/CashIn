-- CreateTable
CREATE TABLE "Pengeluaran" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nominal" TEXT NOT NULL,
    "deskirpsi" TEXT NOT NULL,
    "tangga_pengeluaran" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pengeluaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);
