import React, { useState } from 'react'
import { X, ChevronDown, Check } from 'lucide-react'
import { useCreateProjectMutation, useUpdateProjectMutation } from '../../queries/projects.queries'
import { useOrgs, useOrg } from '../../queries/orgs.queries'
import { useAuth } from '../../hooks/useAuth'
import type { Project, ProjectStatus } from '../../types/project.types'
import type { ApiError } from '../../types/api.types'

interface ProjectFormProps {
  onClose:  () => void
  project?: Project        // pass to enter edit mode
}

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'active',    label: 'Active'    },
  { value: 'on_hold',   label: 'On Hold'   },
  { value: 'completed', label: 'Completed' },
]

const avatarColors = [
  'bg-blue-400', 'bg-violet-400', 'bg-pink-400',
  'bg-teal-400', 'bg-orange-400', 'bg-rose-400',
]

export default function ProjectForm({ onClose, project }: ProjectFormProps) {
  const isEdit        = !!project
  const { isSuperAdmin, orgId: adminOrgId } = useAuth()

  const [title,           setTitle]           = useState(project?.title       ?? '')
  const [description,     setDescription]     = useState(project?.description ?? '')
  const [status,          setStatus]          = useState<ProjectStatus>(project?.status ?? 'active')
  const [orgId,           setOrgId]           = useState(project?.orgId ?? (!isSuperAdmin ? (adminOrgId ?? '') : ''))
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    project?.members.map((m) => m.id) ?? [],
  )
  const [orgOpen,    setOrgOpen]    = useState(false)
  const [memberOpen, setMemberOpen] = useState(false)

  const { data: orgsData } = useOrgs({ limit: 100 }, { enabled: isSuperAdmin })
  const { data: orgDetail } = useOrg(orgId)

  const { mutate: createProject, isPending: isCreating, error: createError } = useCreateProjectMutation()
  const { mutate: updateProject, isPending: isUpdating, error: updateError } = useUpdateProjectMutation()

  const isPending = isCreating || isUpdating
  const error     = (createError ?? updateError) as ApiError | null

  const errorMessage = error?.message ?? null
  const fieldErrors  = error?.errors?.reduce<Record<string, string>>(
    (acc, e) => ({ ...acc, [e.field]: e.message }),
    {},
  ) ?? {}

  const orgs    = orgsData?.organizations ?? []
  const members = orgDetail?.members ?? []

  const selectedOrg = orgs.find((o) => o.id === orgId)

  const toggleMember = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    )
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isEdit) {
      updateProject(
        { id: project.id, body: { title, description: description || undefined, status } },
        { onSuccess: onClose },
      )
    } else {
      createProject(
        {
          title,
          description:     description || undefined,
          orgId,
          assignedUserIds: selectedUserIds.length > 0 ? selectedUserIds : undefined,
        },
        { onSuccess: onClose },
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">
            {isEdit ? 'Edit Project' : 'Create Project'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {errorMessage && Object.keys(fieldErrors).length === 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2.5 rounded-lg mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Customer Portal"
              required
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors ${fieldErrors.title ? 'border-red-400' : 'border-gray-200'}`}
            />
            {fieldErrors.title && <p className="text-xs text-red-500 mt-1">{fieldErrors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project"
              rows={3}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors resize-none ${fieldErrors.description ? 'border-red-400' : 'border-gray-200'}`}
            />
            {fieldErrors.description && <p className="text-xs text-red-500 mt-1">{fieldErrors.description}</p>}
          </div>

          {/* Org — create mode, superadmin only */}
          {!isEdit && isSuperAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOrgOpen((v) => !v)}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between outline-none focus:border-orange-400 transition-colors ${fieldErrors.orgId ? 'border-red-400' : 'border-gray-200'}`}
                >
                  <span className={selectedOrg ? 'text-gray-800' : 'text-gray-400'}>
                    {selectedOrg ? selectedOrg.name : 'Select an organization'}
                  </span>
                  <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />
                </button>

                {orgOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {orgs.length === 0 ? (
                      <p className="text-sm text-gray-400 px-3 py-3">No organizations found</p>
                    ) : (
                      orgs.map((org) => (
                        <button
                          key={org.id}
                          type="button"
                          onClick={() => {
                            setOrgId(org.id)
                            setSelectedUserIds([])
                            setOrgOpen(false)
                          }}
                          className="w-full text-left px-3 py-2.5 text-sm hover:bg-orange-50 flex items-center justify-between transition-colors"
                        >
                          <span className="text-gray-700">{org.name}</span>
                          {orgId === org.id && <Check size={13} className="text-orange-500" />}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {fieldErrors.orgId && <p className="text-xs text-red-500 mt-1">{fieldErrors.orgId}</p>}
            </div>
          )}

          {/* Members — create mode only, shown after org is selected */}
          {!isEdit && orgId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Members{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
                {selectedUserIds.length > 0 && (
                  <span className="ml-1.5 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
                    {selectedUserIds.length}
                  </span>
                )}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMemberOpen((v) => !v)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between outline-none focus:border-orange-400 transition-colors"
                >
                  <span className="text-gray-400">
                    {selectedUserIds.length === 0
                      ? 'Select members'
                      : `${selectedUserIds.length} member${selectedUserIds.length > 1 ? 's' : ''} selected`}
                  </span>
                  <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />
                </button>

                {memberOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-52 overflow-y-auto">
                    {members.length === 0 ? (
                      <p className="text-sm text-gray-400 px-3 py-3">No members in this org</p>
                    ) : (
                      members.map((m, i) => (
                        <button
                          key={m.userId}
                          type="button"
                          onClick={() => toggleMember(m.userId)}
                          className="w-full text-left px-3 py-2.5 hover:bg-orange-50 flex items-center gap-2.5 transition-colors"
                        >
                          <div className={`w-7 h-7 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-xs font-semibold">{m.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{m.name}</p>
                            <p className="text-xs text-gray-400 truncate">{m.email}</p>
                          </div>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selectedUserIds.includes(m.userId) ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
                            {selectedUserIds.includes(m.userId) && <Check size={10} className="text-white" />}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status — edit mode only */}
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      status === opt.value
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Project')}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
