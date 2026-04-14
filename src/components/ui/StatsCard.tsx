import type { ReactNode } from 'react'

interface StatsCardProps {
  label: string
  value: number | string
  iconBg: string
  icon: ReactNode
}

export default function StatsCard({ label, value, iconBg, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3 min-w-[130px]">
      <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}
