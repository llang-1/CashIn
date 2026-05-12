import { NextRequest, NextResponse } from 'next/server'
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/generated/prisma/client";
import { cookies } from 'next/headers';
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({adapter})
export async function GET() {
  try {
    // Mengambil semua data pengeluaran dari database
    // Diurutkan berdasarkan tanggal terbaru
    const expenses = await prisma.pengeluaran.findMany();

    return NextResponse.json(
      {
        success: true,
        expenses: expenses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil daftar pengeluaran",
      },
      { status: 500 }
    );
  }
}