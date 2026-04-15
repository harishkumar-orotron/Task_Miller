import { get, post } from '../client'
import type { Organization, OrganizationDetail, OrgsParams, OrgsResponse } from '../../types/org.types'

// ─── GET /api/orgs ────────────────────────────────────────────────────────────

export async function getOrgsApi(params: OrgsParams = {}): Promise<OrgsResponse> {
  const query = new URLSearchParams()
  if (params.search)  query.set('name',    params.search)
  if (params.sortBy)  query.set('sortBy',  params.sortBy)
  if (params.order)   query.set('order',   params.order)
  if (params.page)    query.set('page',    String(params.page))
  if (params.limit)   query.set('limit',   String(params.limit))

  const qs   = query.toString()
  const path = qs ? `/api/orgs?${qs}` : '/api/orgs'
  return get<OrgsResponse>(path)
}

// ─── GET /api/orgs/:id ────────────────────────────────────────────────────────

export function getOrgApi(id: string): Promise<OrganizationDetail> {
  return get<OrganizationDetail>(`/api/orgs/${id}`)
}

// ─── POST /api/orgs ───────────────────────────────────────────────────────────

export function createOrgApi(body: { name: string; slug: string; description?: string }): Promise<Organization> {
  return post<Organization>('/api/orgs', body)
}
