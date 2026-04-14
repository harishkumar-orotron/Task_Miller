import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus, Search, ChevronDown, Eye, Pencil, Upload } from 'lucide-react'
import { mockUsers } from '../../../mocks/data/users'

export const Route = createFileRoute('/_dashboard/users/')({
  component: UsersPage,
})

function UsersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !status || u.status === status
    return matchSearch && matchStatus
  })

  return (
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
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name" className="bg-transparent outline-none w-36 text-gray-700 placeholder-gray-400 text-xs" />
            <Search size={13} className="text-gray-400" />
          </div>

          {/* Add User */}
          <button className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800">
            <Plus size={13} /> Add User
          </button>

          {/* Import */}
          <button className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700">
            <Upload size={13} /> Import
          </button>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="table-header text-xs text-gray-600 font-semibold">
              <th className="px-5 py-3 text-left">S No ↕</th>
              <th className="px-5 py-3 text-left">Name ↕</th>
              <th className="px-5 py-3 text-left">Created on ↕</th>
              <th className="px-5 py-3 text-left">Email ↕</th>
              <th className="px-5 py-3 text-left">Mobile Number ↕</th>
              <th className="px-5 py-3 text-left">Status ↕</th>
              <th className="px-5 py-3 text-left">Projects ↕</th>
              <th className="px-5 py-3 text-left">Tasks ↕</th>
              <th className="px-5 py-3 text-left">In Progress ↕</th>
              <th className="px-5 py-3 text-left">Pending ↕</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((user, i) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-500">{String(i + 1).padStart(2, '0')}</td>

                {/* Name with avatar */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs font-semibold">{user.name.charAt(0)}</span>
                    </div>
                    <span className="font-medium text-gray-700 whitespace-nowrap">{user.name}</span>
                  </div>
                </td>

                <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{user.createdAt}</td>
                <td className="px-5 py-3 text-gray-500 max-w-[180px] truncate">{user.email}</td>
                <td className="px-5 py-3 text-gray-500">{user.phone}</td>

                {/* Status */}
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td className="px-5 py-3 text-gray-600 text-center">{user.projects}/{user.projects}</td>
                <td className="px-5 py-3 text-gray-600 text-center">{user.tasks}/{user.tasks}</td>
                <td className="px-5 py-3 text-gray-600 text-center">{user.inProgress}/{user.inProgress}</td>
                <td className="px-5 py-3 text-gray-600 text-center">{user.pending}/{user.pending}</td>

                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate({ to: '/users/$userId', params: { userId: user.id } })} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-500">
                      <Eye size={13} />
                    </button>
                    <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-500">
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
  )
}
