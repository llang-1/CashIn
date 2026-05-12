import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookiesSiswa = (await cookies()).get('x-id-siswa')
    const valueCookies = cookiesSiswa?.value

    if (!cookiesSiswa) {
        return NextResponse.json({
            code: "ERR",
            message: "Siswa session has not set"
        }, {status: 400})
    }

    return NextResponse.json({
            code: "SUCC",
            message: "Siswa session has been set",
            valueCookies
        }, {status: 200})
}