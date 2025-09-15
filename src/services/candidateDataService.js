// Enhanced artificial latency and error injection for candidate operations
const addArtificialLatency = (min = 200, max = 1200) => {
  const delay = Math.random() * (max - min) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

const injectRandomError = (errorRate = 0.05) => {
  return Math.random() < errorRate
}

// Candidate-specific data service for the candidate portal
const candidateDataService = {
  // Helper function to generate avatar URL from name
  generateAvatarUrl: (name, size = 150) => {
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=random&color=fff&bold=true&format=png`;
  },

  // Get candidate profile data
  getCandidateProfile: () => {
    return {
      id: 1,
      firstName: 'Nikhil',
      lastName: 'Sharma',
      email: 'nikhil.sharma@email.com',
      phone: '+91 98765 43210',
      location: 'Bengaluru, Karnataka, India',
      title: 'Frontend Developer',
      bio: 'Experienced frontend developer with 5+ years of experience in React, TypeScript, and modern web technologies. Passionate about creating user-friendly interfaces and solving complex problems.',
      website: 'https://nikhilsharma.dev',
      linkedin: 'https://linkedin.com/in/nikhilsharma',
      github: 'https://github.com/nikhilsharma',
      avatar: 'https://ui-avatars.com/api/?name=Nikhil+Sharma&size=150&background=random&color=fff&bold=true&format=png',
      joinDate: '2024-01-01',
      lastActive: '2024-01-20'
    }
  },

  // Get candidate dashboard stats
  getDashboardStats: () => {
    return {
      applicationsSent: 12,
      interviewsScheduled: 3,
      profileViews: 28,
      savedJobs: 8,
      weeklyApplications: 2,
      weeklyInterviews: 1,
      weeklyViews: 5,
      weeklySaved: 1
    }
  },

  // Get available jobs
  getAvailableJobs: () => {
    return [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$80,000 - $100,000',
        posted: '2 days ago',
        description: 'We are looking for a senior frontend developer to join our growing team. You will be responsible for building and maintaining our web applications using modern technologies.',
        requirements: ['React', 'TypeScript', 'Next.js', '5+ years experience'],
        category: 'Frontend',
        remote: false,
        featured: true,
        companyLogo: 'https://ui-avatars.com/api/?name=TechCorp&size=40&background=random&color=fff&bold=true&format=png'
      },
      {
        id: 2,
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        type: 'Full-time',
        salary: '$70,000 - $90,000',
        posted: '1 week ago',
        description: 'Join our innovative startup as a full stack developer. You will work on both frontend and backend development, collaborating with a small but talented team.',
        requirements: ['React', 'Node.js', 'MongoDB', '3+ years experience'],
        category: 'Full Stack',
        remote: true,
        featured: false,
        companyLogo: 'https://ui-avatars.com/api/?name=StartupXYZ&size=40&background=random&color=fff&bold=true&format=png'
      },
      {
        id: 3,
        title: 'React Developer',
        company: 'BigTech Corp',
        location: 'New York, NY',
        type: 'Contract',
        salary: '$60,000 - $80,000',
        posted: '3 days ago',
        description: 'Contract position for an experienced React developer. You will work on various client projects and have the opportunity to work with cutting-edge technologies.',
        requirements: ['React', 'Redux', 'JavaScript', '2+ years experience'],
        category: 'Frontend',
        remote: false,
        featured: false,
        companyLogo: 'https://ui-avatars.com/api/?name=BigTech&size=40&background=random&color=fff&bold=true&format=png'
      },
      {
        id: 4,
        title: 'Backend Developer',
        company: 'DataFlow Systems',
        location: 'London, UK',
        type: 'Full-time',
        salary: '£50,000 - £70,000',
        posted: '5 days ago',
        description: 'Backend developer position focusing on API development and database management. You will work on scalable systems and data processing pipelines.',
        requirements: ['Python', 'Django', 'PostgreSQL', '4+ years experience'],
        category: 'Backend',
        remote: false,
        featured: true,
        companyLogo: 'https://ui-avatars.com/api/?name=DataFlow&size=40&background=random&color=fff&bold=true&format=png'
      },
      {
        id: 5,
        title: 'DevOps Engineer',
        company: 'CloudTech Solutions',
        location: 'Remote',
        type: 'Full-time',
        salary: '$90,000 - $120,000',
        posted: '1 week ago',
        description: 'DevOps engineer to manage our cloud infrastructure and deployment pipelines. You will work with AWS, Docker, and Kubernetes to ensure reliable deployments.',
        requirements: ['AWS', 'Docker', 'Kubernetes', '5+ years experience'],
        category: 'DevOps',
        remote: true,
        featured: false,
        companyLogo: 'https://ui-avatars.com/api/?name=CloudTech&size=40&background=random&color=fff&bold=true&format=png'
      },
      {
        id: 6,
        title: 'Data Scientist',
        company: 'Analytics Pro',
        location: 'Berlin, Germany',
        type: 'Full-time',
        salary: '€60,000 - €80,000',
        posted: '4 days ago',
        description: 'Data scientist position for machine learning projects and data analysis. You will work with large datasets and build predictive models.',
        requirements: ['Python', 'TensorFlow', 'SQL', '3+ years experience'],
        category: 'Data Science',
        remote: false,
        featured: false,
        companyLogo: 'https://ui-avatars.com/api/?name=Analytics+Pro&size=40&background=random&color=fff&bold=true&format=png'
      }
    ]
  },

  // Get candidate applications
  getCandidateApplications: () => {
    return [
      {
        id: 1,
        jobTitle: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        appliedDate: '2024-01-15',
        status: 'Under Review',
        location: 'San Francisco, CA',
        salary: '$80,000 - $100,000',
        lastUpdate: '2024-01-17',
        notes: 'Application received and being reviewed by HR team',
        jobId: 1
      },
      {
        id: 2,
        jobTitle: 'Full Stack Developer',
        company: 'StartupXYZ',
        appliedDate: '2024-01-12',
        status: 'Interview',
        location: 'Remote',
        salary: '$70,000 - $90,000',
        lastUpdate: '2024-01-16',
        notes: 'Interview scheduled for next week',
        jobId: 2
      },
      {
        id: 3,
        jobTitle: 'React Developer',
        company: 'BigTech Corp',
        appliedDate: '2024-01-10',
        status: 'Rejected',
        location: 'New York, NY',
        salary: '$75,000 - $95,000',
        lastUpdate: '2024-01-14',
        notes: 'Position filled by another candidate',
        jobId: 3
      },
      {
        id: 4,
        jobTitle: 'Frontend Engineer',
        company: 'InnovateLab',
        appliedDate: '2024-01-08',
        status: 'Pending',
        location: 'Austin, TX',
        salary: '$65,000 - $85,000',
        lastUpdate: '2024-01-08',
        notes: 'Application submitted successfully',
        jobId: 7
      },
      {
        id: 5,
        jobTitle: 'Senior React Developer',
        company: 'CloudTech Solutions',
        appliedDate: '2024-01-05',
        status: 'Accepted',
        location: 'Seattle, WA',
        salary: '$90,000 - $110,000',
        lastUpdate: '2024-01-18',
        notes: 'Congratulations! Offer extended',
        jobId: 8
      }
    ]
  },

  // Get candidate experience
  getCandidateExperience: () => {
    return [
      {
        id: 1,
        company: 'TechCorp Inc.',
        position: 'Senior Frontend Developer',
        startDate: '2022-01',
        endDate: 'Present',
        description: 'Led frontend development for multiple products, mentored junior developers, and implemented modern React patterns.',
        location: 'San Francisco, CA'
      },
      {
        id: 2,
        company: 'StartupXYZ',
        position: 'Frontend Developer',
        startDate: '2020-06',
        endDate: '2021-12',
        description: 'Developed responsive web applications using React and Redux, collaborated with design team on UI/UX improvements.',
        location: 'Remote'
      }
    ]
  },

  // Get candidate education
  getCandidateEducation: () => {
    return [
      {
        id: 1,
        institution: 'University of California',
        degree: 'Bachelor of Science in Computer Science',
        year: '2019',
        location: 'Berkeley, CA'
      }
    ]
  },

  // Get candidate skills
  getCandidateSkills: () => {
    return {
      technical: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Git', 'Figma'],
      languages: [
        { name: 'English', level: 'Native' },
        { name: 'Spanish', level: 'Conversational' }
      ]
    }
  },

  // Get candidate settings
  getCandidateSettings: () => {
    return {
      notifications: {
        emailNotifications: true,
        jobAlerts: true,
        applicationUpdates: true,
        weeklyDigest: false,
        marketingEmails: false
      },
      privacy: {
        profileVisibility: 'public',
        showContactInfo: true,
        allowRecruiters: true,
        showSalaryHistory: false
      },
      preferences: {
        jobTypes: ['Full-time', 'Contract'],
        locations: ['Remote', 'San Francisco'],
        salaryRange: { min: 80000, max: 120000 },
        experienceLevel: 'Mid-level',
        industries: ['Technology', 'Fintech', 'Healthcare']
      }
    }
  },

  // Get saved jobs
  getSavedJobs: () => {
    return [
      {
        id: 9,
        title: 'UI/UX Designer',
        company: 'DesignStudio',
        location: 'Los Angeles, CA',
        salary: '$70,000 - $90,000',
        savedDate: '2024-01-18',
        jobId: 9
      },
      {
        id: 10,
        title: 'Product Manager',
        company: 'ProductCorp',
        location: 'Chicago, IL',
        salary: '$100,000 - $130,000',
        savedDate: '2024-01-16',
        jobId: 10
      }
    ]
  },

  // Get job recommendations
  getJobRecommendations: () => {
    return [
      {
        id: 11,
        title: 'Frontend Engineer',
        company: 'TechStart',
        location: 'Remote',
        salary: '$75,000 - $95,000',
        matchScore: 95,
        reason: 'Matches your React and TypeScript skills',
        jobId: 11
      },
      {
        id: 12,
        title: 'Senior React Developer',
        company: 'WebCorp',
        location: 'San Francisco, CA',
        salary: '$85,000 - $105,000',
        matchScore: 88,
        reason: 'Similar to your current role and location preference',
        jobId: 12
      }
    ]
  },

  // Apply to job
  applyToJob: async (jobId) => {
    console.log(`Applying to job ${jobId}`)
    
    // Add artificial latency (300-1500ms for critical operations)
    await addArtificialLatency(300, 1500)
    
    // Inject random error (8% error rate for critical operations)
    if (injectRandomError(0.08)) {
      throw new Error('Failed to submit application. Please try again.')
    }
    
    // In a real app, this would make an API call
    return { success: true, applicationId: Date.now() }
  },

  // Save job
  saveJob: async (jobId) => {
    console.log(`Saving job ${jobId}`)
    
    // Add artificial latency (200-800ms for less critical operations)
    await addArtificialLatency(200, 800)
    
    // Inject random error (5% error rate for less critical operations)
    if (injectRandomError(0.05)) {
      throw new Error('Failed to save job. Please try again.')
    }
    
    // Get current saved jobs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
    
    // Find the job to save
    const allJobs = candidateDataService.getAvailableJobs()
    const jobToSave = allJobs.find(job => job.id === jobId)
    
    if (jobToSave && !savedJobs.find(job => job.id === jobId)) {
      savedJobs.push(jobToSave)
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs))
    }
    
    return { success: true }
  },

  // Update application status
  updateApplicationStatus: (applicationId, status) => {
    console.log(`Updating application ${applicationId} to ${status}`)
    // In a real app, this would make an API call
    return { success: true }
  },

  // Get available assessments
  getAssessments: () => {
    const baseAssessments = [
      {
        id: 1,
        title: 'Aptitude Test',
        description: 'Evaluate your logical reasoning, problem-solving, and analytical thinking skills.',
        duration: 30, // minutes
        questions: 10,
        category: 'General',
        difficulty: 'Intermediate',
        isCompleted: false,
        isRequired: true,
        passingScore: 70
      },
      {
        id: 2,
        title: 'Technical Skills Test',
        description: 'Assess your technical knowledge in programming, algorithms, and system design.',
        duration: 45,
        questions: 15,
        category: 'Technical',
        difficulty: 'Advanced',
        isCompleted: false,
        isRequired: true,
        passingScore: 75
      },
      {
        id: 3,
        title: 'Communication Skills Test',
        description: 'Test your written and verbal communication abilities in professional scenarios.',
        duration: 25,
        questions: 12,
        category: 'Soft Skills',
        difficulty: 'Beginner',
        isCompleted: false,
        isRequired: false,
        passingScore: 65
      }
    ]

    // Check for last session results (temporary completion status)
    return baseAssessments.map(assessment => {
      const lastResult = sessionStorage.getItem(`assessment-last-result-${assessment.id}`)
      if (lastResult) {
        const result = JSON.parse(lastResult)
        return {
          ...assessment,
          isCompleted: true,
          score: result.percentage,
          status: result.status,
          completedDate: result.completedDate
        }
      }
      return assessment
    })
  },

  // Get assessment questions
  getAssessmentQuestions: (assessmentId) => {
    const questionSets = {
      1: [ // Aptitude Test
        {
          id: 1,
          type: 'single-choice',
          question: "If a train travels 120 km in 2 hours, what is its average speed?",
          options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
          correctAnswer: 1
        },
        {
          id: 2,
          type: 'multi-choice',
          question: "Which of the following are prime numbers? (Select all that apply)",
          options: ["2", "4", "7", "9", "11"],
          correctAnswers: [0, 2, 4]
        },
        {
          id: 3,
          type: 'short-text',
          question: "In one word, what is the capital of France?",
          correctAnswer: "Paris",
          maxLength: 50
        },
        {
          id: 4,
          type: 'long-text',
          question: "Explain the concept of compound interest and provide a real-world example.",
          minLength: 100,
          maxLength: 500
        },
        {
          id: 5,
          type: 'numeric',
          question: "What is 15% of 200?",
          correctAnswer: 30,
          range: { min: 0, max: 200 }
        },
        {
          id: 6,
          type: 'file-upload',
          question: "Upload your portfolio or a sample of your work (PDF, DOC, or image files)",
          acceptedTypes: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
          maxSize: '5MB'
        },
        {
          id: 7,
          type: 'single-choice',
          question: "What is the time complexity of binary search?",
          options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
          correctAnswer: 1
        },
        {
          id: 8,
          type: 'numeric',
          question: "How many years of experience do you have in your field?",
          range: { min: 0, max: 50 }
        },
        {
          id: 9,
          type: 'short-text',
          question: "What programming language are you most comfortable with?",
          maxLength: 30
        },
        {
          id: 10,
          type: 'long-text',
          question: "Describe a challenging project you worked on and how you overcame the difficulties.",
          minLength: 150,
          maxLength: 800
        }
      ],
      2: [ // Technical Skills Test
        {
          id: 1,
          question: "What is the time complexity of binary search?",
          options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Which data structure uses LIFO principle?",
          options: ["Queue", "Stack", "Array", "Linked List"],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "What does SQL stand for?",
          options: ["Sequential Query Language", "Structured Query Language", "Simple Query Language", "Standard Query Language"],
          correctAnswer: 1
        },
        {
          id: 4,
          question: "In object-oriented programming, what is inheritance?",
          options: ["Creating multiple objects", "Hiding implementation details", "Acquiring properties from parent class", "Overloading methods"],
          correctAnswer: 2
        },
        {
          id: 5,
          question: "What is the default port for HTTP?",
          options: ["21", "22", "80", "443"],
          correctAnswer: 2
        }
      ],
      3: [ // Communication Skills Test
        {
          id: 1,
          question: "What is the most important aspect of effective communication?",
          options: ["Speaking loudly", "Using complex words", "Active listening", "Talking continuously"],
          correctAnswer: 2
        },
        {
          id: 2,
          question: "Which is an example of non-verbal communication?",
          options: ["Email", "Body language", "Phone call", "Text message"],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "When giving feedback, you should:",
          options: ["Be vague", "Focus on personality", "Be specific and constructive", "Avoid eye contact"],
          correctAnswer: 2
        },
        {
          id: 4,
          question: "What does 'CC' mean in email?",
          options: ["Carbon Copy", "Certified Copy", "Confidential Copy", "Clear Copy"],
          correctAnswer: 0
        },
        {
          id: 5,
          question: "In a presentation, what should you do first?",
          options: ["Start with details", "Introduce yourself and topic", "Show complex charts", "Rush through content"],
          correctAnswer: 1
        }
      ]
    }
    return questionSets[assessmentId] || []
  },

  // Start assessment
  startAssessment: (assessmentId) => {
    console.log(`Starting assessment ${assessmentId}`)
    // In a real app, this would make an API call
    return { success: true, sessionId: Date.now() }
  },

  // Submit assessment
  submitAssessment: async (assessmentId, answers) => {
    console.log(`Submitting assessment ${assessmentId}`)
    
    // Add artificial latency (500-2000ms for assessment operations)
    await addArtificialLatency(500, 2000)
    
    // Inject random error (7% error rate for assessment operations)
    if (injectRandomError(0.07)) {
      throw new Error('Failed to submit assessment. Please try again.')
    }
    
    const questions = candidateDataService.getAssessmentQuestions(assessmentId)
    const assessment = candidateDataService.getAssessments().find(a => a.id === assessmentId)
    
    let correctAnswers = 0
    const results = questions.map((question, index) => {
      const userAnswer = answers[question.id]
      let isCorrect = false
      
      // Handle different question types
      switch (question.type) {
        case 'single-choice':
        case undefined: // Legacy MCQ questions
          isCorrect = userAnswer === question.correctAnswer
          break
        case 'multi-choice':
          // Compare arrays
          const correctAnswers = question.correctAnswers || []
          const userAnswers = userAnswer || []
          isCorrect = correctAnswers.length === userAnswers.length && 
                     correctAnswers.every(answer => userAnswers.includes(answer))
          break
        case 'short-text':
          isCorrect = userAnswer && question.correctAnswer && 
                     userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
          break
        case 'long-text':
          // For long text, just mark as answered (no auto-grading)
          isCorrect = userAnswer && userAnswer.trim().length >= (question.minLength || 0)
          break
        case 'numeric':
          isCorrect = userAnswer === question.correctAnswer
          break
        case 'file-upload':
          // For file upload, just mark as answered
          isCorrect = userAnswer instanceof File || (userAnswer && userAnswer.name)
          break
        default:
          isCorrect = userAnswer === question.correctAnswer
      }
      
      if (isCorrect) correctAnswers++
      
      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer || question.correctAnswers,
        isCorrect,
        options: question.options,
        type: question.type
      }
    })
    
    const totalQuestions = questions.length
    const wrongAnswers = totalQuestions - correctAnswers
    const percentage = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = percentage >= (assessment?.passingScore || 70)
    
    const resultData = {
      assessmentId,
      assessmentTitle: assessment?.title || 'Assessment',
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      percentage,
      passed,
      status: passed ? 'Passed' : 'Failed',
      completedDate: new Date().toISOString().split('T')[0],
      detailedResults: results
    }

    // Store result in sessionStorage (will be cleared on page refresh)
    sessionStorage.setItem(`assessment-last-result-${assessmentId}`, JSON.stringify(resultData))

    return {
      success: true,
      results: resultData
    }
  }
}

export default candidateDataService
