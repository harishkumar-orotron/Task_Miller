import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Camera, CheckCircle2, ListTodo, Timer, AlertCircle, Trash2 } from 'lucide-react'
import { mockProjects } from '../../../mocks/data/projects'

export const Route = createFileRoute('/_dashboard/projects/$projectId')({
  component: ProjectViewPage,
})

const roleColors: Record<string, string> = {
  Manager: 'text-orange-500',
  Admin:   'text-blue-500',
  User:    'text-gray-500',
}

function ProjectViewPage() {
  const { projectId } = Route.useParams()
  const navigate = useNavigate()
  const project = mockProjects.find((p) => p.id === projectId) ?? mockProjects[0]

  const statItems = [
    { label: 'Total Tasks', value: project.stats.total,      icon: <ListTodo     size={22} className="text-purple-500" />, bg: 'bg-purple-50' },
    { label: 'To Do',       value: project.stats.toDo,       icon: <ListTodo     size={22} className="text-blue-500" />,   bg: 'bg-blue-50' },
    { label: 'In Progress', value: project.stats.inProgress, icon: <Timer        size={22} className="text-orange-500" />, bg: 'bg-orange-50' },
    { label: 'Overdue',     value: project.stats.overdue,    icon: <AlertCircle  size={22} className="text-red-500" />,    bg: 'bg-red-50' },
    { label: 'Completed',   value: project.stats.completed,  icon: <CheckCircle2 size={22} className="text-green-500" />, bg: 'bg-green-50' },
  ]

  return (
    <div className="space-y-4">

      {/* Back */}
      <button onClick={() => navigate({ to: '/projects' })} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={15} /> Back to Projects
      </button>

      <div className="flex gap-5">

        {/* Left panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6 space-y-5">

          {/* Logo + Title */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className={`w-20 h-20 rounded-full ${project.logoBg} border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 uppercase`}>
                {project.logoUrl.slice(0, 2)}
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                <Camera size={11} className="text-white" />
              </button>
            </div>
            <div className="flex-1 pt-2">
              <h2 className="text-xl font-bold text-orange-500 mb-1">{project.title}</h2>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div>
                  <span className="text-xs text-gray-400">Created At</span>
                  <p className="font-medium text-gray-700">{project.createdAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">{project.createdBy.charAt(0)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Created By</span>
                    <p className="font-medium text-gray-700">{project.createdBy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-700">Description</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
          </div>

          {/* Members */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Members</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header text-xs text-gray-600 font-semibold">
                  <th className="px-4 py-2.5 text-left">S No</th>
                  <th className="px-4 py-2.5 text-left">Name</th>
                  <th className="px-4 py-2.5 text-left">Date</th>
                  <th className="px-4 py-2.5 text-left">Tasks Assigned</th>
                  <th className="px-4 py-2.5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {project.members.map((m, i) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-500">{String(i + 1).padStart(2, '0')}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${m.color} flex items-center justify-center`}>
                          <span className="text-white text-xs font-semibold">{m.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-gray-700">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500">{m.joinedAt}</td>
                    <td className="px-4 py-2.5 text-gray-600">{m.tasksAssigned}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold ${roleColors[m.role] ?? 'text-gray-500'}`}>{m.role}</span>
                        <button className="w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center text-xs font-bold hover:bg-green-200">A</button>
                        <button className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-xs font-bold hover:bg-blue-200">M</button>
                        <button className="w-6 h-6 bg-red-50 text-red-400 rounded flex items-center justify-center hover:bg-red-100">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right panel — Stats */}
        <div className="w-64 space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Statistics</h3>
            <div className="space-y-3">
              {statItems.map((s) => (
                <div key={s.label} className={`${s.bg} rounded-xl p-3 flex items-center justify-between`}>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                  </div>
                  {s.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
