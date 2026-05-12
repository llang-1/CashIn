import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'


export async function POST() {

    try {
        
        const logout = (await cookies()).delete('x-id-siswa')

        if (!logout) {
            return NextResponse.json({
                code: 'ERR_DEL',
                message: 'could not delete the cookies/session'
            }, {status: 400})
        }

        return NextResponse.json({
            code: 'SUCC_DEL',
            message: 'successfully deleted cookies/session'
        }, {status: 200})

    } catch (error: unknown) {
        return NextResponse.json({
            code: 'ERR_CATCH',
            message: error,
        }, {status: 400})
    }
}