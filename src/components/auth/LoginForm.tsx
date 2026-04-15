import React, { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useLoginMutation } from '../../queries/auth.queries'
import type { ApiError } from '../../types/api.types'

export default function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  const { mutate: login, isPending, error } = useLoginMutation()

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    login(
      { email, password },
      { onSuccess: () => navigate({ to: '/dashboard' }) },
    )
  }

  const apiError = error as ApiError | null
  const errorMessage = apiError?.message ?? null
  const fieldErrors: Record<string, string> = {}
  if (Array.isArray(apiError?.errors)) {
    for (const e of apiError.errors) {
      if (e.field) fieldErrors[e.field] = e.message
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-sm p-8">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-gray-800 text-lg">Task Miller</span>
        </div>

        <h1 className="text-xl font-bold text-gray-800 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

        {errorMessage && Object.keys(fieldErrors).length === 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2.5 rounded-lg mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors ${fieldErrors.email ? 'border-red-400' : 'border-gray-200'}`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors ${fieldErrors.password ? 'border-red-400' : 'border-gray-200'}`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-orange-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/otp" className="text-sm text-orange-500 font-medium hover:underline">
            Sign in with OTP instead
          </Link>
        </div>

      </div>
    </div>
  )
}
