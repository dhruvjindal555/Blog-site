import Link from "next/link"; // For client-side navigation between pages
import { cookies } from "next/headers"; // To access cookies in server components

// Fetch blog data by ID with cookie included for authentication/session
async function getData(id: string) {
    const cookie = await cookies()
    const res = await fetch(`https://blog-site-kptzouw6v-dhruv-jindals-projects.vercel.app/api/blogs/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookie.toString(),
        },
        cache: "no-store", // Disable caching to always get fresh data
    });

    if (!res.ok) {
        console.error("Failed to fetch blog:", res.status);
        return res.json();
    }

    return res.json();
}

// Server component to render a single blog post page
export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const id = await params

    const data = await getData(id.id);
    const post = data.blog
    console.log(post);

    if (!post) return <p className="text-center mt-10">Blog not found.</p>;

    return (
        <main className="min-h-screen bg-white text-gray-900 px-6 py-12">
            <div className="max-w-3xl mx-auto">
                {/* Blog title */}
                <h1 className="text-4xl font-bold mb-4 leading-tight tracking-tight">
                    {post.title}
                </h1>

                {/* Post date and author */}
                <div className="text-sm text-gray-500 mb-6 uppercase tracking-wide space-y-1">
                    <p>{new Date(post.createdAt).toDateString()}</p>
                    {post.user && (
                        <p>By {post.user.firstName} {post.user.lastName}</p>
                    )}
                </div>

                {/* Tags if available */}
                {post.tags?.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                        {post.tags.map((tag: string) => (
                            <div
                                key={tag}
                                className="inline-block text-xs uppercase tracking-wider bg-gray-100 text-gray-700 px-3 py-1 rounded hover:text-red-600 transition-colors"
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                )}

                {/* Blog content rendered as HTML */}
                <article className="prose max-w-none text-gray-800">
                    <p>
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </p>
                </article>

                {/* Link back to blog list */}
                <div className="mt-10">
                    <Link
                        href="/blogs"
                        className="inline-block px-5 py-2 bg-black text-white uppercase text-sm tracking-wider hover:bg-red-600 transition-colors"
                    >
                        ← Back to All Blogs
                    </Link>
                </div>
            </div>
        </main>
    );
}
