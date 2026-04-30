import { useState, useRef } from 'react'
import { formatDateTime, formatDate } from '../../lib/utils'
import type { AuditLog } from '../../types/audit-log.types'

// ─── Helpers (mirrored from logId detail view) ────────────────────────────────

const SKIP = new Set(['id', 'orgId', 'createdBy', 'createdAt', 'updatedAt', 'deletedAt', 'completedAt', 'parentTaskId', 'projectId'])

const LABELS: Record<string, string> = {
  title: 'Title',
  name: 'Name',
  description: 'Description',
  status: 'Status',
  priority: 'Priority',
  dueDate: 'Due Date',
  logoUrl: 'Logo URL',
  email: 'Email',
  role: 'Role',
  avatarUrl: 'Avatar URL',
  slug: 'Slug',
  members: 'Members',
  creator: 'Creator',
  assignees: 'Assignees',
}

function displayLabel(key: string): string {
  return LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
}

function displayValue(val: unknown): string {
  if (val === null || val === undefined) return '—'
  if (Array.isArray(val)) {
    if (val.length === 0) return '(empty)'
    const first = val[0]
    if (typeof first === 'object' && first !== null && 'name' in first)
      return val.map((v: any) => v.name ?? v.email ?? v.id).join(', ')
    return String(val.length) + ' item(s)'
  }
  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>
    return (obj.name ?? obj.title ?? obj.email ?? obj.id ?? JSON.stringify(val)) as string
  }
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val))
    return formatDate(val)
  return String(val)
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const actionStyle = (action: string): { label: string; cls: string } => {
  const verb = action.split('.')[1] ?? action
  const label = verb.replace(/_/g, ' ').replace(/^./, (s) => s.toUpperCase())
  const map: Record<string, string> = {
    created: 'bg-green-100 text-green-700',
    updated: 'bg-amber-100 text-amber-700',
    deleted: 'bg-red-100 text-red-700',
    status_updated: 'bg-blue-100 text-blue-700',
    admin_assigned: 'bg-violet-100 text-violet-700',
    developer_added: 'bg-teal-100 text-teal-700',
    member_removed: 'bg-rose-100 text-rose-700',
    member_added: 'bg-cyan-100 text-cyan-700',
  }
  return { label, cls: map[verb] ?? 'bg-gray-100 text-gray-600' }
}

const entityStyle: Record<string, string> = {
  task: 'bg-blue-100 text-blue-700',
  project: 'bg-violet-100 text-violet-700',
  user: 'bg-teal-100 text-teal-700',
  organization: 'bg-orange-100 text-orange-700',
}

// ─── Hover popover content ────────────────────────────────────────────────────

