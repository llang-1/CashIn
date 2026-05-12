import { NextRequest, NextResponse } from 'next/server'
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/generated/prisma/client";
import { cookies } from 'next/headers';
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({adapter})

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
  const trxId = searchParams.get('trxId');

    try {

        const getTrx = await prisma.transaksi.findFirst({
            where: {
                id: String(trxId)
            }
        })

        return NextResponse.json({
            code: 'SUCC_GETWAITING',
            message: "successfully got the trx info!",
            getTrx
        }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            code: 'ERR_CATCH',
            message: "please try again!",
            error
        }, {status: 400})
    }
}