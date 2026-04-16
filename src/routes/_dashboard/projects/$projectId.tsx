import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useProject, useDeleteProjectMutation } from '../../../queries/projects.queries'
import { useAuth } from '../../../hooks/useAuth'
import ProjectForm from '../../../components/projects/ProjectForm'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import ErrorMessage from '../../../components/common/ErrorMessage'
import { formatDate } from '../../../lib/utils'
import type { ApiError } from '../../../types/api.types'

export const Route = createFileRoute('/_dashboard/projects/$projectId')({
  component: ProjectViewPage,
})

const avatarColors = [
  'bg-blue-400', 'bg-violet-400', 'bg-pink-400',
  'bg-teal-400', 'bg-orange-400', 'bg-rose-400',
]

const cardColors = [
  'bg-teal-500',   'bg-gray-800',  'bg-blue-500',
  'bg-violet-500', 'bg-cyan-600',  'bg-indigo-500',
  'bg-pink-500',   'bg-orange-500','bg-green-600',
]

const statusBadge: Record<string, string> = {
  active:    'bg-green-50 text-green-600 border border-green-100',
  on_hold:   'bg-yellow-50 text-yellow-600 border border-yellow-100',
  completed: 'bg-blue-50 text-blue-600 border border-blue-100',
}

const statusLabel: Record<string, string> = {
  active:    'Active',
  on_hold:   'On Hold',
  completed: 'Completed',
}

function ProjectViewPage() {
  const { projectId } = Route.useParams()
  const navigate      = useNavigate()
  const { isAdmin }   = useAuth()

  const { data: project, isLoading, error } = useProject(projectId)
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProjectMutation()

  const [showEdit,      setShowEdit]      = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = () => {
    deleteProject(projectId, {
      onSuccess: () => navigate({ to: '/projects' }),
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate({ to: '/projects' })} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={15} /> Back to Projects
        </button>
        <ErrorMessage message={(error as ApiError)?.message ?? 'Project not found'} />
      </div>
    )
  }

  const initials = project.title.slice(0, 2).toUpperCase()
  const bgColor  = cardColors[project.title.charCodeAt(0) % cardColors.length]

  return (
    <div className="space-y-4">

      {/* Back */}
      <button
        onClick={() => navigate({ to: '/projects' })}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={15} /> Back to Projects
      </button>

      <div className="flex gap-5 items-start">

        {/* Left panel */}
        <div className="flex-1 space-y-4">

          {/* Header card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-lg">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg font-bold text-gray-800 leading-tight">{project.title}</h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusBadge[project.status] ?? 'bg-gray-50 text-gray-500'}`}>
                    {statusLabel[project.status] ?? project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {project.description ?? <span className="text-gray-300 italic">No description provided</span>}
                </p>
              </div>

              {/* Actions — admin+ only */}
              {isAdmin && <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setShowEdit(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Pencil size={13} /> Edit
                </button>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-2.5 py-1.5 text-xs border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-2.5 py-1.5 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
                    >
                      {isDeleting ? 'Deleting...' : 'Confirm'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>}
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-gray-100">
              <div className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-xs text-gray-400 mb-1">Created By</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">{project.creator.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 truncate">{project.creator.name}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-xs text-gray-400 mb-1">Created At</p>
                <p className="text-sm font-medium text-gray-700">{formatDate(project.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Members card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4">
              Members
              <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {project.members.length}
              </span>
            </h3>

            {project.members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <p className="text-sm">No members assigned</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 font-semibold border-b border-gray-100">
                      <th className="px-4 py-3 text-left w-10">#</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {project.members.map((m, i) => (
                      <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 text-xs">{String(i + 1).padStart(2, '0')}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0`}>
                              <span className="text-white text-xs font-semibold">{m.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="font-medium text-gray-700">{m.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{m.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right panel */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Details</p>
            <div className="space-y-3">

              <div>
                <p className="text-xs text-gray-400">Status</p>
                <span className={`inline-block mt-0.5 text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[project.status] ?? 'bg-gray-50 text-gray-500'}`}>
                  {statusLabel[project.status] ?? project.status}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-400">Org ID</p>
                <p className="text-xs font-medium text-gray-600 truncate mt-0.5">{project.orgId}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Created</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">{formatDate(project.createdAt)}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Updated</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">{formatDate(project.updatedAt)}</p>
              </div>

              {project.completedAt && (
                <div>
                  <p className="text-xs text-gray-400">Completed</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{formatDate(project.completedAt)}</p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {showEdit && (
        <ProjectForm
          project={project}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}
