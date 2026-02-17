import { NextRequest, NextResponse } from 'next/server'
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/app/generated/prisma/client";
import { cookies } from 'next/headers';
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({adapter})

export async function GET() {
    // const body = await req.json()
    // const {trxId} = body
    // const siswaId = (await cookies()).get('x-id-siswa')

    try {

        const uangKas = await prisma.transaksi.aggregate({
            _sum: {
                nominal: true
            },
            where: {
                status: 'success'
            }
        })

        return NextResponse.json({
            code: 'SUCC_GETWAITING',
            message: "successfully got the waiting trx list!",
            uangKas
        }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            code: 'ERR_CATCH',
            message: "please try again!",
            error
        }, {status: 400})
    }
}