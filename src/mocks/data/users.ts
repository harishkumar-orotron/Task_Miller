export interface MockUser {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'developer'
  status: 'active' | 'inactive'
  color: string
  createdAt: string
  projects: number
  tasks: number
  inProgress: number
  pending: number
}

export const mockUsers: MockUser[] = [
  { id: '1',  name: 'Nihira Kunwar',      email: 'matangasidhu@email.net',            phone: '9401867909', role: 'admin',     status: 'active',   color: 'bg-blue-400',   createdAt: '15-Sep-2024', projects: 6, tasks: 6, inProgress: 6, pending: 6 },
  { id: '2',  name: 'Lauhit Kamble',      email: 'geetha.mesta@aim.in',               phone: '6167057219', role: 'developer', status: 'inactive', color: 'bg-green-400',  createdAt: '15-Sep-2024', projects: 6, tasks: 6, inProgress: 6, pending: 6 },
  { id: '3',  name: 'Chhavi Naik',        email: 'ekapadhunagund@yahoo.org',          phone: '6189640888', role: 'developer', status: 'active',   color: 'bg-purple-400', createdAt: '15-Sep-2024', projects: 6, tasks: 6, inProgress: 6, pending: 6 },
  { id: '4',  name: 'Parijat Kasambe',    email: 'gunasundari.mohanty@world.com',     phone: '8303163542', role: 'developer', status: 'inactive', color: 'bg-pink-400',   createdAt: '15-Sep-2024', projects: 6, tasks: 6, inProgress: 6, pending: 6 },
  { id: '5',  name: 'Vidyut Muppalla',    email: 'kabbur.aadhav@worldmail.in',        phone: '7953534494', role: 'developer', status: 'active',   color: 'bg-yellow-500', createdAt: '15-Sep-2024', projects: 6, tasks: 6, inProgress: 6, pending: 6 },
  { id: '6',  name: 'Sai Dasar',          email: 'tatavarthy.priyansh@company.com',   phone: '7320105276', role: 'developer', status: 'inactive', color: 'bg-red-400',    createdAt: '15-Sep-2024', projects: 6, tasks: 6, inProgress: 6, pending: 6 },
  { id: '7',  name: 'Aadav Tallapragada', email: 'dodamani.pahal@digital.in',         phone: '7229842369', role: 'developer', status: 'active',   color: 'bg-indigo-400', createdAt: '15-Sep-2024', projects: 6, tasks: 6, inProgress: 6, pending: 6 },
  { id: '8',  name: 'Ekaant Nagar',       email: 'iditrishankar@computer.net',        phone: '8331375187', role: 'developer', status: 'active',   color: 'bg-teal-400',   createdAt: '15-Sep-2024', projects: 6, tasks: 6, inProgress: 6, pending: 6 },
  { id: '9',  name: 'Velvili Balabhadra', email: 'rakeshroy@market.com',              phone: '9298056333', role: 'developer', status: 'inactive', color: 'bg-orange-400', createdAt: '15-Sep-2024', projects: 6, tasks: 6, inProgress: 6, pending: 6 },
  { id: '10', name: 'Vikas Sambe',        email: 'pant.garima@company.org',           phone: '8934759120', role: 'developer', status: 'active',   color: 'bg-cyan-400',   createdAt: '15-Sep-2024', projects: 6, tasks: 6, inProgress: 6, pending: 6 },
  { id: '11', name: 'Kishan Bisanal',     email: 'shridevisharma@workplace.net',      phone: '9117389504', role: 'developer', status: 'active',   color: 'bg-lime-500',   createdAt: '15-Sep-2024', projects: 6, tasks: 6, inProgress: 6, pending: 6 },
  { id: '12', name: 'Aariket Ben',        email: 'advitnatt@example.in',              phone: '6776498331', role: 'developer', status: 'inactive', color: 'bg-violet-400', createdAt: '15-Sep-2024', projects: 6, tasks: 6, inProgress: 6, pending: 6 },
]

export const mockOrgs = ['Microsoft', 'Google', 'Meta']
