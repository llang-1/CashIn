import { NextRequest, NextResponse } from 'next/server'
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/app/generated/prisma/client";
import { cookies } from 'next/headers';
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({adapter})

export async function POST(req: NextRequest) {
    const body = await req.json()
    const {trxId} = body
    const siswaId = (await cookies()).get('x-id-siswa')
    const siswaIdValue = (await cookies()).get('x-id-siswa')?.value

    try {

        if (!trxId) {
            return NextResponse.json({
                code: 'EMPTY_ID',
                message: "please make a transaction first!",
            }, {status: 400})
        }

        if (!siswaId) {
            return NextResponse.json({
                code: 'ERR_AUTH',
                message: "please login first!",
            }, {status: 400})
        }

        const trxVerification = await prisma.transaksi.update({
            where: {
                id: trxId
            },
            data: {
                status: 'success',
                verifiedAt: new Date()
            }
        })

        await prisma.siswa.update({
            where: {
                id: siswaIdValue
            },
            data: {
                status_bayar: 'paid'
            }
        })

        return NextResponse.json({
            code: 'SUCC_VERIF',
            message: "successfully verification the trx, congratulations!",
            trxVerification
        }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            code: 'ERR_CATCH',
            message: "please try again!",
            error
        }, {status: 400})
    }
}