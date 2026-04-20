import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft, ChevronDown, Pencil, Plus, X, AlignLeft,
} from 'lucide-react'
import { useTask, useUpdateTaskMutation } from '../../../queries/tasks.queries'
import { useProjects } from '../../../queries/projects.queries'
import { useAuth } from '../../../hooks/useAuth'
import StatusBadge from '../../../components/ui/StatusBadge'
import PriorityBadge from '../../../components/ui/PriorityBadge'
import AvatarStack from '../../../components/ui/AvatarStack'
import TaskForm from '../../../components/tasks/TaskForm'
import CommentsSection from '../../../components/tasks/CommentsSection'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import ErrorMessage from '../../../components/common/ErrorMessage'
import { userColor, toAvatarShape, formatDate } from '../../../lib/utils'
import type { TaskStatus, Subtask } from '../../../types/task.types'
import type { ApiError } from '../../../types/api.types'

export const Route = createFileRoute('/_dashboard/tasks/$taskId')({
  component: TaskViewPage,
})

type Tab = 'subtasks' | 'assignTo' | 'attachments'

const allStatusOptions: TaskStatus[] = ['to_do', 'in_progress', 'on_hold', 'completed']

function statusLabel(s: TaskStatus) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const statusSelectClass: Record<TaskStatus, string> = {
  to_do:       'border-gray-300   text-gray-600   bg-gray-50',
  in_progress: 'border-blue-300   text-blue-600   bg-blue-50',
  on_hold:     'border-yellow-300 text-yellow-600 bg-yellow-50',
  overdue:     'border-red-300    text-red-600    bg-red-50',
  completed:   'border-green-300  text-green-600  bg-green-50',
}

function allowedStatuses(current: TaskStatus): TaskStatus[] {
  return allStatusOptions.filter((s) => {
    if (current === 'in_progress' && s === 'to_do') return false
    if (current === 'on_hold' && s !== 'in_progress' && s !== 'on_hold') return false
    if (current === 'completed' && s === 'to_do') return false
    return true
  })
}

function SubtaskCard({
  subtask,
  onEdit,
  onStatusChange,
  isAdmin,
}: {
  subtask:        Subtask
  onEdit:         (s: Subtask) => void
  onStatusChange: (id: string, status: TaskStatus) => void
  isAdmin:        boolean
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 space-y-3 bg-white shadow-sm">

      {/* Row 1: Title + Priority */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-gray-800 leading-snug">{subtask.title}</p>
        <PriorityBadge priority={subtask.priority} />
      </div>

      {/* Row 2: Description */}
      {subtask.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{subtask.description}</p>
      )}

      {/* Row 3: Status + Avatars */}
      <div className="flex items-center justify-between">
        {subtask.status === 'completed' ? (
          <StatusBadge status={subtask.status} />
        ) : (
          <div className="relative">
            <select
              value={subtask.status}
              onChange={(e) => onStatusChange(subtask.id, e.target.value as TaskStatus)}
              className={`appearance-none border rounded-full pl-3 pr-6 py-1 text-xs font-medium outline-none cursor-pointer transition-colors ${statusSelectClass[subtask.status]}`}
            >
              {allowedStatuses(subtask.status).map((s) => (
                <option key={s} value={s}>{statusLabel(s)}</option>
              ))}
            </select>
            <ChevronDown size={11} className="absolute right-1.5 top-1.5 pointer-events-none opacity-60" />
          </div>
        )}
        <AvatarStack avatars={toAvatarShape(subtask.assignees)} max={4} size="sm" />
      </div>

      {/* Row 4: Due Date + actions */}
      <div className="flex items-center justify-between pt-0.5">
        <div>
          {subtask.dueDate ? (
            <>
              <p className="text-xs text-gray-400">Due Date</p>
              <p className="text-xs font-medium text-gray-700 mt-0.5">{formatDate(subtask.dueDate)}</p>
            </>
          ) : (
            <p className="text-xs text-gray-300">No due date</p>
          )}
        </div>
        {isAdmin && subtask.status !== 'completed' && (
          <button
            onClick={() => onEdit(subtask)}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit subtask"
          >
            <Pencil size={12} />
          </button>
        )}
      </div>

    </div>
  )
}

