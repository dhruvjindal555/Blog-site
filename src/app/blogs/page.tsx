'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

export type BlogPostsType = {
  _id?: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  user: {
    firstName: string
    lastName: string
  },
  status: 'published' | 'draft'
}

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true)
  const [blogPosts, setBlogPosts] = useState<BlogPostsType[]>([]);
  const allTags = [...new Set(blogPosts.flatMap(post => post.tags))];

  const filteredPosts = selectedTag
    ? blogPosts.filter(post => post.tags.includes(selectedTag))
    : blogPosts;

  // Fetch all blogs on component mount
  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const res = await fetch('api/blogs', { method: 'GET' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      // Only show published blogs
      let blogs: BlogPostsType[] = data.blogs
      blogs = blogs.filter((blog)=> blog.status==='published')

      setBlogPosts(blogs)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
        <Link href='/' className="text-3xl font-bold tracking-tight">The Minimal Blog</Link>
      </header>

      <div className="h-1 bg-red-600 w-full"></div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 relative">
            <h1 className="text-6xl font-bold text-black tracking-tight mb-2">BLOG</h1>
            <div className="h-1 w-24 bg-red-600 mb-6"></div>
            <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
              Insights, tutorials, and news about web development and design, presented with clarity and precision.
            </p>

            <div className="absolute top-0 right-0">
              <Link
                href="/my-blogs"
                className="inline-block px-5 py-2 bg-black text-white uppercase text-sm tracking-wider hover:bg-red-600 transition-colors"
              >
                My Blogs
              </Link>
            </div>
          </div>

          {/* Tag filter section */}
          <div className="lg:col-span-4">
            <div className="bg-black text-white p-6">
              <h2 className="text-lg font-medium mb-4 uppercase tracking-wider">FILTER BY TAG</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag("")}
                  className={`px-3 py-1 border border-white text-sm transition-colors
                    ${!selectedTag ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
                >
                  ALL
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 border border-white text-sm transition-colors
                      ${selectedTag === tag ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
                  >
                    {tag.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main>
          <div className="grid break-all grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post._id} className="flex flex-col bg-white border border-gray-200 group hover:shadow-lg transition-shadow duration-300">
                <div className={`${post.createdAt} h-2 w-full`}></div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">{new Date(post.createdAt).toDateString()}</p>

                    {post.user && (
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                        By {post.user.firstName} {post.user.lastName}
                      </p>
                    )}

                    <h2 className="text-2xl font-bold mb-3 group-hover:text-red-600 transition-colors">
                      <Link href={`/blogs/${post._id}`}>
                        {post.title}
                      </Link>
                    </h2>
                  </div>

                  <div className="prose text-gray-600 mb-6 flex-grow">
                    <p>{post.content.substring(0, 140)}...</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center">
                        <span className="h-3 w-3 mr-1 bg-black"></span>
                        <div
                          className="text-xs uppercase tracking-wider font-medium text-gray-800 hover:text-red-600"
                        >
                          {tag}
                        </div>
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link
                      href={`/blogs/${post._id}`}
                      className="inline-block px-5 py-2 bg-black text-white uppercase text-sm tracking-wider hover:bg-red-600 transition-colors"
                    >
                      Read Article
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {loading && (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              loading...
            </>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold mb-2">No posts found</h3>
              <p className="text-gray-600">No posts with the selected tag are available.</p>
              <button
                onClick={() => setSelectedTag("")}
                className="mt-4 px-5 py-2 bg-red-600 text-white uppercase text-sm tracking-wider hover:bg-black transition-colors"
              >
                Clear Filter
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
