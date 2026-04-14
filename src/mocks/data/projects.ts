export interface MockProjectMember {
  id: string
  name: string
  color: string
  role: 'Manager' | 'Admin' | 'User'
  tasksAssigned: number
  joinedAt: string
}

export interface MockProject {
  id: string
  orgId: string
  title: string
  description: string
  logoUrl: string
  logoBg: string
  status: 'active' | 'on_hold' | 'completed'
  createdBy: string
  createdAt: string
  members: MockProjectMember[]
  stats: { total: number; toDo: number; inProgress: number; overdue: number; completed: number }
}

const logos = ['slack', 'github', 'zoom', 'instagram', 'adobe', 'unsplash', 'amd', 'facebook', 'epicgames', 'google', 'firefox', 'tiktok', 'nvidia', 'linux', 'extra']
const logoBgs = ['bg-purple-100', 'bg-gray-900', 'bg-blue-100', 'bg-pink-100', 'bg-red-100', 'bg-gray-100', 'bg-gray-100', 'bg-blue-600', 'bg-gray-800', 'bg-white', 'bg-orange-100', 'bg-black', 'bg-green-700', 'bg-gray-100', 'bg-blue-100']

const makeMembers = (): MockProjectMember[] => [
  { id: '1', name: 'Aditi Ramaswamy', color: 'bg-blue-400',   role: 'Manager', tasksAssigned: 24, joinedAt: '15-Sep-2024' },
  { id: '2', name: 'Balveer Dharavad', color: 'bg-green-400', role: 'Admin',   tasksAssigned: 24, joinedAt: '15-Sep-2024' },
  { id: '3', name: 'Manan Rathaud',   color: 'bg-purple-400', role: 'User',    tasksAssigned: 24, joinedAt: '15-Sep-2024' },
  { id: '4', name: 'Thanya Singh',    color: 'bg-orange-400', role: 'User',    tasksAssigned: 24, joinedAt: '15-Sep-2024' },
]

export const mockProjects: MockProject[] = logos.map((logo, i) => ({
  id: String(i + 1),
  orgId: 'org-1',
  title: `Project Title`,
  description: 'Developing a new customer relationship management system to improve client interactions and streamline processes.',
  logoUrl: logo,
  logoBg: logoBgs[i],
  status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'active' : 'on_hold',
  createdBy: 'Sai Chandra',
  createdAt: '04-01-2023',
  members: makeMembers(),
  stats: { total: 500, toDo: 100, inProgress: 300, overdue: 50, completed: 50 },
}))

// Give real names to first few
mockProjects[0].title = 'Quantum Leap'
mockProjects[1].title = 'HyperDrive'
mockProjects[2].title = 'CodeFusion'
mockProjects[3].title = 'Nexus Integration'
mockProjects[4].title = 'Cybernetic Blueprint'
mockProjects[5].title = 'Omega Deployment'
mockProjects[6].title = 'Vertex Development'
mockProjects[7].title = 'Polaris Upgrade'
mockProjects[8].title = 'Phoenix Framework'
mockProjects[9].title = 'Titan Refactor'
mockProjects[10].title = 'Brand Elevation'
mockProjects[11].title = 'Market Maverick'
mockProjects[12].title = 'API Authentication'
mockProjects[13].title = 'Reality Shift'
mockProjects[14].title = 'Eternal Voyage'
