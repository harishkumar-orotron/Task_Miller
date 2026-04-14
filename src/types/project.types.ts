export type ProjectStatus = 'active' | 'on_hold' | 'completed'

export interface Project {
  id: string
  orgId: string
  title: string
  description?: string
  logoUrl?: string
  status: ProjectStatus
  createdBy?: string
  completedAt?: string
  createdAt: string
}

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  joinedAt: string
}
