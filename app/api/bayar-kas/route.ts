import { NextRequest, NextResponse } from 'next/server'
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/generated/prisma/client";
import { cookies } from 'next/headers';
import generateQRIS from '@/app/lib/generateQris';

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({adapter})

export async function POST(req: NextRequest) {
    const body = await req.json()
    const {nominal} = body
    const siswaId = (await cookies()).get('x-id-siswa')

    try {

        if (!nominal) {
            return NextResponse.json({
                code: 'EMPTY_FIELDS',
                message: "please input nominal field!",
            }, {status: 400})
        }

        if (!siswaId) {
            return NextResponse.json({
                code: 'ERR_AUTH',
                message: "please login first!",
            }, {status: 400})
        }
        
        const qris = generateQRIS(nominal)

        const trx = await prisma.transaksi.create({
            data: {
                nominal: Number(nominal),
                siswa_id: siswaId.value,
                status: 'pending'
            }
        })

        // (await cookies()).set('trx-id', trx.id)

        return NextResponse.json({
            code: 'SUCC_TRX',
            message: "successfully make a transaction, please continue the transaction!",
            qris: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qris)}`,
            nominal: nominal,
            trx
        }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            code: 'ERR_CATCH',
            message: "please try again!",
            error
        }, {status: 400})
    }
}