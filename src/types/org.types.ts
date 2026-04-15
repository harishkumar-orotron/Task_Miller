export interface OrgsParams {
  search?:  string
  sortBy?:  'name' | 'createdAt'
  order?:   'asc' | 'desc'
  page?:    number
  limit?:   number
}

export interface OrgsResponse {
  organizations: Organization[]
  total:         number
  page:          number
  limit:         number
  totalPages:    number
}

export interface Organization {
  id: string
  name: string
  slug: string
  ownerId: string | null
  createdAt: string
}

export interface OrgMember {
  memberId: string
  role: 'admin' | 'developer'
  joinedAt: string
  userId: string
  name: string
  email: string
  avatarUrl: string | null
  status: string
}

export interface OrganizationDetail extends Organization {
  description: string | null
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  members: OrgMember[]
}
