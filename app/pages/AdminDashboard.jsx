import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import LoadingSpinner from '../components/LoadingSpinner'
import { HiClipboardList, HiUsers, HiChartBar, HiClock, HiPlus } from 'react-icons/hi'

// #admin dashboard page
const AdminDashboard = () => {
  const { user, logout } = useAuthStore()

  // #fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const [jobsRes, candidatesRes] = await Promise.all([
        fetch('/jobs'),
        fetch('/candidates')
      ])
      
      const jobsData = await jobsRes.json()
      const candidatesData = await candidatesRes.json()
      
      return {
        totalJobs: jobsData.pagination?.total || 0,
        totalCandidates: candidatesData.pagination?.total || 0,
        activeJobs: jobsData.data?.filter(job => job.status === 'active').length || 0,
        newCandidates: candidatesData.data?.filter(c => 
          new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0
      }
    }
  })

  const quickActions = [
    {
      title: 'View Jobs',
      description: 'Manage job postings',
      link: '/jobs',
      icon: HiClipboardList,
      color: 'btn-primary'
    },
    {
      title: 'View Candidates',
      description: 'Browse candidate profiles',
      link: '/candidates',
      icon: HiUsers,
      color: 'btn-secondary'
    },
    {
      title: 'Create Job',
      description: 'Post a new job opening',
      link: '/jobs?create=true',
      icon: HiPlus,
      color: 'btn-accent'
    }
  ]

  if (statsLoading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* #header */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <h1 className="text-xl font-bold">TalentFlow Dashboard</h1>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8">
                  <span className="text-xs">{user?.email?.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <span className="ml-2">{user?.email}</span>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><a onClick={logout}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* #welcome section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-base-content/70">
            Here's what's happening with your hiring pipeline.
          </p>
        </div>

        {/* #stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 rounded-lg shadow-sm">
            <div className="stat-figure text-primary">
              <HiClipboardList className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Jobs</div>
            <div className="stat-value text-primary">{stats?.totalJobs || 0}</div>
            <div className="stat-desc">{stats?.activeJobs || 0} active</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-sm">
            <div className="stat-figure text-secondary">
              <HiUsers className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Candidates</div>
            <div className="stat-value text-secondary">{stats?.totalCandidates || 0}</div>
            <div className="stat-desc">{stats?.newCandidates || 0} this week</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-sm">
            <div className="stat-figure text-accent">
              <HiChartBar className="w-8 h-8" />
            </div>
            <div className="stat-title">Conversion Rate</div>
            <div className="stat-value text-accent">12%</div>
            <div className="stat-desc">Last 30 days</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-sm">
            <div className="stat-figure text-info">
              <HiClock className="w-8 h-8" />
            </div>
            <div className="stat-title">Avg. Time to Hire</div>
            <div className="stat-value text-info">24</div>
            <div className="stat-desc">days</div>
          </div>
        </div>

        {/* #quick actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="card-body text-center">
                  <div className="mb-2">
                    <action.icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold">{action.title}</h4>
                  <p className="text-sm text-base-content/70">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* #recent activity */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">New candidate applied for Senior Frontend Developer</span>
                <span className="text-xs text-base-content/60 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-sm">Job "Full Stack Engineer" status changed to Active</span>
                <span className="text-xs text-base-content/60 ml-auto">4 hours ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm">Assessment completed for 3 candidates</span>
                <span className="text-xs text-base-content/60 ml-auto">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
