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
    return dataService.get('talentflow-jobs', [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        status: 'Active',
        createdDate: '2024-01-15'
      },
      {
        id: 2,
        title: 'Product Manager',
        department: 'Product',
        status: 'Active',
        createdDate: '2024-01-10'
      },
      {
        id: 3,
        title: 'UX Designer',
        department: 'Design',
        status: 'Archived',
        createdDate: '2024-01-05'
      },
      {
        id: 4,
        title: 'DevOps Engineer',
        department: 'Engineering',
        status: 'Active',
        createdDate: '2024-01-20'
      }
    ])
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

  // Candidates operations
  getCandidates: () => {
    return dataService.get('talentflow-candidates', [
      {
        id: 1,
        name: 'Rohit Sharma',
        email: 'rohit.sharma@email.com',
        phone: '+91 98765 43210',
        appliedJob: 'Senior Data Scientist',
        stage: 'Interview',
        avatar: dataService.generateAvatarUrl('Rohit Sharma'),
        experience: '7 years',
        location: 'Bengaluru, Karnataka, India',
        resume: 'rohit_sharma_resume.pdf',
        appliedDate: '2024-03-25',
        lastContact: '2024-04-05'
      },
      {
        id: 2,
        name: 'Rajesh Agarwal',
        email: 'rajesh.agarwal@email.com',
        phone: '+1 (555) 234-5678',
        appliedJob: 'Product Manager',
        stage: 'Applied',
        avatar: dataService.generateAvatarUrl('Rajesh Agarwal'),
        experience: '7 years',
        location: 'New York, NY',
        resume: 'rajesh_agarwal_resume.pdf',
        appliedDate: '2024-01-12',
        lastContact: '2024-01-12'
      },
      {
        id: 3,
        name: 'Karan Joshi',
        email: 'karan.joshi@email.com',
        phone: '+1 (555) 345-6789',
        appliedJob: 'UX Designer',
        stage: 'Hired',
        avatar: dataService.generateAvatarUrl('Karan Joshi'),
        experience: '4 years',
        location: 'Austin, TX',
        resume: 'karan_joshi_resume.pdf',
        appliedDate: '2024-01-08',
        lastContact: '2024-01-22'
      },
      {
        id: 4,
        name: 'Vikash Reddy',
        email: 'vikash.reddy@email.com',
        phone: '+1 (555) 456-7890',
        appliedJob: 'DevOps Engineer',
        stage: 'Interview',
        avatar: dataService.generateAvatarUrl('Vikash Reddy'),
        experience: '6 years',
        location: 'Seattle, WA',
        resume: 'vikash_reddy_resume.pdf',
        appliedDate: '2024-01-18',
        lastContact: '2024-01-21'
      },
      {
        id: 5,
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+1 (555) 567-8901',
        appliedJob: 'Senior Frontend Developer',
        stage: 'Applied',
        avatar: dataService.generateAvatarUrl('Priya Sharma'),
        experience: '3 years',
        location: 'Los Angeles, CA',
        resume: 'priya_sharma_resume.pdf',
        appliedDate: '2024-01-20',
        lastContact: '2024-01-20'
      },
      {
        id: 6,
        name: 'Rohit Malhotra',
        email: 'rohit.malhotra@email.com',
        phone: '+1 (555) 678-9012',
        appliedJob: 'Product Manager',
        stage: 'Hired',
        avatar: dataService.generateAvatarUrl('Rohit Malhotra'),
        experience: '8 years',
        location: 'Chicago, IL',
        resume: 'rohit_malhotra_resume.pdf',
        appliedDate: '2024-01-05',
        lastContact: '2024-01-23'
      },
      {
        id: 7,
        name: 'Sneha Iyer',
        email: 'sneha.iyer@email.com',
        phone: '+1 (555) 789-0123',
        appliedJob: 'HR Specialist',
        stage: 'Interview',
        avatar: dataService.generateAvatarUrl('Sneha Iyer'),
        experience: '4 years',
        location: 'Boston, MA',
        resume: 'sneha_iyer_resume.pdf',
        appliedDate: '2024-01-10',
        lastContact: '2024-01-19'
      },
      {
        id: 8,
        name: 'Vikram Nair',
        email: 'vikram.nair@email.com',
        phone: '+1 (555) 890-1234',
        appliedJob: 'Data Analyst',
        stage: 'Applied',
        avatar: dataService.generateAvatarUrl('Vikram Nair'),
        experience: '5 years',
        location: 'Denver, CO',
        resume: 'vikram_nair_resume.pdf',
        appliedDate: '2024-01-14',
        lastContact: '2024-01-14'
      }
    ])
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
    return dataService.get('talentflow-assessments', [
      {
        id: 1,
        title: 'Frontend Developer Assessment',
        job: 'Senior Frontend Developer',
        questionsCount: 15,
        duration: '60 minutes',
        difficulty: 'Intermediate',
        status: 'Active',
        createdDate: '2024-01-15',
        lastModified: '2024-01-20',
        description: 'This assessment evaluates candidates on their frontend development skills including React, JavaScript, CSS, and problem-solving abilities.',
        skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Problem Solving'],
        questions: [
          {
            id: 1,
            type: 'Multiple Choice',
            question: 'What is the correct way to create a functional component in React?',
            points: 5
          },
          {
            id: 2,
            type: 'Coding',
            question: 'Write a function to reverse a string in JavaScript.',
            points: 10
          },
          {
            id: 3,
            type: 'Multiple Choice',
            question: 'Which CSS property is used to change the text color?',
            points: 5
          }
        ]
      },
      {
        id: 2,
        title: 'Product Management Test',
        job: 'Product Manager',
        questionsCount: 20,
        duration: '90 minutes',
        difficulty: 'Intermediate',
        status: 'Active',
        createdDate: '2024-01-10',
        lastModified: '2024-01-15',
        description: 'Comprehensive test covering product strategy, user research, and market analysis.',
        skills: ['Product Strategy', 'User Research', 'Market Analysis', 'Data Analysis'],
        questions: []
      },
      {
        id: 3,
        title: 'UX Design Challenge',
        job: 'UX Designer',
        questionsCount: 12,
        duration: '45 minutes',
        difficulty: 'Easy',
        status: 'Draft',
        createdDate: '2024-01-05',
        lastModified: '2024-01-05',
        description: 'Design thinking and user experience evaluation.',
        skills: ['Design Thinking', 'User Research', 'Prototyping', 'Usability Testing'],
        questions: []
      },
      {
        id: 4,
        title: 'DevOps Technical Assessment',
        job: 'DevOps Engineer',
        questionsCount: 18,
        duration: '75 minutes',
        difficulty: 'Hard',
        status: 'Active',
        createdDate: '2024-01-20',
        lastModified: '2024-01-22',
        description: 'Technical assessment covering CI/CD, cloud platforms, and infrastructure.',
        skills: ['CI/CD', 'AWS', 'Docker', 'Kubernetes', 'Monitoring'],
        questions: []
      }
    ])
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
        name: 'Saud Masud',
        email: 'saud.masud@talentflow.com',
        role: 'Administrator',
        avatar: dataService.generateAvatarUrl('Saud Masud'),
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
