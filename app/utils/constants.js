// #application constants
export const API_BASE_URL = '/api'
export const MSW_BASE_URL = ''

export const JOB_STATUSES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  ARCHIVED: 'archived'
}

export const CANDIDATE_STAGES = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  ASSESSMENT: 'assessment',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected'
}

export const QUESTION_TYPES = {
  SINGLE_CHOICE: 'single_choice',
  MULTI_CHOICE: 'multi_choice',
  SHORT_TEXT: 'short_text',
  LONG_TEXT: 'long_text',
  NUMERIC: 'numeric',
  FILE_UPLOAD: 'file_upload'
}

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
}

export const SEED_CONFIG = {
  JOBS_COUNT: 25,
  CANDIDATES_COUNT: 1000,
  ASSESSMENTS_COUNT: 3,
  QUESTIONS_PER_ASSESSMENT: 10
}
