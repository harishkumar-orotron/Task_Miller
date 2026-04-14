export interface MockAssignee {
  id: string
  name: string
  color: string
}

export interface MockTask {
  id: string
  projectId: string
  projectName: string
  title: string
  assignees: MockAssignee[]
  dueDate: string
  status: 'to_do' | 'in_progress' | 'on_hold' | 'overdue' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  description: string
  tags: string[]
  createdBy: string
  createdAt: string
  subtasks: { id: string; title: string; completed: boolean }[]
  attachments: { id: string; name: string; url: string }[]
  comments: { id: string; author: string; text: string; timeAgo: string }[]
}

const users: MockAssignee[] = [
  { id: '1', name: 'Nihira Kunwar',    color: 'bg-blue-400' },
  { id: '2', name: 'Lauhit Kamble',   color: 'bg-green-400' },
  { id: '3', name: 'Chhavi Naik',     color: 'bg-purple-400' },
  { id: '4', name: 'Parijat Kasambe', color: 'bg-pink-400' },
  { id: '5', name: 'Vidyut Muppalla', color: 'bg-yellow-400' },
  { id: '6', name: 'Sai Dasar',       color: 'bg-red-400' },
]

export const mockTasks: MockTask[] = [
  {
    id: '1', projectId: '1', projectName: 'Quantum Leap',
    title: 'Prepare Monthly Report',
    assignees: [users[0], users[1], users[2], users[3]],
    dueDate: '15-Sep-2024', status: 'to_do', priority: 'urgent',
    description: 'Prepare the monthly performance report for stakeholders including KPIs and metrics.',
    tags: ['Profitable', 'AI', '1 Person', 'Marketing'],
    createdBy: 'Peter', createdAt: '2024-01-04T16:33:00Z',
    subtasks: [{ id: 's1', title: 'Gather data', completed: true }, { id: 's2', title: 'Write summary', completed: false }],
    attachments: [{ id: 'a1', name: 'report-template.xlsx', url: '#' }],
    comments: [
      { id: 'c1', author: 'Robert', text: 'Impressive! Though it seems the drag feature could be improved.', timeAgo: '1 month ago' },
      { id: 'c2', author: 'Dyane', text: "@Robert If you're still new, I'd recommend focusing on the fundamentals first.", timeAgo: '1 week ago' },
    ],
  },
  {
    id: '2', projectId: '2', projectName: 'HyperDrive',
    title: 'Update Client Database',
    assignees: [users[0], users[1], users[2], users[4]],
    dueDate: '15-Sep-2024', status: 'completed', priority: 'high',
    description: 'Update all client records in the CRM with latest contact information.',
    tags: ['Database', 'CRM'], createdBy: 'Alice', createdAt: '2024-01-05T09:00:00Z',
    subtasks: [], attachments: [], comments: [],
  },
  {
    id: '3', projectId: '3', projectName: 'CodeFusion',
    title: 'Conduct Market Research',
    assignees: [users[1], users[2], users[3], users[5]],
    dueDate: '15-Sep-2024', status: 'in_progress', priority: 'medium',
    description: 'Research competitor landscape and identify market gaps.',
    tags: ['Research', 'Market'], createdBy: 'Bob', createdAt: '2024-01-06T11:00:00Z',
    subtasks: [], attachments: [], comments: [],
  },
  {
    id: '4', projectId: '4', projectName: 'Nexus Integration',
    title: 'Organize Team Meeting',
    assignees: [users[0], users[2], users[4], users[5]],
    dueDate: '15-Sep-2024', status: 'overdue', priority: 'urgent',
    description: 'Set up quarterly review meeting with all team leads.',
    tags: ['Meeting'], createdBy: 'Carol', createdAt: '2024-01-07T10:00:00Z',
    subtasks: [], attachments: [], comments: [],
  },
  {
    id: '5', projectId: '5', projectName: 'Cybernetic Blueprint',
    title: 'Review Project Milestones',
    assignees: [users[0], users[3]],
    dueDate: '15-Sep-2024', status: 'completed', priority: 'high',
    description: 'Review and update all project milestone definitions.',
    tags: ['Planning'], createdBy: 'Dan', createdAt: '2024-01-08T14:00:00Z',
    subtasks: [], attachments: [], comments: [],
  },
  {
    id: '6', projectId: '6', projectName: 'Omega Deployment',
    title: 'Prepare Budget Forecast',
    assignees: [users[1], users[2], users[3], users[4]],
    dueDate: '15-Sep-2024', status: 'in_progress', priority: 'medium',
    description: 'Prepare Q4 budget forecast and allocation plan.',
    tags: ['Finance'], createdBy: 'Eve', createdAt: '2024-01-09T09:30:00Z',
    subtasks: [], attachments: [], comments: [],
  },
  {
    id: '7', projectId: '7', projectName: 'Vertex Development',
    title: 'Develop Marketing Strategy',
    assignees: [users[0], users[1], users[2], users[5]],
    dueDate: '15-Sep-2024', status: 'to_do', priority: 'high',
    description: 'Create a 6-month digital marketing strategy.',
    tags: ['Marketing'], createdBy: 'Frank', createdAt: '2024-01-10T13:00:00Z',
    subtasks: [], attachments: [], comments: [],
  },
  {
    id: '8', projectId: '8', projectName: 'Polaris Upgrade',
    title: 'Analyze Sales Data',
    assignees: [users[2], users[4]],
    dueDate: '15-Sep-2024', status: 'completed', priority: 'low',
    description: 'Analyze Q3 sales data and generate insights.',
    tags: ['Analytics'], createdBy: 'Grace', createdAt: '2024-01-11T11:00:00Z',
    subtasks: [], attachments: [], comments: [],
  },
  {
    id: '9', projectId: '9', projectName: 'Phoenix Framework',
    title: 'Create Presentation Slides',
    assignees: [users[0], users[1], users[3], users[5]],
    dueDate: '15-Sep-2024', status: 'in_progress', priority: 'urgent',
    description: 'Create board-level presentation for the next investor call.',
    tags: ['Presentation'], createdBy: 'Henry', createdAt: '2024-01-12T10:00:00Z',
    subtasks: [], attachments: [], comments: [],
  },
  {
    id: '10', projectId: '10', projectName: 'Titan Refactor',
    title: 'Write Technical Documentation',
    assignees: [users[1], users[3]],
    dueDate: '15-Sep-2024', status: 'on_hold', priority: 'low',
    description: 'Write full API and architecture documentation.',
    tags: ['Docs'], createdBy: 'Iris', createdAt: '2024-01-13T15:00:00Z',
    subtasks: [], attachments: [], comments: [],
  },
  {
    id: '11', projectId: '11', projectName: 'Brand Elevation',
    title: 'Debug Code Issues',
    assignees: [users[0], users[2], users[5]],
    dueDate: '15-Sep-2024', status: 'in_progress', priority: 'high',
    description: 'Fix all critical bugs reported in the latest sprint.',
    tags: ['Engineering'], createdBy: 'Jack', createdAt: '2024-01-14T09:00:00Z',
    subtasks: [], attachments: [], comments: [],
  },
  {
    id: '12', projectId: '12', projectName: 'Market Maverick',
    title: 'Develop API Endpoints',
    assignees: [users[1], users[3], users[4], users[5]],
    dueDate: '15-Sep-2024', status: 'on_hold', priority: 'low',
    description: 'Develop and document all new REST API endpoints.',
    tags: ['API', 'Backend'], createdBy: 'Kate', createdAt: '2024-01-15T11:00:00Z',
    subtasks: [], attachments: [], comments: [],
  },
]
