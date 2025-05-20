'use client'
// React and hooks
import React, { useState } from 'react';
// Form management with react-hook-form
import { useForm } from 'react-hook-form';
// Zod schema resolver for validation
import { zodResolver } from '@hookform/resolvers/zod';
// Zod for schema validation
import * as z from 'zod';
// Next.js Link component for client-side navigation
import Link from 'next/link';
// Next.js router for navigation after register
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  firstName: z.string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must be less than 50 characters' }),
  lastName: z.string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name must be less than 50 characters' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter()
  // Loading state during form submission
  const [isLoading, setIsLoading] = useState(false);
  // Success state after registration
  const [registerSuccess, setRegisterSuccess] = useState(false);
  // Error message state for registration failure
  const [registerError, setRegisterError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors,  isDirty, isValid },
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange' // Validate on input change
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setRegisterError('');

    try {
      // Send registration data to API
      const res = await fetch('/api/user/register', {
        method: 'POST',
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        })
      })
      const registerData = await res.json()
      if (!res.ok) throw new Error(registerData.error)

      setRegisterSuccess(true);
      // Redirect to login page after success
      router.push('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setRegisterError(message);
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
            <h1 className="text-6xl font-bold text-black tracking-tight mb-2">REGISTER</h1>
            <div className="h-1 w-24 bg-red-600 mb-6"></div>

            <div className="hidden md:block mt-12">
              <h3 className="text-sm text-gray-700 uppercase tracking-wider font-medium mb-4">Password Requirements</h3>
              <ul className="space-y-2">
                {/* Show password validation status */}
                {[ 
                  { text: "At least 8 characters", condition: watch('password')?.length >= 8 || false },
                  { text: "Contains uppercase letter", condition: /[A-Z]/.test(watch('password') || '') },
                  { text: "Contains lowercase letter", condition: /[a-z]/.test(watch('password') || '') },
                  { text: "Contains number", condition: /[0-9]/.test(watch('password') || '') }
                ].map((requirement, i) => (
                  <li key={i} className="flex items-center">
                    <div className={`h-4 w-4 mr-2 ${requirement.condition ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={`text-sm ${requirement.condition ? 'text-green-700' : 'text-gray-600'}`}>
                      {requirement.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-6 lg:col-start-6">
            <div className="bg-white border border-gray-200 p-8">
              {registerSuccess ? (
                <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
                  <p className="text-green-800">Registration successful! You can now log in to your account.</p>
                  <Link href="/login" className="mt-4 inline-block px-4 py-2 bg-black text-white uppercase text-sm tracking-wider hover:bg-red-600 transition-colors">
                    Go to login
                  </Link>
                </div>
              ) : (
                <>
                  {/* Show error if registration failed */}
                  {registerError && (
                    <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
                      <p className="text-red-800">{registerError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-1">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          autoComplete="given-name"
                          className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-1 focus:ring-black`}
                          placeholder="first name"
                          {...register('firstName')}
                        />
                        {/* Validation error for first name */}
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-1">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          autoComplete="family-name"
                          className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-1 focus:ring-black`}
                          placeholder="last name"
                          {...register('lastName')}
                        />
                        {/* Validation error for last name */}
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

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
                      {/* Validation error for email */}
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-1 focus:ring-black`}
                        placeholder="••••••••"
                        {...register('password')}
                      />
                      {/* Validation error for password */}
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-1">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-1 focus:ring-black`}
                        placeholder="••••••••"
                        {...register('confirmPassword')}
                      />
                      {/* Validation error for confirm password */}
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !isDirty || !isValid}
                      className={`w-full py-3 px-4 bg-black text-white uppercase text-sm tracking-wider font-medium 
                        ${(isLoading || !isDirty || !isValid) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-600'} transition-colors flex justify-center`}
                    >
                      {/* Show loading spinner when submitting */}
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Registering...
                        </>
                      ) : (
                        'Register'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
