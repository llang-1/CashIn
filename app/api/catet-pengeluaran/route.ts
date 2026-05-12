import { NextRequest, NextResponse } from 'next/server';
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@/generated/prisma/client";
import { Pool } from 'pg';
 
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
 
interface ExpenseRequest {
  nama: string;
  nominal: string | number;
  deskripsi: string;
  category: string;
}
 
export async function POST(request: NextRequest) {
  try {
    const body: ExpenseRequest = await request.json();
    const { nama, nominal, deskripsi, category } = body;
 
    // 1. Validasi Input
    if (!nama || !nominal || !deskripsi) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }
 
    const nominalAngka = Number(nominal);
    
    if (isNaN(nominalAngka) || nominalAngka <= 0) {
      return NextResponse.json({ message: "Nominal harus angka valid" }, { status: 400 });
    }
 
    // 2. Gunakan Transaction agar Kalkulasi & Insert sinkron
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Ambil semua Transaksi Masuk (Success)
      const transaksiSuccess = await tx.transaksi.findMany({
        where: { status: 'success' },
      });
      const totalMasuk = transaksiSuccess.reduce((acc, curr) => acc + curr.nominal, 0);
 
      // B. Ambil semua Pengeluaran yang sudah ada
      const pengeluaranExist = await tx.pengeluaran.findMany();
      const totalKeluar = pengeluaranExist.reduce((acc, curr) => acc + curr.nominal, 0);
 
      // C. Hitung sisa saldo
      const saldoSekarang = totalMasuk - totalKeluar;
      
      console.log("DEBUG:", { totalMasuk, totalKeluar, saldoSekarang, nominalAngka });
 
      // D. Cek kecukupan
      if (saldoSekarang < nominalAngka) {
        throw new Error("SALDO_HABIS");
      }
 
      // E. Simpan Pengeluaran Baru
      const baru = await tx.pengeluaran.create({
        data: {
          nama: nama,
          nominal: nominalAngka,
          deskirpsi: deskripsi,
          category: category || "Umum",
          tangga_pengeluaran: new Date(),
        },
      });
 
      return { baru, sisa: saldoSekarang - nominalAngka };
    });
 
    return NextResponse.json({
      message: "Pengeluaran berhasil dicatat",
      data: result.baru,
      sisaSaldo: result.sisa
    }, { status: 201 });
 
  } catch (error) {
    console.error("Error:", error);
    
    if (error instanceof Error && error.message === "SALDO_HABIS") {
      return NextResponse.json(
        { message: "Gagal: Saldo kas tidak cukup!" }, 
        { status: 400 }
      );
    }
 
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" }, 
      { status: 500 }
    );
  }
}
 
export async function GET(request: NextRequest) {
  try {
    // A. Ambil semua Transaksi Masuk (Success)
    const transaksiSuccess = await prisma.transaksi.findMany({
      where: { status: 'success' },
    });
    const totalMasuk = transaksiSuccess.reduce((acc, curr) => acc + curr.nominal, 0);
 
    // B. Ambil semua Pengeluaran
    const pengeluaranExist = await prisma.pengeluaran.findMany();
    const totalKeluar = pengeluaranExist.reduce((acc, curr) => acc + curr.nominal, 0);
 
    // C. Hitung saldo
    const saldo = totalMasuk - totalKeluar;
 
    return NextResponse.json({
      totalMasuk,
      totalKeluar,
      saldo,
      jumlahPengeluaran: pengeluaranExist.length,
      pengeluaran: pengeluaranExist
    }, { status: 200 });
 
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" }, 
      { status: 500 }
    );
  }
}