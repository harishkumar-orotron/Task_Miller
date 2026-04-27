import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTask } from '../../../../queries/tasks.queries'
import TaskForm from '../../../../components/tasks/TaskForm'
import LoadingSpinner from '../../../../components/common/LoadingSpinner'

export const Route = createFileRoute('/_dashboard/tasks/$taskId_/subtask')({
  component: AddSubtaskPage,
})

function AddSubtaskPage() {
  const { taskId } = Route.useParams()
  const navigate   = useNavigate()
  const { data: task, isLoading } = useTask(taskId)
  const onBack = () => navigate({ to: '/tasks/$taskId', params: { taskId } })

  if (isLoading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>

  return (
    <div className="max-w-2xl mx-auto w-full space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft size={15} /> Back to Task
      </button>
      <TaskForm parentTaskId={taskId} projectId={task?.projectId} onClose={onBack} />
    </div>
  )
}
