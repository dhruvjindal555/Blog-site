import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/BlogModel";
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest, { params }: {
    params: Promise<{ id: string }>
}) {
    try {
        await dbConnect()
        const { id } = await params
        // console.log(id);


        // console.log(id.length);

        if (id.length != 24) {
            return NextResponse.json({
                error: "Blog not found"
            }, { status: 404 })
        }
        let blog = await Blog.findById(id).populate([
            { path: 'user', select: '-password' }
        ])
        if (!blog) {
            return NextResponse.json({
                error: "Blog not found"
            }, { status: 404 })
        }



        return NextResponse.json({
            blog: blog
        }, { status: 201 })

    } catch (error) {
        const message = error instanceof Error ? error.message : error
        
        return NextResponse.json({
            error: message
        }, { status: 500 })
    }
}