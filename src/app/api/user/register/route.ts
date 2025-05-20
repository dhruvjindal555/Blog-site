import dbConnect from "@/lib/dbConnect";
import User from "@/models/UserModel"
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";


const userSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string(),
}); 


export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const body = await req.json()
        const result = userSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                message: "Validation failed",
                errors: result.error.errors[0].message,
            }, { status: 400 });
        }

        let user = await User.findOne({ email: body.email })
        if (user) throw new Error('User already exists!')

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        user = await User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hashedPassword
        })

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