import { NextRequest, NextResponse } from 'next/server'
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/app/generated/prisma/client";
import { cookies } from 'next/headers';
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({adapter})

export async function POST(req: NextRequest) {

    try {

        const resetTagihan = await prisma.siswa.updateMany({
            data: {
                status_bayar: "unpaid"
            }
        })

        return NextResponse.json({
            code: 'SUCC_RESET',
            message: "successfully reset all trx paid to unpaid!",
            resetTagihan
        }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            code: 'ERR_CATCH',
            message: "please try again!",
            error
        }, {status: 400})
    }
}