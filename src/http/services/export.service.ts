import { BASE_URL } from '../client'
import { authStore } from '../../store/auth.store'

export type ExportType = 'organizations' | 'projects' | 'tasks' | 'users'

export interface ExportParams {
  type:         ExportType
  filePrefix?:  string   // used for filename only, not sent to API
  id?:          string
  name?:        string
  title?:       string
  status?:      string
  priority?:    string
  projectId?:   string
  orgId?:       string
  fromDate?:    string
  toDate?:      string
  dueDateFrom?: string
  dueDateTo?:   string
}

const NON_API_KEYS = new Set(['filePrefix'])

export async function exportApi(params: ExportParams): Promise<any> {
  const token = authStore.state.accessToken
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => { if (v && !NON_API_KEYS.has(k)) query.set(k, v) })

  const res = await fetch(`${BASE_URL}/api/export?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) {
    const body = await res.json()
    throw Object.assign(new Error(body.message ?? 'Export failed'), body)
  }
  const body = await res.json()
  return body.data ?? body
}
