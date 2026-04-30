import { createFileRoute, redirect } from '@tanstack/react-router'
import { Building2, FolderKanban, CheckCircle2, Clock, AlertCircle, TrendingUp, ListTodo, Timer, PauseCircle, Hourglass } from 'lucide-react'
import { useTasks } from '../../../queries/tasks.queries'
import { useProjects } from '../../../queries/projects.queries'
import { useOrgs } from '../../../queries/orgs.queries'
import { authStore } from '../../../store/auth.store'
import StatsCard from '../../../components/ui/StatsCard'
import { StatsSkeleton } from '../../../components/ui/Skeleton'

export const Route = createFileRoute('/_dashboard/superadmin/dashboard')({
  beforeLoad: () => {
    const role = authStore.state.user?.role
    if (role === 'admin')     throw redirect({ to: '/admin/dashboard', search: {} as any })
    if (role === 'developer') throw redirect({ to: '/dashboard',       search: {} as any })
  },
  component: SuperAdminDashboard,
})

function SuperAdminDashboard() {
  const { data: tasksData,    isLoading: isLoadingTasks    } = useTasks({ limit: 1 })
  const { data: projectsData, isLoading: isLoadingProjects } = useProjects({ limit: 1 })
  const { data: orgsData,     isLoading: isLoadingOrgs     } = useOrgs({})

  const taskStats       = tasksData?.stats
  const totalTasks      = taskStats?.total       ?? 0
  const completedCount  = taskStats?.completed   ?? 0
  const todoCount       = taskStats?.todo        ?? 0
  const inProgressCount = taskStats?.inProgress  ?? 0
  const onHoldCount     = taskStats?.onHold      ?? 0
  const overdueCount    = taskStats?.overdue     ?? 0
  const onTimeCount     = taskStats?.onTime      ?? 0
  const totalProjects   = projectsData?.pagination?.totalRecords ?? 0
  const totalOrgs       = orgsData?.pagination?.totalRecords     ?? orgsData?.organizations?.length ?? 0

  const isLoading = isLoadingTasks || isLoadingProjects || isLoadingOrgs

  const stats = [
    { label: 'Organizations', value: totalOrgs,       iconBg: 'bg-orange-100', icon: <Building2    size={17} className="text-orange-500" /> },
    { label: 'Projects',      value: totalProjects,   iconBg: 'bg-pink-100',   icon: <FolderKanban size={17} className="text-pink-500"   /> },
    { label: 'Tasks',         value: totalTasks,      iconBg: 'bg-gray-100',   icon: <ListTodo     size={17} className="text-gray-500"   /> },
    { label: 'Completed',     value: completedCount,  iconBg: 'bg-green-100',  icon: <CheckCircle2 size={17} className="text-green-500"  /> },
    { label: 'To Do',         value: todoCount,       iconBg: 'bg-slate-100',  icon: <Hourglass    size={17} className="text-slate-500"  /> },
    { label: 'In Progress',   value: inProgressCount, iconBg: 'bg-blue-100',   icon: <Timer        size={17} className="text-blue-500"   /> },
    { label: 'On Hold',       value: onHoldCount,     iconBg: 'bg-yellow-100', icon: <PauseCircle  size={17} className="text-yellow-500" /> },
    { label: 'Overdue',       value: overdueCount,    iconBg: 'bg-red-100',    icon: <AlertCircle  size={17} className="text-red-500"    /> },
    { label: 'On Time',       value: onTimeCount,     iconBg: 'bg-teal-100',   icon: <Clock        size={17} className="text-teal-500"   /> },
    {
      label: 'Completion\nRate',
      value: `${totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0}%`,
      iconBg: 'bg-indigo-100',
      icon: <TrendingUp size={17} className="text-indigo-500" />,
    },
  ]

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-shrink-0">
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 xl:grid-cols-10 gap-3">
            {stats.map((s) => <StatsCard key={s.label} {...s} />)}
          </div>
        )}
      </div>
    </div>
  )
}
