import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { nama, password } = body

    try {
        const validAdmin = await prisma.admin.findFirst({
            where: {
                nama: nama
            }
        })

        if (!nama || !password) {
            return NextResponse.json({
                code: 'ERR_LOGIN',
                message: 'please input all fields!',
            }, { status: 400 })
        }

        if (!validAdmin) {
            return NextResponse.json({
                code: 'ERR_LOGIN_404',
                message: 'admin not found. please make sure the account is correct!',
            }, { status: 400 })
        }

        (await cookies()).set('admin-auth', String(validAdmin.id), {
            httpOnly: true
        })

        return NextResponse.json({
            code: 'SUCC_LOGIN',
            message: 'successfuly logged! welcome admin',
        }, { status: 201 })
    } catch (error) {
        console.error(error)
    }
}