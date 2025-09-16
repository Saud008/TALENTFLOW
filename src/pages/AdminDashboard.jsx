import { useState, useEffect } from 'react'
import { dataService } from '../services/dataService'

const AdminDashboard = () => {
  const [showAddJob, setShowAddJob] = useState(false)
  const [statistics, setStatistics] = useState(null)

  useEffect(() => {
    // Load statistics
    setStatistics(dataService.getStatistics())
  }, [])

  // Helper function to generate avatar URL from name
  const generateAvatarUrl = (name, size = 150) => {
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=random&color=fff&bold=true&format=png`;
  };

  // Dummy data for employees
  const employees = [
    {
      id: 1,
      name: 'Arjun Mehta',
      email: 'arjun.mehta@company.com',
      role: 'Senior Developer',
      avatar: generateAvatarUrl('Arjun Mehta')
    },
    {
      id: 2,
      name: 'Rajesh Agarwal',
      email: 'rajesh.agarwal@company.com',
      role: 'Product Manager',
      avatar: generateAvatarUrl('Rajesh Agarwal')
    },
    {
      id: 3,
      name: 'Karan Joshi',
      email: 'karan.joshi@company.com',
      role: 'UX Designer',
      avatar: generateAvatarUrl('Karan Joshi')
    },
    {
      id: 4,
      name: 'Vikash Reddy',
      email: 'vikash.reddy@company.com',
      role: 'DevOps Engineer',
      avatar: generateAvatarUrl('Vikash Reddy')
    },
    {
      id: 5,
      name: 'Priya Sharma',
      email: 'priya.sharma@company.com',
      role: 'Marketing Manager',
      avatar: generateAvatarUrl('Priya Sharma')
    },
    {
      id: 6,
      name: 'Rohit Malhotra',
      email: 'rohit.malhotra@company.com',
      role: 'Sales Director',
      avatar: generateAvatarUrl('Rohit Malhotra')
    },
    {
      id: 7,
      name: 'Sneha Iyer',
      email: 'sneha.iyer@company.com',
      role: 'HR Specialist',
      avatar: generateAvatarUrl('Sneha Iyer')
    },
    {
      id: 8,
      name: 'Vikram Nair',
      email: 'vikram.nair@company.com',
      role: 'Data Analyst',
      avatar: generateAvatarUrl('Vikram Nair')
    }
  ]

  const teamInfo = {
    name: 'Engineering Team',
    headOfTeam: 'Arjun Mehta',
    headAvatar: generateAvatarUrl('Arjun Mehta'),
    department: 'Technology',
    totalMembers: employees.length
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8" data-aos="fade-down">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Company Structure</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your team and organizational structure</p>
      </div>

      {/* Top Bar with Department Info and Add Job Button */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 responsive-padding mb-6 sm:mb-8" data-aos="fade-up" data-aos-delay="100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold responsive-text-lg">
              {teamInfo.department.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{teamInfo.department} Department</h2>
              <p className="text-gray-600 dark:text-gray-400">{teamInfo.totalMembers} team members</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddJob(!showAddJob)}
            className="btn btn-primary px-6 py-3 rounded-lg font-medium"
          >
            + Add Job
          </button>
        </div>
      </div>

      {/* Team Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6 mb-8" data-aos="fade-up" data-aos-delay="200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {teamInfo.headOfTeam.split(' ').map(name => name.charAt(0)).join('')}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{teamInfo.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">Head of Team: {teamInfo.headOfTeam}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{teamInfo.totalMembers}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Members</div>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {statistics && (
        <div className="mb-8">
          <h3 className="responsive-text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Platform Overview</h3>
          <div className="grid-cols-responsive gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Total Jobs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.jobs.total}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{statistics.jobs.active} Active</p>
                </div>
              </div>
            </div>

            {/* Total Candidates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.candidates.total}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Candidates</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">{statistics.candidates.hired} Hired</p>
                </div>
              </div>
            </div>

            {/* Total Assessments */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.assessments.total}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Assessments</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{statistics.assessments.active} Active</p>
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.candidates.inProgress}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">Active Pipeline</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid-cols-responsive-2 gap-4 sm:gap-6">
            {/* Jobs Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Jobs by Status</h4>
              <div className="space-y-3">
                {Object.entries(statistics.jobs.byStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidates Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Candidates by Stage</h4>
              <div className="space-y-3">
                {Object.entries(statistics.candidates.byStage).map(([stage, count]) => (
                  <div key={stage} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{stage}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Grid */}
      <div className="mb-6">
        <h3 className="responsive-text-xl font-semibold text-gray-900 dark:text-white mb-4">Team Members</h3>
        <div className="grid-cols-responsive gap-4 sm:gap-6">
          {employees.map((employee) => (
            <div key={employee.id} className="employee-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-all duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-full h-full rounded-full object-cover border-2 border-primary"
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{employee.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{employee.role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{employee.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Job Modal */}
      {showAddJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl responsive-padding max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Job</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter job title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select className="select select-bordered w-full">
                  <option>Technology</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>HR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows="3"
                  placeholder="Enter job description"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddJob(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
