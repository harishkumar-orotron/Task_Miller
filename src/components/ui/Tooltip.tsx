import type { ReactNode } from 'react'

export default function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative group/tip">
      {children}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover/tip:opacity-100 transition-opacity duration-100 z-50">
        {label}
      </span>
    </div>
  )
}
