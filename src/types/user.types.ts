export type UserRole = 'superadmin' | 'admin' | 'developer'
export type UserStatus = 'active' | 'inactive'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  role: UserRole
  status: UserStatus
  lastLoginAt?: string
  createdAt: string
}
