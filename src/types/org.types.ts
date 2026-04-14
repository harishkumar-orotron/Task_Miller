export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  ownerId?: string
  createdAt: string
}

export interface OrgMember {
  id: string
  orgId: string
  userId: string
  role: 'admin' | 'developer'
  joinedAt: string
}
