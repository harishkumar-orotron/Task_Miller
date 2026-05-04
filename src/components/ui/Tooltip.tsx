import { type ReactNode, useState, useRef } from 'react'

export default function Tooltip({
  label,
  children,
  wrap = false,
}: {
  label: string
  children: ReactNode
  wrap?: boolean
}) {
  const [visible, setVisible] = useState(false)
  const [above,   setAbove]   = useState(true)
  const [pos,     setPos]     = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const onEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const showAbove = rect.top > window.innerHeight / 2
      setAbove(showAbove)
      setPos({
        top:  showAbove ? rect.top : rect.bottom,
        left: rect.left + rect.width / 2,
      })
    }
    setVisible(true)
  }

  return (
    <div ref={ref} onMouseEnter={onEnter} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <span
          style={
            above
              ? { position: 'fixed', left: pos.left, top: pos.top, transform: 'translateX(-50%) translateY(calc(-100% - 6px))' }
              : { position: 'fixed', left: pos.left, top: pos.top + 6, transform: 'translateX(-50%)' }
          }
          className={`pointer-events-none z-[9999] rounded bg-gray-900 px-2 py-1.5 text-xs text-white ${wrap ? 'w-64 whitespace-normal leading-relaxed' : 'whitespace-nowrap'}`}
        >
          {label}
        </span>
      )}
    </div>
  )
}
