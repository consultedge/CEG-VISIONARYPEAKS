// API Configuration for AWS AI Calling Agent
// This file contains all API endpoints and configuration

// Get API Gateway URL from outputs.json or environment
const getApiUrl = () => {
  // In production, this should come from environment variables
  // For now, we'll construct it from the outputs
  const region = 'ap-south-1';
  const apiId = process.env.REACT_APP_API_GATEWAY_ID || 'your-api-id'; // Will be updated
  
  if (apiId === 'your-api-id') {
    // Fallback - construct from known pattern
    return `https://api-gateway-url-from-terraform.execute-api.${region}.amazonaws.com/dev`;
  }
  
  return `https://${apiId}.execute-api.${region}.amazonaws.com/dev`;
};

export const API_CONFIG = {
  baseURL: getApiUrl(),
  region: 'ap-south-1',
  endpoints: {
    // Customer Management
    customers: '/customers',
    customerById: (id) => `/customers/${id}`,
    
    // Call Management
    calls: '/calls',
    callById: (id) => `/calls/${id}`,
    initiateCall: '/calls/initiate',
    
    // File Upload
    uploadFile: '/upload',
    processFile: '/process',
    
    // Analytics
    analytics: '/analytics',
    reports: '/reports',
    
    // Settings
    settings: '/settings',
    
    // Health Check
    health: '/health'
  },
  
  // Request headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// API Client class
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        ...API_CONFIG.headers,
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET'
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// Specific API functions
export const customerAPI = {
  getAll: () => apiClient.get(API_CONFIG.endpoints.customers),
  getById: (id) => apiClient.get(API_CONFIG.endpoints.customerById(id)),
  create: (customer) => apiClient.post(API_CONFIG.endpoints.customers, customer),
  update: (id, customer) => apiClient.put(API_CONFIG.endpoints.customerById(id), customer),
  delete: (id) => apiClient.delete(API_CONFIG.endpoints.customerById(id))
};

export const callAPI = {
  getAll: () => apiClient.get(API_CONFIG.endpoints.calls),
  getById: (id) => apiClient.get(API_CONFIG.endpoints.callById(id)),
  initiate: (callData) => apiClient.post(API_CONFIG.endpoints.initiateCall, callData),
  update: (id, callData) => apiClient.put(API_CONFIG.endpoints.callById(id), callData)
};

export const fileAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.request(API_CONFIG.endpoints.uploadFile, {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set Content-Type for FormData
    });
  },
  process: (fileId) => apiClient.post(API_CONFIG.endpoints.processFile, { fileId })
};

export const analyticsAPI = {
  getDashboard: () => apiClient.get(API_CONFIG.endpoints.analytics),
  getReports: (params) => apiClient.get(API_CONFIG.endpoints.reports, params)
};

export const settingsAPI = {
  get: () => apiClient.get(API_CONFIG.endpoints.settings),
  update: (settings) => apiClient.put(API_CONFIG.endpoints.settings, settings)
};

// Health check function
export const healthCheck = () => apiClient.get(API_CONFIG.endpoints.health);

export default apiClient;
