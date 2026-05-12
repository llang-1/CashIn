import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookiesAdmin = (await cookies()).get('admin-auth')
    const valueCookies = cookiesAdmin?.value

    if (!cookiesAdmin) {
        return NextResponse.json({
            code: "ERR",
            message: "admin session has not set"
        }, {status: 400})
    }

    return NextResponse.json({
            code: "SUCC",
            message: "admin session has been set",
            valueCookies
        }, {status: 200})
}