function HoverChanges({ log }: { log: AuditLog }) {
  const { before, after } = log

  if (!before && !after) {
    return <p className="text-xs text-gray-400 text-center py-4">No snapshot data</p>
  }

  const allKeys = Array.from(
    new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])
  ).filter((k) => !SKIP.has(k))

  if (!before && after) {
    return (
      <div className="flex flex-col">
        <div className="px-3 py-2 bg-green-50 border-b border-green-100 shrink-0">
          <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wide">Created — New State</p>
        </div>
        <div className="max-h-[160px] overflow-y-auto">
          <table className="w-full text-xs">
            <tbody>
              {allKeys.map((key) => (
                <tr key={key} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-1.5 font-medium text-gray-400 w-28 align-top">{displayLabel(key)}</td>
                  <td className="px-3 py-1.5 text-gray-700 align-top">{displayValue(after[key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (before && !after) {
    return (
      <div className="flex flex-col">
        <div className="px-3 py-2 bg-red-50 border-b border-red-100 shrink-0">
          <p className="text-[10px] font-semibold text-red-700 uppercase tracking-wide">Deleted — Last Known State</p>
        </div>
        <div className="max-h-[160px] overflow-y-auto">
          <table className="w-full text-xs">
            <tbody>
              {allKeys.map((key) => (
                <tr key={key} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-1.5 font-medium text-gray-400 w-28 align-top">{displayLabel(key)}</td>
                  <td className="px-3 py-1.5 text-gray-700 align-top">{displayValue(before[key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (before && after) {
    const changed = allKeys.filter((k) => displayValue(before[k]) !== displayValue(after[k]))
    if (changed.length === 0) {
      return <p className="text-xs text-gray-400 text-center py-4">No field changes detected</p>
    }
    return (
      <div className="flex flex-col">
        <div className="px-3 py-2 bg-amber-50 border-b border-amber-100 shrink-0">
          <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">
            Changed Fields ({changed.length})
          </p>
        </div>
        <div className="max-h-[160px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-gray-100 text-gray-400 font-medium">
                <th className="px-3 py-1.5 text-left w-24">Field</th>
                <th className="px-3 py-1.5 text-left">Before</th>
                <th className="px-3 py-1.5 text-left">After</th>
              </tr>
            </thead>
            <tbody>
              {changed.map((key) => (
                <tr key={key} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-1.5 font-medium text-gray-500 align-top">{displayLabel(key)}</td>
                  <td className="px-3 py-1.5 text-gray-700 align-top">{displayValue(before[key])}</td>
                  <td className="px-3 py-1.5 text-gray-700 align-top">{displayValue(after[key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return null
}

// ─── Table ────────────────────────────────────────────────────────────────────

interface Props {
  logs: AuditLog[]
  startEntry: number
}

export default function AuditLogTable({ logs, startEntry }: Props) {
  const [hovered, setHovered] = useState<{ log: AuditLog; y: number } | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showPopover = (log: AuditLog, y: number) => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setHovered({ log, y })
  }

  const scheduleHide = () => {
    hideTimer.current = setTimeout(() => setHovered(null), 150)
  }

  if (logs.length === 0) {
    return <div className="py-16 text-center text-sm text-gray-400">No audit logs found</div>
  }

  return (
    <>
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="border-b border-gray-200 text-xs text-gray-600 font-semibold uppercase tracking-wide">
            <th className="px-5 py-3 text-left w-10 bg-[#ccfbf1]">S.no</th>
            <th className="px-5 py-3 text-left bg-[#ccfbf1]">Entity</th>
            <th className="px-5 py-3 text-left bg-[#ccfbf1]">Action</th>
            <th className="px-5 py-3 text-left bg-[#ccfbf1]">Description</th>
            <th className="px-5 py-3 text-left bg-[#ccfbf1]">Actor</th>
            <th className="px-5 py-3 text-left bg-[#ccfbf1]">Time Stamps</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => {
            const { label, cls } = actionStyle(log.action)
            const entCls = entityStyle[log.entityType] ?? 'bg-gray-100 text-gray-600'

            return (
              <tr
                key={log.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-default"
                onMouseEnter={(e) => showPopover(log, e.currentTarget.getBoundingClientRect().top)}
                onMouseLeave={scheduleHide}
              >
                <td className="px-5 py-3 text-gray-400 text-xs">{startEntry + idx}</td>

                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${entCls}`}>
                    {log.entityType}
                  </span>
                  <p className="text-xs text-gray-700 font-medium mt-0.5">
                    {log.entityName ?? <span className="font-mono text-gray-400">{log.entityId.slice(0, 8)}…</span>}
                  </p>
                </td>

                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${cls}`}>{label}</span>
                </td>

                <td className="px-5 py-3 text-xs text-gray-500 max-w-xs">{log.description ?? '—'}</td>

                <td className="px-5 py-3">
                  <p className="font-medium text-gray-800 text-xs">{log.actor.name}</p>
                  <p className="text-xs text-gray-400">{log.actor.email}</p>
                </td>

                <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">
                  {formatDateTime(log.createdAt)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Hover popover */}
      {hovered && (hovered.log.before || hovered.log.after) && (
        <div
          className="fixed z-50 w-80 bg-white rounded-xl border border-gray-200 shadow-lg overflow-y-auto max-h-72"
          style={{
            top: Math.min(hovered.y, window.innerHeight - 300),
            right: 24,
          }}
          onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current) }}
          onMouseLeave={scheduleHide}
        >
          <HoverChanges log={hovered.log} />
        </div>
      )}
    </>
  )
}
