import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ChevronDown, Send, Tag } from 'lucide-react'
import { mockTasks } from '../../../mocks/data/tasks'

export const Route = createFileRoute('/_dashboard/tasks/$taskId')({
  component: TaskViewPage,
})

type Tab = 'subtasks' | 'assignTo' | 'attachments'

function TaskViewPage() {
  const { taskId } = Route.useParams()
  const navigate = useNavigate()
  const task = mockTasks.find((t) => t.id === taskId) ?? mockTasks[0]

  const [activeTab, setActiveTab] = useState<Tab>('assignTo')
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState(task.status)

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'subtasks',    label: 'Subtasks',    count: task.subtasks.length || 10 },
    { key: 'assignTo',   label: 'Assign To',   count: task.assignees.length || 10 },
    { key: 'attachments',label: 'Attachments', count: task.attachments.length || 10 },
  ]

  const statusOptions = ['to_do', 'in_progress', 'on_hold', 'overdue', 'completed'] as const

  return (
    <div className="space-y-4">

      {/* Back */}
      <button onClick={() => navigate({ to: '/tasks' })} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={15} /> Back to Tasks
      </button>

      <div className="flex gap-5">

        {/* Left panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 p-5 space-y-5">

          {/* Title + Status */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
            <div className="relative flex-shrink-0">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="appearance-none border border-blue-300 text-blue-600 bg-blue-50 rounded-lg pl-3 pr-8 py-1.5 text-sm font-medium outline-none cursor-pointer"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2 top-2.5 text-blue-500 pointer-events-none" />
            </div>
          </div>

          {/* Project + Tags */}
          <div className="flex items-start gap-8">
            <div>
              <p className="text-xs text-gray-400 mb-1">Project</p>
              <p className="text-sm font-semibold text-gray-800">{task.projectName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    <Tag size={10} />{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Description</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{task.description}</p>
          </div>

          {/* Created By + Due Date */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">{task.createdBy.charAt(0)}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Created By</p>
                <p className="text-sm font-medium text-gray-700">{task.createdBy}</p>
                <p className="text-xs text-gray-400">{new Date(task.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Due Date</p>
              <p className="text-sm font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-lg">{task.dueDate}</p>
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
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Assign To tab content */}
            {activeTab === 'assignTo' && (
              <table className="w-full text-sm mt-3">
                <thead>
                  <tr className="table-header text-xs text-gray-600 font-semibold">
                    <th className="px-4 py-2.5 text-left">S No</th>
                    <th className="px-4 py-2.5 text-left">Name</th>
                    <th className="px-4 py-2.5 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {task.assignees.map((a, i) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-500">{String(i + 1).padStart(2, '0')}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full ${a.color} flex items-center justify-center`}>
                            <span className="text-white text-xs font-semibold">{a.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium text-gray-700">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-medium ${i === 0 ? 'text-green-500' : 'text-gray-400'}`}>
                          {i === 0 ? 'Primary' : 'Member'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'subtasks' && (
              <div className="mt-3 space-y-2">
                {task.subtasks.length > 0 ? task.subtasks.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    <input type="checkbox" defaultChecked={s.completed} className="rounded" />
                    <span className={`text-sm ${s.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>{s.title}</span>
                  </div>
                )) : <p className="text-sm text-gray-400 py-4 text-center">No subtasks yet</p>}
              </div>
            )}

            {activeTab === 'attachments' && (
              <p className="text-sm text-gray-400 py-4 text-center">No attachments yet</p>
            )}
          </div>
        </div>

        {/* Right panel — Comments */}
        <div className="w-72 bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-sm">Comments</h3>
            <button className="text-xs text-green-600 border border-green-200 bg-green-50 px-3 py-1 rounded-lg hover:bg-green-100 font-medium">
              Check Activity
            </button>
          </div>

          {/* Comments list */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {task.comments.map((c) => (
              <div key={c.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">{c.author.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{c.author}</span>
                  </div>
                  <span className="text-xs text-gray-400">{c.timeAgo}</span>
                </div>
                <p className="text-xs text-gray-500 ml-9 leading-relaxed">{c.text}</p>
                <button className="text-xs text-gray-400 ml-9 hover:text-gray-600">↩ Reply</button>
              </div>
            ))}
          </div>

          {/* Comment input */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <div className="w-7 h-7 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">P</span>
            </div>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 text-xs text-gray-700 placeholder-gray-400 outline-none"
            />
            <button onClick={() => setComment('')} className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600">
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
