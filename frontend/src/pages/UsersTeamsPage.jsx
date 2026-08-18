import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  UserCheck,
  Shield,
  Briefcase,
  Download,
  Filter,
  Plus,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Key,
  Lock,
  Mail,
  X,
} from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

// ── Initial Mock Users Data matching Screenshot 1 ──
const INITIAL_USERS = [
  {
    id: 'u-01',
    name: 'Anand Kumar',
    isYou: true,
    email: 'anand.kumar@npig.gov.in',
    role: 'Super Admin',
    roleBadge: 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40',
    team: 'Operations',
    status: 'Active',
    statusColor: 'text-emerald-500 dark:text-emerald-400',
    lastActive: 'Now',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'u-02',
    name: 'Priya Singh',
    isYou: false,
    email: 'priya.singh@npig.gov.in',
    role: 'Admin',
    roleBadge: 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40',
    team: 'Operations',
    status: 'Active',
    statusColor: 'text-emerald-500 dark:text-emerald-400',
    lastActive: '12 min ago',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'u-03',
    name: 'Rohit Verma',
    isYou: false,
    email: 'rohit.verma@npig.gov.in',
    role: 'Analyst',
    roleBadge: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40',
    team: 'Intelligence',
    status: 'Active',
    statusColor: 'text-emerald-500 dark:text-emerald-400',
    lastActive: '32 min ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'u-04',
    name: 'Neha Sharma',
    isYou: false,
    email: 'neha.sharma@npig.gov.in',
    role: 'Officer',
    roleBadge: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40',
    team: 'Field Operations',
    status: 'Active',
    statusColor: 'text-emerald-500 dark:text-emerald-400',
    lastActive: '45 min ago',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'u-05',
    name: 'Vikram Patel',
    isYou: false,
    email: 'vikram.patel@npig.gov.in',
    role: 'Researcher',
    roleBadge: 'bg-cyan-100 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/40',
    team: 'Research & AI',
    status: 'Away',
    statusColor: 'text-amber-500 dark:text-amber-400',
    lastActive: '1 hr ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'u-06',
    name: 'Sneha Iyer',
    isYou: false,
    email: 'sneha.iyer@npig.gov.in',
    role: 'Viewer',
    roleBadge: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-500/40',
    team: 'Public Safety',
    status: 'Active',
    statusColor: 'text-emerald-500 dark:text-emerald-400',
    lastActive: '2 hrs ago',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'u-07',
    name: 'Arjun Nair',
    isYou: false,
    email: 'arjun.nair@npig.gov.in',
    role: 'Officer',
    roleBadge: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40',
    team: 'Traffic Management',
    status: 'Inactive',
    statusColor: 'text-rose-500 dark:text-rose-400',
    lastActive: '1 day ago',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'u-08',
    name: 'Meera Joshi',
    isYou: false,
    email: 'meera.joshi@npig.gov.in',
    role: 'Analyst',
    roleBadge: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40',
    team: 'Analytics',
    status: 'Active',
    statusColor: 'text-emerald-500 dark:text-emerald-400',
    lastActive: '1 day ago',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
  },
]

