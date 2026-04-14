export type TaskStatus = 'to_do' | 'in_progress' | 'on_hold' | 'overdue' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  createdBy?: string
  completedAt?: string
  createdAt: string
}

export interface TaskAssignee {
  taskId: string
  userId: string
  assignedAt: string
}
