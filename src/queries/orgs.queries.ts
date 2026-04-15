import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrgsApi, getOrgApi, createOrgApi } from '../http/services/orgs.service'
import type { OrgsParams } from '../types/org.types'

// ─── GET /api/orgs ────────────────────────────────────────────────────────────

export function useOrgs(params: OrgsParams = {}) {
  return useQuery({
    queryKey:        ['orgs', params],
    queryFn:         () => getOrgsApi(params),
    placeholderData: (prev) => prev,
  })
}

// ─── GET /api/orgs/:id ────────────────────────────────────────────────────────

export function useOrg(id: string) {
  return useQuery({
    queryKey: ['orgs', id],
    queryFn:  () => getOrgApi(id),
    enabled:  !!id,
  })
}

// ─── POST /api/orgs ───────────────────────────────────────────────────────────

export function useCreateOrgMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrgApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgs'] })
    },
  })
}
