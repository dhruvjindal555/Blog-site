import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/BlogModel";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title length must be greater than 1'),
  content: z.string().min(1, 'Content length must be greater than 1'),
  tags: z.array(z.string()).min(1, 'Tags are required'),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const result = blogSchema.safeParse(body);
    const userId = req.headers.get('user-id')
    console.log(userId);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          error: result.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    let blog;

    if (body.id) {
      blog = await Blog.findOneAndUpdate(
        { _id: body.id },
        {
          title: body.title,
          content: body.content,
          tags: body.tags,
          status: "draft",
        },
        { returnDocument: "after" }
      );
    } else {
      const user = await User.findById(userId)
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

      blog = await Blog.create({
        title: body.title,
        content: body.content,
        tags: body.tags,
        status: "draft",
        user: user
      });
      const prevBlogs = user.blogs
      prevBlogs.push(blog)

      user.blogs = prevBlogs

      await blog.save()
      await user.save()
    }

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
