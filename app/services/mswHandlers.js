import { http, HttpResponse } from 'msw'
import { addArtificialLatency, injectRandomError, getEndpointConfig } from '../utils/helpers'
import { dbHelpers } from './dexie'

// #msw handlers for api simulation
export const handlers = [
  // Jobs endpoints
  http.get('/jobs', async ({ request }) => {
    await addArtificialLatency()
    
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || ''
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    
    const jobs = await dbHelpers.getJobs({ search, status })
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedJobs = jobs.slice(start, end)
    
    return HttpResponse.json({
      data: paginatedJobs,
      pagination: {
        page,
        pageSize,
        total: jobs.length,
        totalPages: Math.ceil(jobs.length / pageSize)
      }
    })
  }),

  http.post('/jobs', async ({ request }) => {
    const config = getEndpointConfig('critical')
    await addArtificialLatency(config.latency.min, config.latency.max)
    
    const error = injectRandomError(config.errorRate, config.errorType)
    if (error) {
      return HttpResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    const jobData = await request.json()
    const job = await dbHelpers.createJob(jobData)
    
    return HttpResponse.json(job, { status: 201 })
  }),

  http.patch('/jobs/:id', async ({ request, params }) => {
    const config = getEndpointConfig('critical')
    await addArtificialLatency(config.latency.min, config.latency.max)
    
    const error = injectRandomError(config.errorRate, config.errorType)
    if (error) {
      return HttpResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    const updates = await request.json()
    const job = await dbHelpers.updateJob(parseInt(params.id), updates)
    
    return HttpResponse.json(job)
  }),

  http.patch('/jobs/:id/reorder', async ({ request, params }) => {
    const config = getEndpointConfig('reorder')
    await addArtificialLatency(config.latency.min, config.latency.max)
    
    const error = injectRandomError(config.errorRate, config.errorType)
    if (error) {
      return HttpResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    const { jobIds } = await request.json()
    const jobs = await dbHelpers.reorderJobs(jobIds)
    
    return HttpResponse.json(jobs)
  }),

  // Candidates endpoints
  http.get('/candidates', async ({ request }) => {
    await addArtificialLatency()
    
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const stage = url.searchParams.get('stage') || ''
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    
    const candidates = await dbHelpers.getCandidates({ search, stage })
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedCandidates = candidates.slice(start, end)
    
    return HttpResponse.json({
      data: paginatedCandidates,
      pagination: {
        page,
        pageSize,
        total: candidates.length,
        totalPages: Math.ceil(candidates.length / pageSize)
      }
    })
  }),

  http.post('/candidates', async ({ request }) => {
    const config = getEndpointConfig('critical')
    await addArtificialLatency(config.latency.min, config.latency.max)
    
    const error = injectRandomError(config.errorRate, config.errorType)
    if (error) {
      return HttpResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    const candidateData = await request.json()
    const candidate = await dbHelpers.createCandidate(candidateData)
    
    return HttpResponse.json(candidate, { status: 201 })
  }),

  http.patch('/candidates/:id', async ({ request, params }) => {
    const config = getEndpointConfig('critical')
    await addArtificialLatency(config.latency.min, config.latency.max)
    
    const error = injectRandomError(config.errorRate, config.errorType)
    if (error) {
      return HttpResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    const updates = await request.json()
    const candidate = await dbHelpers.updateCandidate(parseInt(params.id), updates)
    
    // #add timeline entry for stage changes
    if (updates.stage) {
      await dbHelpers.addTimelineEntry(parseInt(params.id), updates.stage, 'Stage updated')
    }
    
    return HttpResponse.json(candidate)
  }),

  http.get('/candidates/:id/timeline', async ({ params }) => {
    await addArtificialLatency()
    
    const timeline = await dbHelpers.getCandidateTimeline(parseInt(params.id))
    
    return HttpResponse.json(timeline)
  }),

  // Assessments endpoints
  http.get('/assessments/:jobId', async ({ params }) => {
    await addArtificialLatency()
    
    const assessment = await dbHelpers.getAssessment(parseInt(params.jobId))
    
    return HttpResponse.json(assessment || null)
  }),

  http.put('/assessments/:jobId', async ({ request, params }) => {
    const config = getEndpointConfig('assessment')
    await addArtificialLatency(config.latency.min, config.latency.max)
    
    const error = injectRandomError(config.errorRate, config.errorType)
    if (error) {
      return HttpResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    const assessmentData = await request.json()
    const assessment = await dbHelpers.saveAssessment({
      ...assessmentData,
      jobId: parseInt(params.jobId)
    })
    
    return HttpResponse.json(assessment)
  }),

  http.post('/assessments/:jobId/submit', async ({ request, params }) => {
    const config = getEndpointConfig('assessment')
    await addArtificialLatency(config.latency.min, config.latency.max)
    
    const error = injectRandomError(config.errorRate, config.errorType)
    if (error) {
      return HttpResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    const responseData = await request.json()
    const response = await dbHelpers.submitAssessmentResponse({
      ...responseData,
      assessmentId: parseInt(params.jobId)
    })
    
    return HttpResponse.json(response, { status: 201 })
  })
]

// #setup msw
export const setupMSW = async () => {
  if (typeof window !== 'undefined') {
    const { setupWorker } = await import('msw/browser')
    const worker = setupWorker(...handlers)
    await worker.start({
      onUnhandledRequest: 'bypass'
    })
    console.log('MSW started')
  }
}
