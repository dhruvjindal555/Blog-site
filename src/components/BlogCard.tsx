// Importing type for blog posts and React
import { BlogPostsType } from '@/app/blogs/page';
import React from 'react';

const BlogCard = ({ post, editClicked }: { post: BlogPostsType, editClicked: () => void }) => {
  return (
    <article
      key={post._id}
      className="flex break-all flex-col bg-white border border-gray-200 group hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          {/* Display post creation date */}
          <p className="text-sm text-gray-500 font-medium mb-1">
            {new Date(post.createdAt).toDateString()}
          </p>
          {/* Display post title */}
          <h2 className="text-2xl font-bold mb-3 group-hover:text-red-600 transition-colors">
            {post.title}
          </h2>
        </div>

        <div className="break-all text-gray-600 mb-6 flex-grow">
          {/* Render a snippet of post content as HTML */}
          <p>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content.substring(0, 140) }}
            />
          </p>
        </div>

        {/* Display tags associated with the post */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="h-3 w-3 mr-1 bg-black"></span>
              <div className="text-xs uppercase tracking-wider font-medium text-gray-800 hover:text-red-600">
                {tag}
              </div>
            </span>
          ))}
        </div>

        {/* Edit button */}
        <div className="mt-auto flex justify-between items-center">
          <button
            onClick={editClicked}
            className="inline-block px-4 py-2 bg-black text-white uppercase text-sm tracking-wider hover:bg-red-600 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </article>
  )
}

export default BlogCard;
