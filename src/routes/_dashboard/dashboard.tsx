import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Eye, Pencil, Calendar, ChevronDown, Search, FolderKanban, CheckCircle2, Clock, AlertCircle, TrendingUp, ListTodo, Timer } from 'lucide-react'
import { mockTasks } from '../../mocks/data/tasks'
import StatsCard from '../../components/ui/StatsCard'
import StatusBadge from '../../components/ui/StatusBadge'
import PriorityBadge from '../../components/ui/PriorityBadge'
import AvatarStack from '../../components/ui/AvatarStack'

export const Route = createFileRoute('/_dashboard/dashboard')({
  component: DashboardPage,
})

const stats = [
  { label: 'Projects',        value: 100, iconBg: 'bg-pink-100',   icon: <FolderKanban size={18} className="text-pink-500" /> },
  { label: 'Tasks',           value: 100, iconBg: 'bg-orange-100', icon: <ListTodo     size={18} className="text-orange-500" /> },
  { label: 'Completed',       value: 300, iconBg: 'bg-green-100',  icon: <CheckCircle2 size={18} className="text-green-500" /> },
  { label: 'On-Time',         value: 300, iconBg: 'bg-blue-100',   icon: <Clock        size={18} className="text-blue-500" /> },
  { label: 'Off-Time',        value: 300, iconBg: 'bg-gray-100',   icon: <Timer        size={18} className="text-gray-500" /> },
  { label: 'Pending',         value: 100, iconBg: 'bg-yellow-100', icon: <AlertCircle  size={18} className="text-yellow-500" /> },
  { label: 'Overdue',         value: 100, iconBg: 'bg-red-100',    icon: <AlertCircle  size={18} className="text-red-500" /> },
  { label: 'Completion Rate', value: 100, iconBg: 'bg-purple-100', icon: <TrendingUp   size={18} className="text-purple-500" /> },
]

function DashboardPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')

  const filtered = mockTasks.filter((t) => {
    const matchSearch  = t.title.toLowerCase().includes(search.toLowerCase()) || t.projectName.toLowerCase().includes(search.toLowerCase())
    const matchStatus  = !statusFilter  || t.status === statusFilter
    const matchProject = !projectFilter || t.projectName === projectFilter
    return matchSearch && matchStatus && matchProject
  })

  const projects = [...new Set(mockTasks.map((t) => t.projectName))]

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {stats.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl border border-gray-100">

        {/* Section header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Tasks List</h2>
          <div className="flex items-center gap-2">

            {/* Search */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-500 bg-gray-50">
              <Search size={14} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by task"
                className="bg-transparent outline-none w-32 text-gray-700 placeholder-gray-400 text-xs"
              />
            </div>

            {/* Date */}
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 bg-gray-50 hover:bg-gray-100">
              <span>Select date</span>
              <Calendar size={13} />
            </button>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 outline-none cursor-pointer"
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

            {/* Project filter */}
            <div className="relative">
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="appearance-none border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 outline-none cursor-pointer"
              >
                <option value="">Select Project</option>
                {projects.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header text-xs text-gray-600 font-semibold">
                <th className="px-5 py-3 text-left">S No ↕</th>
                <th className="px-5 py-3 text-left">Project ↕</th>
                <th className="px-5 py-3 text-left">Task Name ↕</th>
                <th className="px-5 py-3 text-left">Assigned User ↕</th>
                <th className="px-5 py-3 text-left">Due Date ↕</th>
                <th className="px-5 py-3 text-left">Status ↕</th>
                <th className="px-5 py-3 text-left">Priority ↕</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((task, i) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-500">{String(i + 1).padStart(2, '0')}</td>
                  <td className="px-5 py-3 font-medium text-gray-700">{task.projectName}</td>
                  <td className="px-5 py-3 text-gray-700">{task.title}</td>
                  <td className="px-5 py-3"><AvatarStack avatars={task.assignees} max={3} /></td>
                  <td className="px-5 py-3 text-gray-500">{task.dueDate}</td>
                  <td className="px-5 py-3"><StatusBadge status={task.status} /></td>
                  <td className="px-5 py-3"><PriorityBadge priority={task.priority} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors">
                        <Eye size={13} />
                      </button>
                      <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors">
                        <Pencil size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Showing</span>
            <select className="border border-gray-200 rounded px-2 py-0.5 text-xs outline-none">
              <option>20</option>
              <option>50</option>
            </select>
            <span>of 100 entries</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {['Previous', '1', '2', '3', '4', '5', 'Next'].map((p) => (
              <button key={p} className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${p === '1' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
