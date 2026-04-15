export type UserRole   = 'superadmin' | 'admin' | 'developer'
export type UserStatus = 'active' | 'inactive'

// ─── Core user shape (list items) ────────────────────────────────────────────

export interface User {
  id:          string
  name:        string
  email:       string
  role:        UserRole
  status:      UserStatus
  phone:       string | null
  avatarUrl:   string | null
  lastLoginAt: string | null
  createdAt:   string
}

// ─── Full user (GET /me, GET /:id) ───────────────────────────────────────────

export interface UserDetail extends User {
  updatedAt: string
}

// ─── List response ────────────────────────────────────────────────────────────

export interface UsersPagination {
  currentPage:  number
  limit:        number
  totalRecords: number
  totalPages:   number
  hasNextPage:  boolean
  hasPrevPage:  boolean
}

export interface UsersResponse {
  users:      User[]
  pagination: UsersPagination
}

// ─── Request bodies ───────────────────────────────────────────────────────────

export interface UsersParams {
  search?: string
  status?: UserStatus
  page?:   number
  limit?:  number
}

export interface CreateUserBody {
  name:     string
  email:    string
  password: string
  role:     'admin' | 'developer'
}

export interface UpdateMeBody {
  name?:  string
  phone?: string
}
