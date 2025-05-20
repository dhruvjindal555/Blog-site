import dbConnect from "@/lib/dbConnect";
import User from "@/models/UserModel"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";


const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});


export async function POST(req: NextRequest) {
    try {

        await dbConnect()
        const body = await req.json()
        const result = userLoginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                message: "Validation failed",
                errors: result.error.errors[0].message,
            }, { status: 400 });
        }

        const user = await User.findOne({ email: body.email })
        if (!user) throw new Error("User doesn't exists!")

        const verifyPassword = await bcrypt.compare(body.password, user.password); // true
        if (!verifyPassword) {
            return NextResponse.json({
                error: 'Incorrect Credentials'
            }, { status: 401 })
        }

        const token = jwt.sign({ user: user._id },
            process.env.SECRET_KEY || "THISISSECRET",
            {
                expiresIn: "2 days"
            },
        );


        const response = NextResponse.json({ user: user }, { status: 201 })

        response.cookies.set('token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24,
            sameSite:'strict'
        })

        return response

    } catch (error) {
        const message = error instanceof Error ? error.message : error

        return NextResponse.json({
            error: message
        }, { status: 500 })
    }
}