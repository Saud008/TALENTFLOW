import { useState } from 'react'

const AdminDashboard = () => {
  const [showAddJob, setShowAddJob] = useState(false)

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Structure</h1>
        <p className="text-gray-600">Manage your team and organizational structure</p>
      </div>

      {/* Top Bar with Department Info and Add Job Button */}
      <div className="bg-white rounded-xl shadow-sm border border-base-300 p-6 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 green-gradient rounded-lg flex items-center justify-center text-white font-bold text-xl">
              {teamInfo.department.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{teamInfo.department} Department</h2>
              <p className="text-gray-600">{teamInfo.totalMembers} team members</p>
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
      <div className="team-card rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <img
                src={teamInfo.headAvatar}
                alt={teamInfo.headOfTeam}
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{teamInfo.name}</h3>
              <p className="text-gray-600">Head of Team: {teamInfo.headOfTeam}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{teamInfo.totalMembers}</div>
            <div className="text-sm text-gray-600">Members</div>
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Team Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
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
