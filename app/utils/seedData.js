import { db } from '../services/dexie'
import { CANDIDATE_STAGES, JOB_STATUSES, QUESTION_TYPES, SEED_CONFIG } from './constants'

// #seed data generation
const jobTitles = [
  'Senior Frontend Developer', 'Full Stack Engineer', 'DevOps Engineer',
  'Product Manager', 'UX Designer', 'Data Scientist', 'Backend Developer',
  'Mobile App Developer', 'QA Engineer', 'Technical Lead',
  'Marketing Manager', 'Sales Representative', 'Customer Success Manager',
  'Content Writer', 'Graphic Designer', 'HR Specialist', 'Finance Analyst',
  'Business Analyst', 'Project Manager', 'System Administrator',
  'Security Engineer', 'Cloud Architect', 'Machine Learning Engineer',
  'UI/UX Designer', 'Digital Marketing Specialist'
]

const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica',
  'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Jennifer', 'Daniel',
  'Lisa', 'Matthew', 'Nancy', 'Anthony', 'Karen', 'Mark', 'Betty', 'Donald',
  'Helen', 'Steven', 'Sandra', 'Paul', 'Donna', 'Andrew', 'Carol', 'Joshua',
  'Ruth', 'Kenneth', 'Sharon', 'Kevin', 'Michelle', 'Brian', 'Laura', 'George',
  'Sarah', 'Timothy', 'Kimberly', 'Ronald', 'Deborah', 'Jason', 'Dorothy'
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
]

const companies = [
  'TechCorp', 'InnovateLab', 'DataFlow', 'CloudTech', 'NextGen', 'FutureSoft',
  'DigitalWorks', 'CodeCraft', 'AppBuilder', 'WebSolutions', 'SmartSystems',
  'CyberGuard', 'AIFirst', 'BlockChain Pro', 'QuantumLeap', 'NeuralNet',
  'RoboTech', 'VirtualReality Inc', 'AugmentedWorld', 'IoT Solutions'
]

const skills = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'Vue.js',
  'Angular', 'Express', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
  'Git', 'Agile', 'Scrum', 'Figma', 'Photoshop', 'Illustrator', 'SQL',
  'Machine Learning', 'Data Analysis', 'Project Management', 'Leadership'
]

// #generate random data
const generateJob = (index) => {
  const title = jobTitles[index % jobTitles.length]
  const company = companies[Math.floor(Math.random() * companies.length)]
  const statuses = Object.values(JOB_STATUSES)
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  
  return {
    title: `${title} at ${company}`,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    description: `We are looking for a talented ${title} to join our team at ${company}. This role involves working on cutting-edge projects and collaborating with a dynamic team.`,
    status,
    tags: skills.slice(0, Math.floor(Math.random() * 5) + 3),
    location: ['Remote', 'New York', 'San Francisco', 'London', 'Berlin'][Math.floor(Math.random() * 5)],
    salary: `${Math.floor(Math.random() * 100) + 50}k - ${Math.floor(Math.random() * 100) + 150}k`,
    order: index
  }
}

const generateCandidate = (index) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const stages = Object.values(CANDIDATE_STAGES)
  const stage = stages[Math.floor(Math.random() * stages.length)]
  
  return {
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    stage,
    jobId: Math.floor(Math.random() * SEED_CONFIG.JOBS_COUNT) + 1,
    experience: Math.floor(Math.random() * 10) + 1,
    skills: skills.slice(0, Math.floor(Math.random() * 8) + 3),
    resume: `resume_${firstName}_${lastName}.pdf`,
    notes: Math.random() > 0.7 ? `Strong candidate with ${Math.floor(Math.random() * 5) + 3} years experience` : null
  }
}

const generateQuestion = (index, type) => {
  const baseQuestion = {
    id: `q${index}`,
    type,
    required: Math.random() > 0.3,
    order: index
  }

  switch (type) {
    case QUESTION_TYPES.SINGLE_CHOICE:
      return {
        ...baseQuestion,
        question: `What is your preferred programming language?`,
        options: ['JavaScript', 'Python', 'Java', 'C++', 'Other'],
        correctAnswer: 'JavaScript'
      }
    
    case QUESTION_TYPES.MULTI_CHOICE:
      return {
        ...baseQuestion,
        question: `Which technologies have you worked with?`,
        options: ['React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'MongoDB'],
        correctAnswers: ['React', 'Node.js']
      }
    
    case QUESTION_TYPES.SHORT_TEXT:
      return {
        ...baseQuestion,
        question: `What is your current job title?`,
        maxLength: 100
      }
    
    case QUESTION_TYPES.LONG_TEXT:
      return {
        ...baseQuestion,
        question: `Describe your experience with web development`,
        maxLength: 500
      }
    
    case QUESTION_TYPES.NUMERIC:
      return {
        ...baseQuestion,
        question: `How many years of experience do you have?`,
        min: 0,
        max: 20
      }
    
    case QUESTION_TYPES.FILE_UPLOAD:
      return {
        ...baseQuestion,
        question: `Upload your portfolio`,
        acceptedTypes: ['.pdf', '.doc', '.docx'],
        maxSize: 10485760 // 10MB
      }
    
    default:
      return baseQuestion
  }
}

const generateAssessment = (jobId) => {
  const questionTypes = Object.values(QUESTION_TYPES)
  const questions = []
  
  for (let i = 1; i <= SEED_CONFIG.QUESTIONS_PER_ASSESSMENT; i++) {
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]
    questions.push(generateQuestion(i, type))
  }
  
  return {
    jobId,
    title: `Assessment for Job ${jobId}`,
    description: 'Please complete this assessment to evaluate your skills and experience.',
    questions,
    timeLimit: 60, // minutes
    passingScore: 70
  }
}

// #main seed function
export const seedDatabase = async () => {
  try {
    // #seed jobs
    const jobs = []
    for (let i = 0; i < SEED_CONFIG.JOBS_COUNT; i++) {
      jobs.push(generateJob(i + 1))
    }
    await db.jobs.bulkAdd(jobs)
    
    // #seed candidates
    const candidates = []
    for (let i = 0; i < SEED_CONFIG.CANDIDATES_COUNT; i++) {
      candidates.push(generateCandidate(i + 1))
    }
    await db.candidates.bulkAdd(candidates)
    
    // #seed candidate timeline entries
    const timelineEntries = []
    for (const candidate of candidates) {
      const entryCount = Math.floor(Math.random() * 5) + 1
      for (let i = 0; i < entryCount; i++) {
        timelineEntries.push({
          candidateId: candidate.id,
          stage: candidate.stage,
          note: `Moved to ${candidate.stage} stage`,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        })
      }
    }
    await db.candidateTimeline.bulkAdd(timelineEntries)
    
    // #seed assessments
    const assessments = []
    for (let i = 0; i < SEED_CONFIG.ASSESSMENTS_COUNT; i++) {
      const jobId = Math.floor(Math.random() * SEED_CONFIG.JOBS_COUNT) + 1
      assessments.push(generateAssessment(jobId))
    }
    await db.assessments.bulkAdd(assessments)
    
    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}