function TaskViewPage() {
  const { taskId } = Route.useParams()
  const navigate   = useNavigate()
  const { isAdmin, isDeveloper, user } = useAuth()

  const [activeTab,      setActiveTab]      = useState<Tab>('subtasks')
  const [showEditTask,   setShowEditTask]   = useState(false)
  const [showAddSubtask, setShowAddSubtask] = useState(false)
  const [editSubtask,    setEditSubtask]    = useState<Subtask | null>(null)
  const [statusError,    setStatusError]    = useState<string | null>(null)

  const { data: task, isLoading, isError, error } = useTask(taskId)
  const { data: projectsData } = useProjects({ limit: 100 })
  const { mutate: updateTask } = useUpdateTaskMutation()

  const projects        = projectsData?.projects ?? []
  const proj            = projects.find((p) => p.id === task?.projectId)
  const visibleSubtasks = task
    ? isDeveloper && user
      ? task.subtasks.filter((s) => s.assignees.some((a) => a.id === user.id))
      : task.subtasks
    : []

  const tabs: { key: Tab; label: string; count: number }[] = task
    ? [
        { key: 'subtasks',    label: 'Subtasks',    count: visibleSubtasks.length },
        { key: 'assignTo',    label: 'Assign To',   count: task.assignees.length },
        { key: 'attachments', label: 'Attachments', count: 0 },
      ]
    : []

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatusError(null)
    updateTask(
      { id: taskId, body: { status: newStatus } },
      { onError: (err) => setStatusError((err as ApiError).message ?? 'Failed to update status') },
    )
  }

  const handleSubtaskStatusChange = (subtaskId: string, newStatus: TaskStatus) => {
    updateTask({ id: subtaskId, body: { status: newStatus } })
  }

  if (isLoading) return (
    <div className="py-20 flex justify-center"><LoadingSpinner /></div>
  )

  if (isError || !task) return (
    <div className="py-8">
      <button onClick={() => navigate({ to: '/tasks' })} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={15} /> Back to Tasks
      </button>
      <ErrorMessage message={(error as ApiError)?.message ?? 'Task not found'} />
    </div>
  )

  return (
    <div className="space-y-4">

      {/* Back */}
      <button
        onClick={() => navigate({ to: '/tasks' })}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={15} /> Back to Tasks
      </button>

      <div className="flex gap-5 items-stretch">

        {/* Left panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 p-5 space-y-5">

          {/* Title + Status + Edit */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
              <div className="flex items-center gap-2 flex-shrink-0">
                {task.status === 'completed' ? (
                  <StatusBadge status={task.status} />
                ) : (
                  <>
                    <div className="relative">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                        className={`appearance-none border rounded-lg pl-3 pr-8 py-1.5 text-sm font-medium outline-none cursor-pointer ${statusSelectClass[task.status]}`}
                      >
                        {allowedStatuses(task.status).map((s) => (
                          <option key={s} value={s}>{statusLabel(s)}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-2 top-2.5 text-blue-500 pointer-events-none" />
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => setShowEditTask(true)}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit task"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Status update error */}
            {statusError && (
              <div className="flex items-center justify-between gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
                <span>{statusError}</span>
                <button
                  onClick={() => setStatusError(null)}
                  className="text-red-400 hover:text-red-600 flex-shrink-0 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Project row */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Project</p>
              <p className="text-sm font-semibold text-gray-800">{proj?.title ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Priority</p>
              <PriorityBadge priority={task.priority} />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Assignees</p>
              <AvatarStack avatars={toAvatarShape(task.assignees)} max={4} size="sm" />
            </div>
          </div>

          {/* Description + Created By / Due Date — 2-col like design */}
          <div className="flex gap-6">
            {/* Left: Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-2">
                <AlignLeft size={14} className="text-gray-400 flex-shrink-0" />
                <p className="text-sm font-semibold text-gray-700">Description</p>
              </div>
              {task.description ? (
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{task.description}</p>
              ) : (
                <p className="text-sm text-gray-300 italic">No description</p>
              )}
            </div>

            {/* Right: Created By + Due Date */}
            <div className="flex-shrink-0 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${userColor(task.creator.id)}`}>
                  <span className="text-white text-xs font-semibold">{task.creator.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Created By</p>
                  <p className="text-sm font-semibold text-gray-800">{task.creator.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(task.createdAt).toLocaleString('en-GB', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Due Date</p>
                {task.dueDate ? (
                  <p className="text-sm font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg">
                    {formatDate(task.dueDate)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">—</p>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-b border-gray-100 gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Subtasks tab */}
            {activeTab === 'subtasks' && (
              <div className="mt-4 space-y-3">
                {isAdmin && task.status !== 'completed' && (
                  <button
                    onClick={() => setShowAddSubtask(true)}
                    className="flex items-center gap-1.5 text-xs font-medium text-orange-500 hover:text-orange-600 border border-orange-200 bg-orange-50 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    <Plus size={13} /> Add Subtask
                  </button>
                )}
                {visibleSubtasks.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">No subtasks yet</p>
                ) : (
                  visibleSubtasks.map((s) => (
                    <SubtaskCard
                      key={s.id}
                      subtask={s}
                      onEdit={(sub) => setEditSubtask(sub)}
                      onStatusChange={handleSubtaskStatusChange}
                      isAdmin={isAdmin}
                    />
                  ))
                )}
              </div>
            )}

            {/* Assign To tab */}
            {activeTab === 'assignTo' && (
              <table className="w-full text-sm mt-3">
                <thead>
                  <tr className="table-header text-xs text-gray-600 font-semibold">
                    <th className="px-4 py-2.5 text-left">S No</th>
                    <th className="px-4 py-2.5 text-left">Name</th>
                    <th className="px-4 py-2.5 text-left">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {task.assignees.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-400">
                        No assignees
                      </td>
                    </tr>
                  ) : (
                    task.assignees.map((a, i) => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-gray-500">{String(i + 1).padStart(2, '0')}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${userColor(a.id)} flex items-center justify-center`}>
                              <span className="text-white text-xs font-semibold">{a.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="font-medium text-gray-700">{a.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-gray-400">{a.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Attachments tab */}
            {activeTab === 'attachments' && (
              <p className="text-sm text-gray-400 py-8 text-center">No attachments yet</p>
            )}
          </div>
        </div>

        {/* Right panel — Comments only */}
        <div className="w-96 flex-shrink-0">
          <CommentsSection taskId={taskId} userId={user?.id ?? ''} userName={user?.name ?? ''} />
        </div>

      </div>

      {/* Edit task modal */}
      {showEditTask && (
        <TaskForm task={task} onClose={() => setShowEditTask(false)} />
      )}

      {/* Add subtask modal */}
      {showAddSubtask && (
        <TaskForm
          parentTaskId={task.id}
          projectId={task.projectId}
          onClose={() => setShowAddSubtask(false)}
        />
      )}

      {/* Edit subtask modal */}
      {editSubtask && (
        <TaskForm
          task={{
            ...editSubtask,
            parentTaskId: editSubtask.parentTaskId,
            creator: task.creator,
            deletedAt: null,
          }}
          onClose={() => setEditSubtask(null)}
        />
      )}

    </div>
  )
}
