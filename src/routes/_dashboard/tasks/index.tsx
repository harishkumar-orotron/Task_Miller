import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Plus, Search, ChevronDown,
  CheckCircle2, ListTodo, Timer, AlertCircle, PauseCircle,
} from 'lucide-react'
import { type SortingState } from '@tanstack/react-table'
import { useTasks, useDeleteTaskMutation } from '../../../queries/tasks.queries'
import { useProjects } from '../../../queries/projects.queries'
import { useAuth } from '../../../hooks/useAuth'
import { useOrgContext } from '../../../store/orgContext.store'
import { useDebounce } from '../../../hooks/useDebounce'
import StatsCard from '../../../components/ui/StatsCard'
import Pagination from '../../../components/ui/Pagination'
import TaskTable from '../../../components/tasks/TaskTable'
import TaskForm from '../../../components/tasks/TaskForm'
import ConfirmDeleteModal from '../../../components/common/ConfirmDeleteModal'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import ErrorMessage from '../../../components/common/ErrorMessage'
import type { Task, TaskStatus } from '../../../types/task.types'
import type { ApiError } from '../../../types/api.types'

export const Route = createFileRoute('/_dashboard/tasks/')({
  component: TasksPage,
})

function TasksPage() {
  const navigate= useNavigate()
  const { isAdmin, isSuperAdmin, isDeveloper, user } = useAuth()
  const { selectedOrg }                     = useOrgContext()

  const orgId          = isSuperAdmin && selectedOrg ? selectedOrg.id : undefined
  const assignedUserId = isDeveloper ? (user?.id ?? undefined) : undefined

  const [search,     setSearch]     = useState('')
  const [status,     setStatus]     = useState<TaskStatus | ''>('')
  const [projectId,  setProjectId]  = useState('')
  const [page,       setPage]       = useState(1)
  const [limit,      setLimit]      = useState(10)
  const [sorting,    setSorting]    = useState<SortingState>([])
  const [showCreate, setShowCreate] = useState(false)
  const [editTask,   setEditTask]   = useState<Task | null>(null)
  const [deleteTask, setDeleteTask] = useState<Task | null>(null)

  useEffect(() => { setPage(1) }, [selectedOrg?.id])

  useEffect(() => {
    const handler = () => setShowCreate(true)
    window.addEventListener('topbar-action', handler)
    return () => window.removeEventListener('topbar-action', handler)
  }, [])

  const debouncedSearch = useDebounce(search, 400)

  const sortBy    = sorting[0]?.id
  const sortOrder = sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined

  const { data, isLoading, isFetching, isError, error } = useTasks({
    search:    debouncedSearch || undefined,
    status:    status    || undefined,
    projectId: projectId || undefined,
    orgId,
    assignedUserId,
    sortBy,
    sortOrder,
    page,
    limit,
  })


  const { data: projectsData } = useProjects({ limit: 100, orgId })

  const { mutate: deleteTaskMutation, isPending: isDeleting } = useDeleteTaskMutation()

  const tasks      = data?.tasks      ?? []
  const pagination = data?.pagination
  const projects   = projectsData?.projects ?? []

  const totalRecords   = pagination?.totalRecords ?? 0
  const totalPages     = pagination?.totalPages   ?? 1
  const activePage     = pagination?.currentPage  ?? page
  const activeLimit    = pagination?.limit        ?? limit
  const startEntry     = totalRecords === 0 ? 0 : (activePage - 1) * activeLimit + 1
  const endEntry       = Math.min(activePage * activeLimit, totalRecords)

  const taskStats = data?.stats

  const stats = [
    { label: 'Total Tasks',  value: taskStats?.total      ?? 0, iconBg: 'bg-purple-100', icon: <ListTodo     size={18} className="text-purple-500" /> },
    { label: 'To Do',        value: taskStats?.todo        ?? 0, iconBg: 'bg-blue-100',   icon: <ListTodo     size={18} className="text-blue-500"   /> },
    { label: 'In Progress',  value: taskStats?.inProgress  ?? 0, iconBg: 'bg-orange-100', icon: <Timer        size={18} className="text-orange-500" /> },
    { label: 'On Hold',      value: taskStats?.onHold      ?? 0, iconBg: 'bg-yellow-100', icon: <PauseCircle  size={18} className="text-yellow-500" /> },
    { label: 'Overdue',      value: taskStats?.overdue     ?? 0, iconBg: 'bg-red-100',    icon: <AlertCircle  size={18} className="text-red-500"    /> },
    { label: 'Completed',    value: taskStats?.completed   ?? 0, iconBg: 'bg-green-100',  icon: <CheckCircle2 size={18} className="text-green-500"  /> },
  ]

  const handleDelete        = () => {
    if (!deleteTask) return
    deleteTaskMutation(deleteTask.id, { onSuccess: () => setDeleteTask(null) })
  }
  const handleSearch        = (val: string) => { setSearch(val);  setPage(1) }
  const handleStatusChange  = (val: string) => { setStatus(val as TaskStatus | ''); setPage(1) }
  const handleProjectChange = (val: string) => { setProjectId(val); setPage(1) }
  const handleLimit         = (val: number) => { setLimit(val);  setPage(1) }
  const handleSorting       = (updater: any) => {
    setSorting(updater)
    setPage(1)
  }

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {stats.map((s) => <StatsCard key={s.label} {...s} />)}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-100">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            Tasks List
            <span className="text-gray-400 font-normal ml-1.5">({totalRecords})</span>
          </h2>
          <div className="flex items-center gap-2 flex-wrap">

            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
              <Search size={14} className={isFetching ? 'text-orange-400 animate-pulse' : 'text-gray-400'} />
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by task"
                className="bg-transparent outline-none w-32 text-gray-700 placeholder-gray-400 text-xs"
              />
            </div>

            <div className="relative">
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="appearance-none border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-gray-500 bg-gray-50 outline-none cursor-pointer"
              >
                <option value="">Select Status</option>
                <option value="to_do">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={projectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="appearance-none border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-gray-500 bg-gray-50 outline-none cursor-pointer"
              >
                <option value="">Select Project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800"
              >
                <Plus size={13} /> Add Task
              </button>
            )}

          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-16 flex justify-center"><LoadingSpinner /></div>
        ) : isError ? (
          <div className="py-8 px-5">
            <ErrorMessage message={(error as ApiError)?.message ?? 'Failed to load tasks'} />
          </div>
        ) : (
          <TaskTable
            tasks={tasks}
            projects={projects}
            startEntry={startEntry}
            isAdmin={isAdmin}
            sorting={sorting}
            onSortingChange={handleSorting}
            onEdit={setEditTask}
            onDelete={setDeleteTask}
          />
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalRecords={totalRecords}
            startEntry={startEntry}
            endEntry={endEntry}
            limit={limit}
            hasPrevPage={pagination?.hasPrevPage}
            hasNextPage={pagination?.hasNextPage}
            onPageChange={setPage}
            onLimitChange={handleLimit}
          />
        )}
      </div>

      {showCreate  && <TaskForm onClose={() => setShowCreate(false)} />}
      {editTask    && <TaskForm task={editTask} onClose={() => setEditTask(null)} />}
      {deleteTask  && (
        <ConfirmDeleteModal
          title="Delete Task"
          description={`Are you sure you want to delete "${deleteTask.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTask(null)}
          isLoading={isDeleting}
        />
      )}

    </div>
  )
}
