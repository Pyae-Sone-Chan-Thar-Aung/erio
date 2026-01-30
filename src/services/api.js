// API Service for ERIO Dashboard
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('adminToken')
}

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || 'Request failed')
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    if (response.token) {
      localStorage.setItem('adminToken', response.token)
      localStorage.setItem('adminEmail', response.admin.email)
    }
    return response
  },
  
  verify: async () => {
    return apiRequest('/auth/verify')
  },
  
  logout: () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
  }
}

// Dashboard Stats API
export const dashboardAPI = {
  getStats: async () => {
    return apiRequest('/dashboard/stats')
  },
  
  updateStats: async (stats) => {
    return apiRequest('/dashboard/stats', {
      method: 'PUT',
      body: JSON.stringify(stats)
    })
  }
}

// Partners API
export const partnersAPI = {
  getAll: async () => {
    return apiRequest('/partners')
  },
  
  getById: async (id) => {
    return apiRequest(`/partners/${id}`)
  },
  
  create: async (partner) => {
    return apiRequest('/partners', {
      method: 'POST',
      body: JSON.stringify(partner)
    })
  },
  
  update: async (id, partner) => {
    return apiRequest(`/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(partner)
    })
  },
  
  delete: async (id) => {
    return apiRequest(`/partners/${id}`, {
      method: 'DELETE'
    })
  }
}

// Activities API
export const activitiesAPI = {
  getAll: async () => {
    return apiRequest('/activities')
  },
  
  create: async (activity) => {
    return apiRequest('/activities', {
      method: 'POST',
      body: JSON.stringify(activity)
    })
  },
  
  update: async (id, activity) => {
    return apiRequest(`/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activity)
    })
  },
  
  delete: async (id) => {
    return apiRequest(`/activities/${id}`, {
      method: 'DELETE'
    })
  }
}
