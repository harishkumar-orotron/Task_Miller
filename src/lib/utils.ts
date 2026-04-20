// utils.ts — pure generic helper functions (no business logic, no API calls)

// ─── Date formatting ──────────────────────────────────────────────────────────

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

// ─── Avatar helpers ───────────────────────────────────────────────────────────

export const avatarColors = [
  'bg-blue-400', 'bg-violet-400', 'bg-pink-400',
  'bg-teal-400', 'bg-orange-400', 'bg-rose-400',
]

export function userColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

export function toAvatarShape(users: { id: string; name: string; email?: string }[]) {
  return users.map((u) => ({ id: u.id, name: u.name, email: u.email ?? '', color: userColor(u.id) }))
}

// ─── Badge / color maps ───────────────────────────────────────────────────────

export const roleBadgeClasses: Record<string, string> = {
  superadmin: 'bg-purple-100 text-purple-700',
  admin:      'bg-blue-100 text-blue-700',
  developer:  'bg-green-100 text-green-700',
}

export const roleAvatarColor: Record<string, string> = {
  superadmin: 'bg-purple-500',
  admin:      'bg-blue-500',
  developer:  'bg-teal-500',
}

export const projectStatusBadge: Record<string, string> = {
  active:    'bg-green-50 text-green-600 border border-green-100',
  on_hold:   'bg-yellow-50 text-yellow-600 border border-yellow-100',
  completed: 'bg-blue-50 text-blue-600 border border-blue-100',
}

// ─── String helpers ───────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str: string, max = 60): string {
  return str.length > max ? `${str.slice(0, max)}…` : str
}

export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
