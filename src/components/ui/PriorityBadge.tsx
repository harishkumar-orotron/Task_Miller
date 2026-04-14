type Priority = 'low' | 'medium' | 'high' | 'urgent'

const config: Record<Priority, { label: string; bg: string; text: string }> = {
  urgent: { label: 'Urgent', bg: 'bg-red-100',    text: 'text-red-600' },
  high:   { label: 'High',   bg: 'bg-orange-100', text: 'text-orange-600' },
  medium: { label: 'Medium', bg: 'bg-blue-100',   text: 'text-blue-600' },
  low:    { label: 'Low',    bg: 'bg-green-100',  text: 'text-green-600' },
}

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const c = config[priority]
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}
