import { useMutation } from '@tanstack/react-query'
import { exportApi } from '../http/services/export.service'
import type { ExportParams } from '../http/services/export.service'

// ─── CSV helpers ──────────────────────────────────────────────────────────────

function escapeCell(val: any): string {
  if (val === null || val === undefined) return ''
  const str = String(val)
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"`
    : str
}

function toCSV(headers: string[], rows: string[][]): string {
  return [
    headers.map(escapeCell).join(','),
    ...rows.map(r => r.map(escapeCell).join(',')),
  ].join('\n')
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function formatMembers(members: { name: string; email: string }[]): string {
  return members.map(m => `${m.name} <${m.email}>`).join('; ')
}

// ─── Per-type converters ──────────────────────────────────────────────────────

function convertOrganizations(data: any): string {
  const headers = ['ID', 'Name', 'Description', 'Owner Name', 'Owner Email', 'Created At']
  const rows = (data.organizations ?? []).map((o: any) => [
    o.id,
    o.name,
    o.description,
    o.owner?.name,
    o.owner?.email,
    o.createdAt,
  ])
  return toCSV(headers, rows)
}

function convertProjects(data: any): string {
  const headers = ['ID', 'Title', 'Description', 'Status', 'Assigned Members', 'Created At']
  const rows = (data.projects ?? []).map((p: any) => [
    p.id,
    p.title,
    p.description,
    p.status,
    formatMembers(p.assignedMembers ?? []),
    p.createdAt,
  ])
  return toCSV(headers, rows)
}

function convertTasks(data: any): string {
  const headers = ['ID', 'Title', 'Project', 'Status', 'Priority', 'Due Date', 'Assigned Members']
  const rows = (data.tasks ?? []).map((t: any) => [
    t.id,
    t.title,
    t.projectTitle,
    t.status,
    t.priority,
    t.dueDate,
    formatMembers(t.assignedMembers ?? []),
  ])
  return toCSV(headers, rows)
}

function convertUsers(data: any): string {
  const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Phone', 'Created At']
  const rows = (data.users ?? []).map((u: any) => [
    u.id,
    u.name,
    u.email,
    u.role,
    u.status,
    u.phone,
    u.createdAt,
  ])
  return toCSV(headers, rows)
}

function toCSVString(type: string, data: any): string {
  switch (type) {
    case 'organizations': return convertOrganizations(data)
    case 'projects':      return convertProjects(data)
    case 'tasks':         return convertTasks(data)
    case 'users':         return convertUsers(data)
    default:              return ''
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useExportMutation() {
  return useMutation({
    mutationFn: (params: ExportParams) => exportApi(params),
    onSuccess: (data, params) => {
      const csv      = toCSVString(params.type, data)
      const date     = data.exportedAt ? new Date(data.exportedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
      const prefix   = params.filePrefix ? `${params.filePrefix}-` : ''
      downloadCSV(csv, `${prefix}${params.type}-export-${date}.csv`)
    },
  })
}
