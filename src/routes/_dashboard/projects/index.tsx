import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Search, ChevronDown } from 'lucide-react'
import { useProjects } from '../../../queries/projects.queries'
import { useOrgContext } from '../../../store/orgContext.store'
import { useDebounce } from '../../../hooks/useDebounce'
import { useAuth } from '../../../hooks/useAuth'
import ProjectList from '../../../components/projects/ProjectList'
import Pagination from '../../../components/ui/Pagination'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import ErrorMessage from '../../../components/common/ErrorMessage'
import type { ApiError } from '../../../types/api.types'
import type { ProjectStatus } from '../../../types/project.types'

export const Route = createFileRoute('/_dashboard/projects/')({
  validateSearch: (search: Record<string, unknown>) => ({
    search: (search.search as string) || '',
    status: (search.status as ProjectStatus) || '',
    page:   Number(search.page)  || 1,
    limit:  Number(search.limit) || 10,
  }),
  component: ProjectsPage,
})


function ProjectsPage() {
  const { isAdmin, isSuperAdmin } = useAuth()
  const { selectedOrg } = useOrgContext()
  const navigate = Route.useNavigate()
  const { search, status, page, limit } = Route.useSearch()
  const setParams = (params: Partial<{ search: string; status: ProjectStatus | ''; page: number; limit: number }>) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ search: (prev) => ({ ...prev, ...params }) as any })

  useEffect(() => { setParams({ page: 1 }) }, [selectedOrg?.id])

  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading, isFetching, error } = useProjects({
    search: debouncedSearch || undefined,
    status: status || undefined,
    orgId:  isSuperAdmin && selectedOrg ? selectedOrg.id : undefined,
    page,
    limit,
  })

  const projects   = data?.projects    ?? []
  const pagination = data?.pagination

  const totalRecords = pagination?.totalRecords ?? 0
  const totalPages   = pagination?.totalPages   ?? 1
  const activePage   = pagination?.currentPage  ?? page
  const activeLimit  = pagination?.limit        ?? limit
  const startEntry   = totalRecords === 0 ? 0 : (activePage - 1) * activeLimit + 1
  const endEntry     = Math.min(activePage * activeLimit, totalRecords)

  const handleSearch = (val: string)          => setParams({ search: val, page: 1 })
  const handleStatus = (val: ProjectStatus | '') => setParams({ status: val, page: 1 })
  const handleLimit  = (val: number)          => setParams({ limit: val, page: 1 })

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">
          {isSuperAdmin && selectedOrg ? selectedOrg.name : 'All'}{' '}
          <span className="text-gray-400 font-normal ml-1">({totalRecords})</span>
        </h2>
        <div className="flex items-center gap-2">

          {/* Status filter */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => handleStatus(e.target.value as ProjectStatus | '')}
              className="appearance-none border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-gray-600 bg-white outline-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name"
              className="bg-transparent outline-none w-36 text-gray-700 placeholder-gray-400 text-xs"
            />
            <Search size={13} className={isFetching ? 'text-orange-400 animate-pulse' : 'text-gray-400'} />
          </div>

          {/* Add Project — admin+ only */}
          {isAdmin && (
            <button
              onClick={() => navigate({ to: '/projects/new' })}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              <Plus size={13} /> Add Project
            </button>
          )}

        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message={(error as ApiError)?.message ?? 'Failed to load projects'} />
      ) : (
        <ProjectList projects={projects} />
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 0 && (
        <div className="bg-white rounded-xl border border-gray-100">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalRecords={totalRecords}
            startEntry={startEntry}
            endEntry={endEntry}
            limit={limit}
            hasPrevPage={pagination?.hasPrevPage}
            hasNextPage={pagination?.hasNextPage}
            onPageChange={(p) => setParams({ page: p })}
            onLimitChange={handleLimit}
          />
        </div>
      )}

    </div>
  )
}
