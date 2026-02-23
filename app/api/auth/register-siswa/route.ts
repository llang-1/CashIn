// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/generated/prisma/client";


const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({adapter})

export async function POST(req: NextRequest) {
    const body = await req.json()
    const {nis, nama, password} = body;
    // const cookieStore = await cookies()

    try {
        if (!nis || !password) {
            return NextResponse.json({
                code: 'EMPTY_FIELDS',
                message: 'please input all fields!',
            }, {status: 400})
        }

        const siswa = await prisma.siswa.create({
            data: {
                nis,
                nama,
                password,
            }
        })

        if (!siswa) {
            return NextResponse.json({
                code: 'ERR_REGIS',
                message: 'siswa already created!',
            }, {status: 400})
        }

        return NextResponse.json({
            code: 'SUCC_REG',
            message: 'successfully registered. welcome!',
            siswa
        }, {status: 201})

    } catch (error: unknown) {
        return NextResponse.json({
            code: 'ERR_CATCH',
            message: error,
        }, {status: 400})
    }
}