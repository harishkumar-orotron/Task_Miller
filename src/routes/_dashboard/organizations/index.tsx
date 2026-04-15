import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Search, ChevronDown } from 'lucide-react'
import { useOrgs } from '../../../queries/orgs.queries'
import { useDebounce } from '../../../hooks/useDebounce'
import OrgTable from '../../../components/organizations/OrgTable'
import OrgForm from '../../../components/organizations/OrgForm'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import ErrorMessage from '../../../components/common/ErrorMessage'
import type { ApiError } from '../../../types/api.types'

export const Route = createFileRoute('/_dashboard/organizations/')({
  component: OrganizationsPage,
})

const LIMIT = 8

const sortOptions = [
  { label: 'Name A–Z',  sortBy: 'name',      order: 'asc'  },
  { label: 'Name Z–A',  sortBy: 'name',      order: 'desc' },
  { label: 'Newest',    sortBy: 'createdAt', order: 'desc' },
  { label: 'Oldest',    sortBy: 'createdAt', order: 'asc'  },
] as const

function OrganizationsPage() {
  const [search, setSearch]     = useState('')
  const [sortIdx, setSortIdx]   = useState(2)           // default: Newest
  const [page, setPage]         = useState(1)
  const [showForm, setShowForm] = useState(false)

  const debouncedSearch = useDebounce(search, 400)

  const { sortBy, order } = sortOptions[sortIdx]

  const { data, isLoading, isFetching, error } = useOrgs({
    search:  debouncedSearch || undefined,
    sortBy,
    order,
    page,
    limit: LIMIT,
  })

  const orgs       = data?.organizations ?? []
  const total      = data?.total         ?? 0
  const totalPages = data?.totalPages    ?? 1

  // Reset to page 1 when search changes
  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleSort = (idx: number) => {
    setSortIdx(idx)
    setPage(1)
  }

  const startEntry = total === 0 ? 0 : (page - 1) * LIMIT + 1
  const endEntry   = Math.min(page * LIMIT, total)

  // Page numbers to show (max 5 around current)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            All
            <span className="text-gray-400 font-normal ml-1">({total})</span>
          </h2>

          <div className="flex items-center gap-2">

            {/* Sort */}
            <div className="relative">
              <select
                value={sortIdx}
                onChange={(e) => handleSort(Number(e.target.value))}
                className="appearance-none border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-gray-600 bg-gray-50 outline-none cursor-pointer"
              >
                {sortOptions.map((o, i) => (
                  <option key={i} value={i}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name"
                className="bg-transparent outline-none w-36 text-gray-700 placeholder-gray-400 text-xs"
              />
              <Search size={13} className={isFetching ? 'text-orange-400 animate-pulse' : 'text-gray-400'} />
            </div>

            {/* Create */}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              <Plus size={13} /> Add Organization
            </button>

          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-5">
            <ErrorMessage message={(error as ApiError)?.message ?? 'Failed to load organizations'} />
          </div>
        ) : (
          <OrgTable orgs={orgs} />
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPages > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">

            {/* Entry info */}
            <p className="text-xs text-gray-500">
              Showing <span className="font-medium text-gray-700">{startEntry}–{endEntry}</span> of <span className="font-medium text-gray-700">{total}</span> entries
            </p>

            {/* Page buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2.5 py-1 rounded text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {pageNumbers.map((p, i) => {
                const prev = pageNumbers[i - 1]
                return (
                  <span key={p} className="flex items-center gap-1">
                    {prev && p - prev > 1 && (
                      <span className="text-xs text-gray-400 px-1">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                        p === page
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                )
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1 rounded text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>

          </div>
        )}

      </div>

      {showForm && <OrgForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
