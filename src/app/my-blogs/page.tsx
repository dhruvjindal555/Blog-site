'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import BlogEditModal from '@/components/BlogEditModal';
import { BlogPostsType } from '../blogs/page';

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<BlogPostsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const blogEditModalRef = useRef<HTMLDivElement>(null);
  const [editBlog, setEditBlog] = useState<BlogPostsType | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/my-blogs', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(`Error fetching blogs: ${response.statusText}`);
        }

        setBlogs(data.blogs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [showModal]);

  const publishedBlogs = blogs.filter(b => b.status === 'published');
  const draftBlogs = blogs.filter(b => b.status === 'draft');

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (blogEditModalRef && !blogEditModalRef.current?.contains(e.target as Node)) {
        setShowModal(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {showModal && (
        <BlogEditModal
          blogEditModalRef={blogEditModalRef}
          key={editBlog?._id || 'new'}
          editBlog={editBlog}
          onClose={() => setShowModal(false)}
        />
      )}

      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
        <Link href="/" className="text-3xl font-bold tracking-tight">
          The Minimal Blog
        </Link>
      </header>

      <div className="h-1 bg-red-600 w-full"></div>

      <div className="mx-auto px-4 py-12 max-w-6xl">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold text-black tracking-tight">My Blogs</h1>
          <button
            onClick={() => {
              setEditBlog(null);
              setShowModal(true);
            }}
            className="px-5 py-2 bg-black text-white uppercase text-sm tracking-wider hover:bg-red-600 transition-colors"
          >
            Create New Blog
          </button>
        </div>
        <div className="h-1 w-24 bg-red-600 mb-10"></div>

        {loading ? (
          <div className="text-center text-lg text-gray-600">Loading your blogs...</div>
        ) : (
          <>
            {/* Published Blogs */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-black mb-6">Published</h2>
              {publishedBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {publishedBlogs.map(post => (
                    <BlogCard
                      key={post._id}
                      post={post}
                      editClicked={() => {
                        setEditBlog(post);
                        setShowModal(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No published blogs yet.</p>
              )}
            </section>

            {/* Draft Blogs */}
            <section>
              <h2 className="text-2xl font-semibold text-black mb-6">Drafts</h2>
              {draftBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {draftBlogs.map(post => (
                    <BlogCard
                      key={post._id}
                      post={post}
                      editClicked={() => {
                        setEditBlog(post);
                        setShowModal(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No draft blogs available.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
