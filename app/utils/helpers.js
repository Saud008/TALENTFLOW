// #utility functions
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Enhanced error injection with different error types
export const injectRandomError = (errorRate = 0.1, errorType = 'server') => {
  if (Math.random() >= errorRate) {
    return null
  }
  
  // Different error types for more realistic simulation
  const errorTypes = {
    server: {
      status: 500,
      message: 'Internal server error'
    },
    timeout: {
      status: 408,
      message: 'Request timeout'
    },
    validation: {
      status: 400,
      message: 'Validation error'
    },
    conflict: {
      status: 409,
      message: 'Resource conflict'
    },
    unauthorized: {
      status: 401,
      message: 'Unauthorized access'
    }
  }
  t
  return errorTypes[errorType] || errorTypes.server
}

// Enhanced artificial latency with configurable ranges
export const addArtificialLatency = (min = 200, max = 1200) => {
  const delay = Math.random() * (max - min) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Configuration for different endpoint types
export const getEndpointConfig = (endpointType = 'default') => {
  const configs = {
    default: {
      latency: { min: 200, max: 1200 },
      errorRate: 0.05, // 5%
      errorType: 'server'
    },
    critical: {
      latency: { min: 300, max: 1500 },
      errorRate: 0.08, // 8%
      errorType: 'server'
    },
    reorder: {
      latency: { min: 400, max: 1800 },
      errorRate: 0.10, // 10%
      errorType: 'conflict'
    },
    assessment: {
      latency: { min: 500, max: 2000 },
      errorRate: 0.07, // 7%
      errorType: 'validation'
    }
  }
  
  return configs[endpointType] || configs.default
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0
}

export const validateNumericRange = (value, min, max) => {
  const num = Number(value)
  return !isNaN(num) && num >= min && num <= max
}
