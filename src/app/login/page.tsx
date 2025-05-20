'use client'
// React import for component and useState hook
import React, { useState } from 'react';
// useForm hook from react-hook-form for form handling
import { useForm } from 'react-hook-form';
// Link component from Next.js for client-side navigation
import Link from 'next/link';
// zodResolver for integrating Zod schema validation with react-hook-form
import { zodResolver } from '@hookform/resolvers/zod';
// Zod library for schema validation
import { z } from 'zod';
// Next.js router for programmatic navigation
import { useRouter } from 'next/navigation';
// toast from react-toastify for showing notifications
import { toast } from 'react-toastify';

const formDataSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be of 8 length')
})
type FormData = z.infer<typeof formDataSchema>

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
  });

  const onSubmit = async (userCred: FormData) => {
    setIsLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
          email: userCred.email,
          password: userCred.password
        }),
        credentials: 'include'
      })
      const data = await res.json();
      if (!res.ok) throw new Error(data.error)

      console.log('login data', data.user);
      toast.success('Logged in successfully!')
      setLoginSuccess(true);
      router.push('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setLoginError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">

      <div className="h-2 bg-red-600 w-full"></div>

      <div className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 lg:col-span-4">
            <h1 className="text-6xl font-bold text-black tracking-tight mb-2">LOGIN</h1>
            <div className="h-1 w-16 bg-red-600 mb-6"></div>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Sign in to your account to access all blogs.
            </p>

            <div className="hidden md:block mt-12">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square ${i % 3 === 0 ? 'bg-red-600' : 'bg-black'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-6 lg:col-start-6">
            <div className="bg-white border border-gray-200 p-8">
              {loginSuccess ? (
                <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
                  <p className="text-green-800">Login successful! Redirecting...</p>
                </div>
              ) : (
                <>
                  {loginError && (
                    <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
                      <p className="text-red-800">{loginError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-1 focus:ring-black`}
                        placeholder="your@email.com"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                          Password
                        </label>
                        <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-red-600">
                          Forgot password?
                        </Link>
                      </div>
                      <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-1 focus:ring-black`}
                        placeholder="••••••••"
                        {...register('password')}
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-4 bg-black text-white uppercase text-sm tracking-wider font-medium 
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-600'} transition-colors flex justify-center`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : 'Sign In'}
                    </button>
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-gray-600">
                      <span className='mr-1'>
                        Don't have an account?
                      </span>
                      <Link href="/register" className="text-black font-medium hover:text-red-600">
                        Create one
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
