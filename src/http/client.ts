import { authStore, clearAuth, setAuth } from '../store/auth.store'
import type { ApiError } from '../types/api.types'

export const BASE_URL = import.meta.env.VITE_API_URL

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
//
// All backend responses are wrapped: { success: true, data: <payload> }
// All backend errors are:            { success: false, statusCode, message }
//
// This function unwraps `.data` on success and throws the error body on failure.

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = authStore.state.accessToken

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  // Try silent token refresh on 401 — only when a session exists
  if (res.status === 401 && token) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      // Retry original request with new token
      const newToken = authStore.state.accessToken
      const retry = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
          ...(options.headers ?? {}),
        },
      })
      if (!retry.ok) {
        const errBody = await retry.json()
        throw Object.assign(new Error(errBody.message ?? 'Request failed'), errBody) as ApiError
      }
      const retryBody = await retry.json()
      return retryBody.data as T
    }

    // Refresh also failed — log out and redirect
    clearAuth()
    window.location.href = '/login'
    throw new Error('Session expired')
  }

  // Throw the full error body so UI can read .message / .errors
  if (!res.ok) {
    const body = await res.json()
    throw Object.assign(new Error(body.message ?? 'Request failed'), body) as ApiError
  }

  // Unwrap { success: true, data: <payload> }
  const body = await res.json()
  return body.data as T
}

// ─── Convenience methods ──────────────────────────────────────────────────────

export const get   = <T>(path: string) => request<T>(path, { method: 'GET' })
export const post  = <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) })
export const patch = <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) })
export const del   = <T>(path: string) => request<T>(path, { method: 'DELETE' })

// ─── Silent refresh ───────────────────────────────────────────────────────────

async function tryRefresh(): Promise<boolean> {
  const refreshToken = authStore.state.refreshToken
  if (!refreshToken) return false

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return false

    const body = await res.json()
    const { tokens } = body.data   // unwrap { success, data: { tokens } }
    const user = authStore.state.user!
    setAuth(user, tokens.accessToken, tokens.refreshToken)
    return true
  } catch {
    return false
  }
}
