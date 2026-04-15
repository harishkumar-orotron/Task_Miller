import { useState, useRef, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Building2, Calendar, Hash, Users, ShieldCheck, Code2, FileText } from 'lucide-react'
import { useOrg, useOrgs } from '../../../queries/orgs.queries'
import MemberList from '../../../components/organizations/MemberList'
import AvatarStack from '../../../components/ui/AvatarStack'
import type { OrgMember } from '../../../types/org.types'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import ErrorMessage from '../../../components/common/ErrorMessage'
import { formatDate } from '../../../lib/utils'
import type { ApiError } from '../../../types/api.types'

const avatarColors = [
  'bg-blue-400', 'bg-violet-400', 'bg-pink-400',
  'bg-teal-400', 'bg-orange-400', 'bg-rose-400',
]

export const Route = createFileRoute('/_dashboard/organizations/$orgId')({
  component: OrgDetailPage,
})

function OrgDetailPage() {
  const { orgId: slug } = Route.useParams()
  const navigate        = useNavigate()

  const { data: orgsData, isLoading: isLoadingOrgs } = useOrgs()
  const orgsList   = orgsData?.organizations ?? []
  const resolvedId = orgsList.find((o) => o.slug === slug)?.id ?? ''

  const { data: org, isLoading: isLoadingOrg, error } = useOrg(resolvedId)

  const isLoading = isLoadingOrgs || isLoadingOrg

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !org) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate({ to: '/organizations' })} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={15} /> Back to Organizations
        </button>
        <ErrorMessage message={(error as ApiError)?.message ?? 'Organization not found'} />
      </div>
    )
  }

  const adminCount     = org.members.filter((m) => m.role === 'admin').length
  const developerCount = org.members.filter((m) => m.role === 'developer').length

  return (
    <div className="space-y-4">

      {/* Back */}
      <button
        onClick={() => navigate({ to: '/organizations' })}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={15} /> Back to Organizations
      </button>

      <div className="flex gap-5 items-start">

        {/* Left panel */}
        <div className="flex-1 space-y-4">

          {/* Header card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-pink-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-2xl">{org.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-800 leading-tight">{org.name}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <Hash size={11} className="text-gray-400" />
                  <span className="text-xs text-gray-400">{org.slug}</span>
                </div>
                <p className="text-sm mt-1.5 leading-relaxed">
                  {org.description
                    ? <span className="text-gray-500">{org.description}</span>
                    : <span className="text-gray-300 italic">No description provided</span>
                  }
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users size={15} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-lg font-bold text-gray-800 leading-none">{org.members.length}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={15} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Admins</p>
                  <p className="text-lg font-bold text-gray-800 leading-none">{adminCount}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Code2 size={15} className="text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Developers</p>
                  <p className="text-lg font-bold text-gray-800 leading-none">{developerCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Members card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4">
              Members
              <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {org.members.length}
              </span>
            </h3>
            <MemberList members={org.members} />
          </div>

        </div>

        {/* Right panel */}
        <div className="w-52 flex-shrink-0 space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Details</p>
            <div className="space-y-3">

              <div className="flex items-start gap-2.5">
                <Building2 size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="text-sm font-medium text-gray-700 truncate">{org.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Hash size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Slug</p>
                  <p className="text-sm font-medium text-gray-700 truncate">{org.slug}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <FileText size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Description</p>
                  {org.description
                    ? <p className="text-sm font-medium text-gray-700 break-words">{org.description}</p>
                    : <p className="text-xs text-gray-300 italic">No description</p>
                  }
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Created</p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(org.createdAt)}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Member avatars */}
          {org.members.length > 0 && (
            <MembersPopoverCard members={org.members} />
          )}

        </div>

      </div>
    </div>
  )
}

// ─── Members popover card ─────────────────────────────────────────────────────

function MembersPopoverCard({ members }: { members: OrgMember[] }) {
  const [open, setOpen] = useState(false)
  const ref             = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Members</p>
        <button type="button" onClick={() => setOpen((v) => !v)} className="focus:outline-none">
          <AvatarStack
            avatars={members.map((m, i) => ({
              id:    m.memberId,
              name:  m.name,
              color: avatarColors[i % avatarColors.length],
            }))}
            max={5}
            size="sm"
          />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500">{members.length} Members</p>
          </div>
          <ul className="max-h-60 overflow-y-auto divide-y divide-gray-50">
            {members.map((m, i) => (
              <li key={m.memberId} className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors">
                <div className={`w-7 h-7 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-semibold">{m.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{m.name}</p>
                  <p className="text-xs text-gray-400 truncate">{m.role} · {m.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
