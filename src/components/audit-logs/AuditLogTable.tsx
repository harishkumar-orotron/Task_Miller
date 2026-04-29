import { Eye } from 'lucide-react'
import { formatRelativeTime } from '../../lib/utils'
import Tooltip from '../ui/Tooltip'
import type { AuditLog } from '../../types/audit-log.types'

const actionStyle = (action: string): { label: string; cls: string } => {
  const verb = action.split('.')[1] ?? action
  const label = verb.replace(/_/g, ' ').replace(/^./, (s) => s.toUpperCase())
  const map: Record<string, string> = {
    created:          'bg-green-100 text-green-700',
    updated:          'bg-amber-100 text-amber-700',
    deleted:          'bg-red-100 text-red-700',
    status_updated:   'bg-blue-100 text-blue-700',
    admin_assigned:   'bg-violet-100 text-violet-700',
    developer_added:  'bg-teal-100 text-teal-700',
    member_removed:   'bg-rose-100 text-rose-700',
    member_added:     'bg-cyan-100 text-cyan-700',
  }
  return { label, cls: map[verb] ?? 'bg-gray-100 text-gray-600' }
}

const entityStyle: Record<string, string> = {
  task:         'bg-blue-100 text-blue-700',
  project:      'bg-violet-100 text-violet-700',
  user:         'bg-teal-100 text-teal-700',
  organization: 'bg-orange-100 text-orange-700',
}

interface Props {
  logs: AuditLog[]
  startEntry: number
  onView: (id: string) => void
}

export default function AuditLogTable({ logs, startEntry, onView }: Props) {
  if (logs.length === 0) {
    return <div className="py-16 text-center text-sm text-gray-400">No audit logs found</div>
  }

  return (
    <table className="w-full text-sm">
      <thead className="sticky top-0 z-10">
        <tr className="border-b border-gray-200 text-xs text-gray-600 font-semibold uppercase tracking-wide">
          <th className="px-5 py-3 text-left w-10 bg-[#ccfbf1]">S.no</th>
          <th className="px-5 py-3 text-left bg-[#ccfbf1]">Actor</th>
          <th className="px-5 py-3 text-left bg-[#ccfbf1]">Organization</th>
          <th className="px-5 py-3 text-left bg-[#ccfbf1]">Action</th>
          <th className="px-5 py-3 text-left bg-[#ccfbf1]">Entity</th>
          <th className="px-5 py-3 text-left bg-[#ccfbf1]">Description</th>
          <th className="px-5 py-3 text-left bg-[#ccfbf1]">Time</th>
          <th className="px-5 py-3 w-16 bg-[#ccfbf1]" />
        </tr>
      </thead>
      <tbody>
        {logs.map((log, idx) => {
          const { label, cls } = actionStyle(log.action)
          const entCls = entityStyle[log.entityType] ?? 'bg-gray-100 text-gray-600'

          return (
            <tr
              key={log.id}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="px-5 py-3 text-gray-400 text-xs">{startEntry + idx}</td>

              <td className="px-5 py-3">
                <p className="font-medium text-gray-800">{log.actor.name}</p>
                <p className="text-xs text-gray-400">{log.actor.email}</p>
              </td>

              <td className="px-5 py-3">
                <p className="font-medium text-gray-700 text-xs">{log.organization.name}</p>
                <p className="text-xs text-gray-400">{log.organization.slug}</p>
              </td>

              <td className="px-5 py-3">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${cls}`}>{label}</span>
                <p className="text-xs text-gray-400 mt-0.5">{log.action}</p>
              </td>

              <td className="px-5 py-3">
                <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${entCls}`}>
                  {log.entityType}
                </span>
                <p className="text-xs text-gray-400 mt-0.5">
                  {log.entityName ?? <span className="font-mono">{log.entityId.slice(0, 8)}…</span>}
                </p>
              </td>

              <td className="px-5 py-3 text-xs text-gray-500">{log.description ?? '—'}</td>

              <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                {formatRelativeTime(log.createdAt)}
              </td>

              <td className="px-5 py-3">
                <Tooltip label="View log">
                  <button
                    onClick={() => onView(log.id)}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                  >
                    <Eye size={13} />
                  </button>
                </Tooltip>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
