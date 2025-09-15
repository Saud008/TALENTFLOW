// Import mock data
import mockData from '../data/mockData.json'
import candidatesData from '../data/candidatesData.json'
import allCandidatesData from '../data/allCandidatesData.json'
import complete1000Candidates from '../data/complete1000Candidates.json'

// Data service for localStorage operations
export const dataService = {
  // Generic localStorage operations
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error)
      return defaultValue
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error)
      return false
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
      return false
    }
  },

  // Helper function to generate avatar URL from name
  generateAvatarUrl: (name, size = 150) => {
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=random&color=fff&bold=true&format=png`;
  },

  // Jobs operations
  getJobs: () => {
    return dataService.get('talentflow-jobs', mockData.jobs)
  },

  saveJobs: (jobs) => {
    return dataService.set('talentflow-jobs', jobs)
  },

  addJob: (job) => {
    const jobs = dataService.getJobs()
    const newJob = {
      ...job,
      id: Date.now(),
      createdDate: new Date().toISOString().split('T')[0]
    }
    jobs.push(newJob)
    dataService.saveJobs(jobs)
    return newJob
  },

  updateJob: (id, updates) => {
    const jobs = dataService.getJobs()
    const index = jobs.findIndex(job => job.id === id)
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updates }
      dataService.saveJobs(jobs)
      return jobs[index]
    }
    return null
  },

  deleteJob: (id) => {
    const jobs = dataService.getJobs()
    const filteredJobs = jobs.filter(job => job.id !== id)
    dataService.saveJobs(filteredJobs)
    return true
  },

  // Archive/Unarchive job
  archiveJob: (id) => {
    return dataService.updateJob(id, { status: 'Archived' })
  },

  unarchiveJob: (id) => {
    return dataService.updateJob(id, { status: 'Active' })
  },

  // Reorder jobs
  reorderJobs: (reorderedJobs) => {
    dataService.saveJobs(reorderedJobs)
    return true
  },

  // Candidates operations
  // Generate complete 1000 candidates dataset
  generateComplete1000Candidates: () => {
    const names = [
      "Dipti Chauhan", "Priya Raina", "Naman Sinha", "Chirag Deshmukh", "Swati Rajput",
      "Aditi Malhotra", "Charu Dubey", "Rachna Sethi", "Rohit Bansal", "Shubham Malhotra",
      "Varun Saxena", "Harshit Ghosh", "Pankaj Kaul", "Tanvi Sethi", "Priya Deshpande",
      "Rachna Sinha", "Chirag Pathak", "Snehal Mehta", "Sanjana Verma", "Bhavna Jha",
      "Shruti Deshpande", "Krish Deshmukh", "Yash Chopra", "Arjun Rawat", "Meera Ali",
      "Aayushi Khatri", "Varun Chauhan", "Trisha Sethi", "Rachna Tiwari", "Parth Pathak",
      "Anmol Khatri", "Krish Deshmukh", "Arjun Ghosh", "Pankaj Mishra", "Priya Pathak",
      "Tanvi Kohli", "Aarav Bansal", "Kavya Ghosh", "Sneha Ali", "Trisha Menon",
      "Ishita Khatri", "Aayushi Nair", "Arjun Bhatia", "Rahul Agrawal", "Manish Kaul",
      "Rekha Yadav", "Siddharth Rajput", "Vivek Deshmukh", "Akanksha Sinha", "Varun Iyer"
    ]
    
    const jobs = [
      "Software Engineer", "Frontend Developer", "Backend Developer", "Data Analyst", "UI/UX Designer",
      "Product Manager", "HR Specialist", "Mobile App Developer", "QA Tester", "Machine Learning Engineer",
      "Content Writer", "Cybersecurity Analyst", "Cloud Engineer", "Business Analyst", "Sales Associate",
      "Database Administrator", "Technical Support", "DevOps Engineer", "Marketing Executive", "Finance Analyst",
      "Customer Success Manager", "Operations Manager", "Graphic Designer", "SEO Specialist", "Project Manager"
    ]
    
    const stages = ["Screening", "Interview", "Offer", "Hired", "Archived"]
    const locations = [
      "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", 
      "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal", "Visakhapatnam", "Patna",
      "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot"
    ]
    
    const skillSets = [
      ["JavaScript", "React", "Node.js"], ["Python", "Django", "PostgreSQL"], ["Java", "Spring", "MySQL"],
      ["AWS", "Docker", "Kubernetes"], ["Machine Learning", "TensorFlow", "Python"], ["UI/UX", "Figma", "Adobe XD"],
      ["Project Management", "Agile", "Scrum"], ["Sales", "CRM", "Communication"], ["HR", "Recruitment", "HRIS"],
      ["Finance", "Excel", "SAP"], ["Marketing", "SEO", "Google Analytics"], ["DevOps", "CI/CD", "Jenkins"],
      ["QA", "Selenium", "Testing"], ["Content Writing", "SEO", "WordPress"], ["Cybersecurity", "Penetration Testing"],
      ["Cloud Computing", "AWS", "Azure"], ["Data Analysis", "SQL", "Tableau"], ["Mobile Development", "React Native", "Flutter"],
      ["Backend Development", "Node.js", "MongoDB"], ["Frontend Development", "React", "Vue.js"]
    ]

    const candidates = []
    
    for (let i = 1; i <= 1000; i++) {
      const nameIndex = (i - 1) % names.length
      const baseName = names[nameIndex]
      const name = i <= names.length ? baseName : `${baseName} ${Math.ceil(i / names.length)}`
      
      candidates.push({
        id: i,
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}${i > names.length ? i : ''}@email.com`,
        phone: `+91 98765 ${(43210 + i).toString().padStart(5, '0')}`,
        appliedJob: jobs[(i - 1) % jobs.length],
        stage: stages[(i - 1) % stages.length],
        experience: Math.floor(Math.random() * 8) + 1,
        location: locations[(i - 1) % locations.length],
        skills: skillSets[(i - 1) % skillSets.length],
        resumeScore: Math.floor(Math.random() * 30) + 70, // 70-99 range
        appliedDate: new Date(2024, 0, Math.floor(Math.random() * 365)).toISOString().split('T')[0]
      })
    }
    
    return candidates
  },

  getCandidates: (page = 1, limit = 50, filters = {}) => {
    // Generate all 1000 candidates
    let allCandidates = dataService.generateComplete1000Candidates()
    
    // Add avatar URLs
    allCandidates = allCandidates.map(candidate => ({
      ...candidate,
      avatar: dataService.generateAvatarUrl(candidate.name),
      lastContact: candidate.appliedDate
    }))
    
    // Apply filters
    if (filters.stage) {
      allCandidates = allCandidates.filter(candidate => candidate.stage === filters.stage)
    }
    if (filters.job) {
      allCandidates = allCandidates.filter(candidate => candidate.appliedJob.toLowerCase().includes(filters.job.toLowerCase()))
    }
    if (filters.location) {
      allCandidates = allCandidates.filter(candidate => candidate.location.toLowerCase().includes(filters.location.toLowerCase()))
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCandidates = allCandidates.slice(startIndex, endIndex)
    
    return {
      candidates: paginatedCandidates,
      totalCount: allCandidates.length,
      currentPage: page,
      totalPages: Math.ceil(allCandidates.length / limit),
      hasNextPage: endIndex < allCandidates.length,
      hasPrevPage: page > 1
    }
  },

  // Get all candidates without pagination (for statistics)
  getAllCandidates: () => {
    let allCandidates = dataService.generateComplete1000Candidates()
    return allCandidates.map(candidate => ({
      ...candidate,
      avatar: dataService.generateAvatarUrl(candidate.name),
      lastContact: candidate.appliedDate
    }))
  },

  // Get dashboard statistics
  getStatistics: () => {
    const jobs = dataService.getJobs()
    const candidates = dataService.getAllCandidates()
    const assessments = dataService.getAssessments()

    const activeJobs = jobs.filter(job => job.status === 'Active').length
    const totalJobs = jobs.length
    const totalCandidates = candidates.length
    const totalAssessments = assessments.length
    
    const candidatesByStage = candidates.reduce((acc, candidate) => {
      acc[candidate.stage] = (acc[candidate.stage] || 0) + 1
      return acc
    }, {})

    const jobsByStatus = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1
      return acc
    }, {})

    return {
      jobs: {
        total: totalJobs,
        active: activeJobs,
        archived: totalJobs - activeJobs,
        byStatus: jobsByStatus
      },
      candidates: {
        total: totalCandidates,
        byStage: candidatesByStage,
        hired: candidatesByStage.Hired || 0,
        inProgress: (candidatesByStage.Screening || 0) + (candidatesByStage.Interview || 0) + (candidatesByStage.Offer || 0)
      },
      assessments: {
        total: totalAssessments,
        active: assessments.filter(a => a.status === 'Active').length,
        draft: assessments.filter(a => a.status === 'Draft').length
      }
    }
  },

  saveCandidates: (candidates) => {
    return dataService.set('talentflow-candidates', candidates)
  },

  updateCandidate: (id, updates) => {
    const candidates = dataService.getCandidates()
    const index = candidates.findIndex(candidate => candidate.id === id)
    if (index !== -1) {
      candidates[index] = { ...candidates[index], ...updates }
      dataService.saveCandidates(candidates)
      return candidates[index]
    }
    return null
  },

  // Candidate notes operations
  getCandidateNotes: (candidateId) => {
    return dataService.get(`talentflow-candidate-notes-${candidateId}`, [
      {
        id: 1,
        text: 'Initial screening successful. Strong analytical and problem-solving skills identified.',
        author: 'Priya Singh',
        date: '2024-03-29',
        time: '10:30 AM'
      },
      {
        id: 2,
        text: 'Technical interview with lead data scientist scheduled for next week.',
        author: 'Ankit Kumar',
        date: '2024-03-28',
        time: '2:15 PM'
      }
    ])
  },

  saveCandidateNotes: (candidateId, notes) => {
    return dataService.set(`talentflow-candidate-notes-${candidateId}`, notes)
  },

  addCandidateNote: (candidateId, note) => {
    const notes = dataService.getCandidateNotes(candidateId)
    const newNote = {
      ...note,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    notes.unshift(newNote)
    dataService.saveCandidateNotes(candidateId, notes)
    return newNote
  },

  deleteCandidateNote: (candidateId, noteId) => {
    const notes = dataService.getCandidateNotes(candidateId)
    const filteredNotes = notes.filter(note => note.id !== noteId)
    dataService.saveCandidateNotes(candidateId, filteredNotes)
    return true
  },

  // Assessments operations
  getAssessments: () => {
    return dataService.get('talentflow-assessments', mockData.assessments)
  },

  saveAssessments: (assessments) => {
    return dataService.set('talentflow-assessments', assessments)
  },

  addAssessment: (assessment) => {
    const assessments = dataService.getAssessments()
    const newAssessment = {
      ...assessment,
      id: Date.now(),
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      status: 'Draft'
    }
    assessments.push(newAssessment)
    dataService.saveAssessments(assessments)
    return newAssessment
  },

  updateAssessment: (id, updates) => {
    const assessments = dataService.getAssessments()
    const index = assessments.findIndex(assessment => assessment.id === id)
    if (index !== -1) {
      assessments[index] = { 
        ...assessments[index], 
        ...updates,
        lastModified: new Date().toISOString().split('T')[0]
      }
      dataService.saveAssessments(assessments)
      return assessments[index]
    }
    return null
  },

  deleteAssessment: (id) => {
    const assessments = dataService.getAssessments()
    const filteredAssessments = assessments.filter(assessment => assessment.id !== id)
    dataService.saveAssessments(filteredAssessments)
    return true
  },

  // Settings operations
  getSettings: () => {
    return dataService.get('talentflow-settings', {
      profile: {
        name: 'Saud Masaud',
        email: 'saud.masaud@talentflow.com',
        role: 'Administrator',
        avatar: dataService.generateAvatarUrl('Saud Masaud'),
        joinDate: '2024-01-01'
      },
      preferences: {
        theme: 'light',
        notifications: true,
        emailUpdates: true,
        timezone: 'UTC-8 (Pacific Time)',
        language: 'English'
      }
    })
  },

  saveSettings: (settings) => {
    return dataService.set('talentflow-settings', settings)
  },

  updateSettings: (updates) => {
    const settings = dataService.getSettings()
    const updatedSettings = {
      ...settings,
      ...updates
    }
    dataService.saveSettings(updatedSettings)
    return updatedSettings
  }
}
