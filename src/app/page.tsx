'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  // useEffect(() => {
  //   async function checkAuth() {
  //     try {
  //       const res = await fetch("/api/user");
  //       const data = await res.json();

  //       if(data.user){
  //         setLoggedIn(true);
  //       }
  //     } catch {
  //       setLoggedIn(false);
  //     }
  //   }
  //   checkAuth();
  // }, []);

  // function handleClick(e: React.MouseEvent) {
  //   if (!loggedIn) {
  //     e.preventDefault();
  //     toast.info("Please login first to see all blogs.");
  //   }
  // }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold tracking-tight">The Minimal Blog</h1>
        <div className="space-x-4">
          <Link
            href="/login"
            className="text-sm uppercase tracking-wider font-medium text-gray-700 hover:text-red-600 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm uppercase tracking-wider font-medium text-gray-700 hover:text-red-600 transition-colors"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center px-8 text-center">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-bold mb-4 leading-tight tracking-tight">
            Discover Clean, Thoughtful Content
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Read high-quality blogs written by passionate minds. Clean design, focused content — just like Swiss design principles.
          </p>

          {/* Conditionally enable or disable the link */}
          <Link
            href="/blogs"
            // onClick={handleClick}
            className={`inline-block px-6 py-3 text-sm uppercase tracking-wider transition-colors ${
              true
                ? "bg-black text-white hover:bg-red-600"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            tabIndex={loggedIn ? 0 : -1} // disable keyboard focus if not logged in
            aria-disabled={!loggedIn}
          >
            See All Blogs
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-200">
        © {new Date().getFullYear()} The Minimal Blog. All rights reserved.
      </footer>
    </div>
  );
}
