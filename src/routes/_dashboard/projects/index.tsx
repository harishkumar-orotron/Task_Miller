import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus, Search, Calendar, ChevronDown } from 'lucide-react'
import { mockProjects } from '../../../mocks/data/projects'
import AvatarStack from '../../../components/ui/AvatarStack'

export const Route = createFileRoute('/_dashboard/projects/')({
  component: ProjectsPage,
})

// Logo placeholders matching Figma
const logoColors: Record<string, string> = {
  slack: 'bg-purple-100', github: 'bg-gray-800', zoom: 'bg-blue-100',
  instagram: 'bg-pink-100', adobe: 'bg-red-100', unsplash: 'bg-gray-100',
  amd: 'bg-gray-100', facebook: 'bg-blue-600', epicgames: 'bg-gray-900',
  google: 'bg-white border border-gray-200', firefox: 'bg-orange-100',
  tiktok: 'bg-black', nvidia: 'bg-green-700', linux: 'bg-gray-50 border border-gray-200',
  extra: 'bg-blue-100',
}

function ProjectCard({ project }: { project: typeof mockProjects[0] }) {
  const navigate = useNavigate()
  const memberAvatars = project.members.map((m) => ({ id: m.id, name: m.name, color: m.color }))

  return (
    <div
      onClick={() => navigate({ to: '/projects/$projectId', params: { projectId: project.id } })}
      className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md cursor-pointer transition-shadow"
    >
      {/* Logo */}
      <div className={`w-10 h-10 rounded-lg ${logoColors[project.logoUrl] ?? 'bg-gray-100'} flex items-center justify-center mb-3 text-xs font-bold text-gray-600 uppercase`}>
        {project.logoUrl.slice(0, 2)}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-800 text-sm mb-1">{project.title}</h3>

      {/* Description */}
      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{project.description}</p>

      {/* Members */}
      <AvatarStack avatars={memberAvatars} max={4} />
    </div>
  )
}

function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const filtered = mockProjects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !status || p.status === status
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            All <span className="text-gray-500 font-normal">({filtered.length})</span>
          </h2>
          <div className="flex items-center gap-2">

            {/* Status */}
            <div className="relative">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="appearance-none border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-gray-500 bg-gray-50 outline-none cursor-pointer">
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name" className="bg-transparent outline-none w-32 text-gray-700 placeholder-gray-400 text-xs" />
              <Search size={13} className="text-gray-400" />
            </div>

            {/* Date */}
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 bg-gray-50 hover:bg-gray-100">
              <span>Select date</span><Calendar size={13} />
            </button>

            {/* Add */}
            <button className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800">
              <Plus size={13} /> Add Project
            </button>

          </div>
        </div>

        {/* Grid */}
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Showing</span>
            <select className="border border-gray-200 rounded px-2 py-0.5 text-xs outline-none"><option>20</option></select>
            <span>of 100 entries</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {['Previous', '1', '2', '3', '4', '5', 'Next'].map((p) => (
              <button key={p} className={`px-2.5 py-1 rounded text-xs font-medium ${p === '1' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{p}</button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
