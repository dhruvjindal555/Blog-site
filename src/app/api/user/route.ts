import dbConnect from "@/lib/dbConnect";
import User from "@/models/UserModel"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const userId = req.headers.get('user-id')
        console.log(userId);        

        const user = await User.findById(userId?.valueOf)
        if (!user) throw new Error("User doesn't exists!")

        return NextResponse.json({
            user: user
        }, { status: 201 })

    } catch (error) {
        const message = error instanceof Error ? error.message : error

        return NextResponse.json({
            error: message
        }, { status: 500 })
    }
}