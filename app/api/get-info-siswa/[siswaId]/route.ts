import { NextRequest, NextResponse } from 'next/server'
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/generated/prisma/client";
import { cookies } from 'next/headers';
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({adapter})

// Memaksa Route ini untuk selalu mengambil data terbaru (no-cache)
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ siswaId: string }> } // Definisikan params sebagai Promise
) {
    try {
        // PERBAIKAN: Unwrapping params menggunakan await (Wajib di Next.js 15+)
        const resolvedParams = await params;
        const idSiswa = resolvedParams.siswaId;

        // Validasi awal untuk mencegah pencarian dengan ID kosong atau string "undefined"
        if (!idSiswa || idSiswa === 'undefined') {
            return NextResponse.json({
                code: 'ERR_INVALID_ID',
                message: 'ID Siswa tidak valid atau tidak ditemukan'
            }, { status: 400 });
        }

        const siswa = await prisma.siswa.findUnique({
            where: {
                id: idSiswa
            },
            select: {
                id: true,
                nis: true,
                nama: true,
                status_bayar: true,
                createAt: true
            }
        });

        // Jika data tidak ditemukan di database
        if (!siswa) {
            return NextResponse.json({
                code: 'ERR_404',
                message: `Data siswa dengan ID ${idSiswa} tidak ditemukan`
            }, { status: 404 });
        }

        // Respon sukses
        return NextResponse.json({
            code: 'SUCC',
            message: 'Data siswa ditemukan',
            siswa
        }, { status: 200 });

    } catch (error) {
        console.error("Internal API Error:", error);
        return NextResponse.json({
            code: 'ERR_SERVER',
            message: 'Terjadi kesalahan pada server internal',
            error: error
        }, { status: 500 });
    }
}