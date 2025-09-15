import Dexie from 'dexie'
import { seedDatabase } from '../utils/seedData'

// #dexie database setup
class TalentFlowDB extends Dexie {
  constructor() {
    super('TalentFlowDB')
    
    this.version(1).stores({
      jobs: '++id, title, slug, status, createdAt, updatedAt, order',
      candidates: '++id, name, email, stage, jobId, createdAt, updatedAt',
      candidateTimeline: '++id, candidateId, stage, note, createdAt',
      assessments: '++id, jobId, title, questions, createdAt, updatedAt',
      assessmentResponses: '++id, assessmentId, candidateId, responses, submittedAt'
    })
  }
}

export const db = new TalentFlowDB()

// #initialize database with seed data
export const initDexie = async () => {
  try {
    // Check if already seeded
    const jobCount = await db.jobs.count()
    if (jobCount === 0) {
      console.log('Seeding database...')
      await seedDatabase()
      console.log('Database seeded successfully')
    }
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

// #database helper functions
export const dbHelpers = {
  // Jobs
  async getJobs(filters = {}) {
    let query = db.jobs.orderBy('order')
    
    if (filters.status) {
      query = query.filter(job => job.status === filters.status)
    }
    
    if (filters.search) {
      query = query.filter(job => 
        job.title.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    
    return await query.toArray()
  },

  async createJob(jobData) {
    const id = await db.jobs.add({
      ...jobData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return { id, ...jobData }
  },

  async updateJob(id, updates) {
    await db.jobs.update(id, {
      ...updates,
      updatedAt: new Date()
    })
    return await db.jobs.get(id)
  },

  async reorderJobs(jobIds) {
    const jobs = await db.jobs.bulkGet(jobIds)
    const updates = jobs.map((job, index) => ({
      ...job,
      order: index,
      updatedAt: new Date()
    }))
    await db.jobs.bulkPut(updates)
    return updates
  },

  // Candidates
  async getCandidates(filters = {}) {
    let query = db.candidates.orderBy('createdAt')
    
    if (filters.stage) {
      query = query.filter(candidate => candidate.stage === filters.stage)
    }
    
    if (filters.search) {
      query = query.filter(candidate => 
        candidate.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        candidate.email.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    
    return await query.toArray()
  },

  async createCandidate(candidateData) {
    const id = await db.candidates.add({
      ...candidateData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return { id, ...candidateData }
  },

  async updateCandidate(id, updates) {
    await db.candidates.update(id, {
      ...updates,
      updatedAt: new Date()
    })
    return await db.candidates.get(id)
  },

  async getCandidateTimeline(candidateId) {
    return await db.candidateTimeline
      .where('candidateId')
      .equals(candidateId)
      .reverse()
      .toArray()
  },

  async addTimelineEntry(candidateId, stage, note) {
    await db.candidateTimeline.add({
      candidateId,
      stage,
      note,
      createdAt: new Date()
    })
  },

  // Assessments
  async getAssessment(jobId) {
    return await db.assessments.where('jobId').equals(jobId).first()
  },

  async saveAssessment(assessmentData) {
    const existing = await db.assessments.where('jobId').equals(assessmentData.jobId).first()
    
    if (existing) {
      await db.assessments.update(existing.id, {
        ...assessmentData,
        updatedAt: new Date()
      })
      return { id: existing.id, ...assessmentData }
    } else {
      const id = await db.assessments.add({
        ...assessmentData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return { id, ...assessmentData }
    }
  },

  async submitAssessmentResponse(responseData) {
    const id = await db.assessmentResponses.add({
      ...responseData,
      submittedAt: new Date()
    })
    return { id, ...responseData }
  }
}
