interface Avatar {
  id: string
  name: string
  color: string
}

interface AvatarStackProps {
  avatars: Avatar[]
  max?: number
  size?: 'sm' | 'md'
}

export default function AvatarStack({ avatars, max = 3, size = 'sm' }: AvatarStackProps) {
  const visible  = avatars.slice(0, max)
  const overflow = avatars.length - max
  const dim      = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'

  return (
    <div className="flex -space-x-2">
      {visible.map((a) => (
        <div
          key={a.id}
          title={a.name}
          className={`${dim} ${a.color} rounded-full border-2 border-white flex items-center justify-center font-medium text-white flex-shrink-0`}
        >
          {a.name.charAt(0).toUpperCase()}
        </div>
      ))}
      {overflow > 0 && (
        <div className={`${dim} bg-orange-100 text-orange-600 rounded-full border-2 border-white flex items-center justify-center font-semibold flex-shrink-0`}>
          +{overflow}
        </div>
      )}
    </div>
  )
}
