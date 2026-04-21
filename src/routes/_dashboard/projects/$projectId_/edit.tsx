import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useProject } from '../../../../queries/projects.queries'
import ProjectForm from '../../../../components/projects/ProjectForm'
import LoadingSpinner from '../../../../components/common/LoadingSpinner'
import ErrorMessage from '../../../../components/common/ErrorMessage'
import type { ApiError } from '../../../../types/api.types'

export const Route = createFileRoute('/_dashboard/projects/$projectId_/edit')({
  component: EditProjectPage,
})

function EditProjectPage() {
  const { projectId } = Route.useParams()
  const navigate      = useNavigate()
  const { data: project, isLoading, isError, error } = useProject(projectId)
  const onBack = () => navigate({ to: '/projects/$projectId', params: { projectId } })

  if (isLoading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>

  if (isError || !project) return (
    <div className="max-w-lg mx-auto space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft size={15} /> Back to Project
      </button>
      <ErrorMessage message={(error as ApiError)?.message ?? 'Project not found'} />
    </div>
  )

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft size={15} /> Back to Project
      </button>
      <ProjectForm project={project} onClose={onBack} />
    </div>
  )
}
