import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/BlogModel";
import "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server"


export async function GET() {
    try {
        await dbConnect()

        const blogs = await Blog.find().populate('user', '-password')

        return NextResponse.json({
            blogs: blogs
        }, { status: 201 })

    } catch (error) {
        const message = error instanceof Error ? error.message : error

        return NextResponse.json({
            error: message
        }, { status: 500 })
    }
}