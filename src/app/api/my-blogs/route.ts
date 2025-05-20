import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/BlogModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = req.headers.get("user-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is missing in headers" }, { status: 400 });
    }

    const blogs = await Blog.find({ user: userId });

    return NextResponse.json(
      {
        blogs
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