const TEAMS_OVERVIEW = [
  { name: 'Operations', users: '21 users', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' },
  { name: 'Intelligence', users: '18 users', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' },
  { name: 'Research & AI', users: '14 users', color: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400' },
  { name: 'Field Operations', users: '12 users', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
  { name: 'Analytics', users: '10 users', color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' },
]

const USER_ACTIVITY = [
  { name: 'Anand Kumar', action: 'Approved Alert #8320 in Worli', time: '2m ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { name: 'Priya Singh', action: 'Exported Intelligence Brief (PDF)', time: '14m ago', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
  { name: 'Rohit Verma', action: 'Adjusted STGCN Confidence Threshold', time: '41m ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
]

const ROLES_DONUT = [
  { name: 'Super Admin', value: 5, color: '#8B5CF6', percent: '0.4%' },
  { name: 'Admin', value: 48, color: '#3B82F6', percent: '3.8%' },
  { name: 'Analyst', value: 368, color: '#10B981', percent: '29.5%' },
  { name: 'Officer', value: 412, color: '#F59E0B', percent: '33.0%' },
  { name: 'Researcher', value: 187, color: '#06B6D4', percent: '15.0%' },
  { name: 'Viewer', value: 228, color: '#64748B', percent: '18.3%' },
]

export default function UsersTeamsPage() {
  const { theme } = useStore()
  const isLight = theme === 'light'

  const [activeTab, setActiveTab] = useState('Users')
  const [users, setUsers] = useState(INITIAL_USERS)
  const [addUserModalOpen, setAddUserModalOpen] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Analyst')
  const [team, setTeam] = useState('Intelligence')

  const tabs = [
    { name: 'Users', icon: Users },
    { name: 'Teams', icon: Briefcase },
    { name: 'Roles', icon: Shield },
    { name: 'Permissions', icon: Lock },
    { name: 'Invitations', icon: Mail },
    { name: 'Activity Logs', icon: Clock },
  ]

  const handleAddUser = (e) => {
    e.preventDefault()
    if (!name || !email) return
    const newUser = {
      id: `u-${Date.now()}`,
      name,
      isYou: false,
      email,
      role,
      roleBadge:
        role === 'Admin'
          ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40'
          : role === 'Officer'
            ? 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
            : 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40',
      team,
      status: 'Active',
      statusColor: 'text-emerald-500 dark:text-emerald-400',
      lastActive: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    }
    setUsers([newUser, ...users])
    setName('')
    setEmail('')
    setAddUserModalOpen(false)
    toast.success(`User Invited & Provisioned: ${newUser.name}`)
  }

  return (
    <div className="space-y-5 pb-8">
      
      {/* ── Header matching Screenshot 1 ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Users & Teams
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Manage users, teams, roles and permissions across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => toast('Importing user directory via SCIM / LDAP', { icon: '📥' })}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
                : 'bg-[#0F1524] hover:bg-[#1E2436] border-[#1E2436] text-slate-300'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Import Users</span>
          </button>

          <button
            onClick={() => toast('Applying role and permission filters', { icon: '⚙️' })}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
                : 'bg-[#0F1524] hover:bg-[#1E2436] border-[#1E2436] text-slate-300'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          <button
            onClick={() => setAddUserModalOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* ── Sub Tabs matching Screenshot 1 ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/5 pb-2 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.name
          return (
            <button
              key={t.name}
              onClick={() => setActiveTab(t.name)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-[#5B4DFF]/15 dark:text-indigo-400 dark:border-indigo-500/30 font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.name}</span>
            </button>
          )
        })}
      </div>

      {/* ── 4 KPI Cards matching Screenshot 1 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Users */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between shadow-sm"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">↑ 12.5% <span className="text-slate-400 dark:text-slate-500 font-normal text-[10px]">vs last month</span></span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Users</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">1,248</h2>
          </div>
        </div>

        {/* Active Users */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between shadow-sm"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">↑ 8.2% <span className="text-slate-400 dark:text-slate-500 font-normal text-[10px]">vs last month</span></span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Users</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">1,035</h2>
          </div>
        </div>

        {/* Admins */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between shadow-sm"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">↑ 4.1% <span className="text-slate-400 dark:text-slate-500 font-normal text-[10px]">vs last month</span></span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admins</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">48</h2>
          </div>
        </div>

        {/* Teams */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between shadow-sm"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">↑ 8.7% <span className="text-slate-400 dark:text-slate-500 font-normal text-[10px]">vs last month</span></span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Teams</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">86</h2>
          </div>
        </div>

      </div>

      {/* ── Main Two-Column Layout (Left Table 8 cols, Right Side Cards 4 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Users Table (8 cols) */}
        <div
          className="lg:col-span-8 rounded-xl border overflow-hidden shadow-sm"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-slate-50/50 dark:bg-transparent">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Team</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Active</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    {/* User */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-white/10 shadow-sm"
                        />
                        <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {u.name}
                        </span>
                        {u.isYou && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">{u.email}</td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.roleBadge}`}>
                        {u.role}
                      </span>
                    </td>

                    {/* Team */}
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{u.team}</td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`font-semibold flex items-center gap-1.5 ${u.statusColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {u.status}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">{u.lastActive}</td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                        <button
                          onClick={() => toast(`Editing profile for ${u.name}`, { icon: '✏️' })}
                          className="p-1 rounded hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 rounded hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-40">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-lg bg-[#5B4DFF] text-white font-bold text-xs flex items-center justify-center">
                1
              </button>
              <button className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-xs flex items-center justify-center">
                2
              </button>
              <button className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-xs flex items-center justify-center">
                3
              </button>
              <span className="px-1 text-slate-400 dark:text-slate-600">...</span>
              <button className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-xs flex items-center justify-center">
                156
              </button>
              <button className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px]">
                Showing 1 to {users.length} of 1248 users
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Rows per page:</span>
              <select
                className={`px-2 py-1 rounded-lg text-xs outline-none border cursor-pointer ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#0B1020] border-[#1E2436] text-white'
                }`}
              >
                <option value="10">10 ▾</option>
                <option value="25">25 ▾</option>
                <option value="50">50 ▾</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Cards (4 cols) matching Screenshot 1 */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card 1: Teams Overview */}
          <div
            className="p-5 rounded-xl border flex flex-col justify-between shadow-sm"
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
              borderColor: isLight ? '#E2E8F0' : '#1E2436',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
                Teams Overview
              </h3>
              <button onClick={() => toast('Viewing all 86 registered agency teams')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-2.5 mb-3">
              {TEAMS_OVERVIEW.map((tm) => (
                <div key={tm.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg ${tm.color}`}>
                      <Users className="w-3 h-3" />
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">{tm.name}</span>
                  </div>
                  <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">{tm.users}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => toast.success('Creating new specialized operational unit')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-white/5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Team</span>
            </button>
          </div>

          {/* Card 2: User Activity */}
          <div
            className="p-5 rounded-xl border flex flex-col justify-between shadow-sm"
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
              borderColor: isLight ? '#E2E8F0' : '#1E2436',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
                User Activity
              </h3>
              <button onClick={() => toast('Opening global audit event stream')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {USER_ACTIVITY.map((act, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={act.avatar} alt={act.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0 border border-slate-200 dark:border-white/10" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white text-[11px] truncate">{act.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{act.action}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 flex-shrink-0">
                    {act.time} <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Roles Distribution */}
          <div
            className="p-5 rounded-xl border flex flex-col justify-between shadow-sm"
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
              borderColor: isLight ? '#E2E8F0' : '#1E2436',
            }}
          >
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3">
              Roles Distribution
            </h3>

            <div className="flex items-center justify-between gap-3">
              {/* Donut */}
              <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ROLES_DONUT}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                      stroke={isLight ? '#FFFFFF' : '#0F1524'}
                      strokeWidth={2}
                    >
                      {ROLES_DONUT.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="font-black text-xs text-slate-900 dark:text-white">1,248</span>
                  <span className="text-[8px] text-slate-500 dark:text-slate-400">Total Users</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="flex-1 space-y-1 min-w-0">
                {ROLES_DONUT.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                    </div>
                    <span className="font-mono text-slate-500 dark:text-slate-400 ml-1 whitespace-nowrap">
                      <strong className="text-slate-900 dark:text-white">{item.value}</strong> ({item.percent})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── Add User Modal ── */}
      <AnimatePresence>
        {addUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B1020] border-white/15 text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Add / Provision User</h3>
                <button onClick={() => setAddUserModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Government Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh.chandra@npig.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Analyst">Analyst</option>
                      <option value="Officer">Officer</option>
                      <option value="Researcher">Researcher</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Team</label>
                    <select
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                    >
                      <option value="Operations">Operations</option>
                      <option value="Intelligence">Intelligence</option>
                      <option value="Research & AI">Research & AI</option>
                      <option value="Field Operations">Field Operations</option>
                      <option value="Analytics">Analytics</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setAddUserModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white"
                  >
                    Provision User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
