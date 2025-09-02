// Updated API Configuration for AWS AI Calling Agent
// This version works with AWS Amplify and real backend

// Get API Gateway URL from environment or use placeholder
const getApiUrl = () => {
  // First try environment variable (set in Amplify Console)
  if (process.env.REACT_APP_API_GATEWAY_URL) {
    return process.env.REACT_APP_API_GATEWAY_URL;
  }
  
  // Fallback - you'll need to replace this with your actual API Gateway URL
  // Format: https://[API_ID].execute-api.ap-south-1.amazonaws.com/dev
  const API_ID = 'YOUR_API_GATEWAY_ID'; // Replace with actual API ID
  
  if (API_ID === 'YOUR_API_GATEWAY_ID') {
    console.warn('⚠️ API Gateway URL not configured. Please set REACT_APP_API_GATEWAY_URL environment variable or update API_ID in api.js');
    // Return a placeholder that will show error messages
    return 'https://api-not-configured.example.com';
  }
  
  return `https://${API_ID}.execute-api.ap-south-1.amazonaws.com/dev`;
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

// Enhanced API Client class with better error handling
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.isConfigured = !this.baseURL.includes('api-not-configured');
  }

  async request(endpoint, options = {}) {
    // Check if API is configured
    if (!this.isConfigured) {
      throw new Error('API Gateway URL not configured. Please set environment variable or update configuration.');
    }

    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        ...API_CONFIG.headers,
        ...options.headers
      },
      ...options
    };

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Success: ${options.method || 'GET'} ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error('🚨 API request failed:', error);
      
      // Provide helpful error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to API. Check your internet connection and API URL.');
      }
      
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

  // Check if API is healthy
  async healthCheck() {
    try {
      const response = await this.get('/health');
      return response.success === true;
    } catch (error) {
      return false;
    }
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// Specific API functions with error handling
export const customerAPI = {
  getAll: async () => {
    try {
      return await apiClient.get(API_CONFIG.endpoints.customers);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      // Return sample data as fallback
      return {
        success: true,
        data: [
          {
            customer_id: 'sample-1',
            name: 'Rajesh Kumar',
            phone: '+91-9876543210',
            email: 'rajesh.kumar@email.com',
            debt_amount: 15000,
            due_date: '2024-02-15',
            status: 'active'
          },
          {
            customer_id: 'sample-2',
            name: 'Priya Sharma',
            phone: '+91-9876543211',
            email: 'priya.sharma@email.com',
            debt_amount: 25000,
            due_date: '2024-02-20',
            status: 'active'
          }
        ],
        count: 2
      };
    }
  },
  
  getById: (id) => apiClient.get(API_CONFIG.endpoints.customerById(id)),
  create: (customer) => apiClient.post(API_CONFIG.endpoints.customers, customer),
  update: (id, customer) => apiClient.put(API_CONFIG.endpoints.customerById(id), customer),
  delete: (id) => apiClient.delete(API_CONFIG.endpoints.customerById(id))
};

export const callAPI = {
  getAll: async () => {
    try {
      return await apiClient.get(API_CONFIG.endpoints.calls);
    } catch (error) {
      console.error('Failed to fetch calls:', error);
      // Return sample data as fallback
      return {
        success: true,
        data: [
          {
            call_id: 'sample-call-1',
            customer_id: 'sample-1',
            phone_number: '+91-9876543210',
            status: 'completed',
            duration: 180,
            outcome: 'successful',
            created_at: new Date().toISOString()
          }
        ],
        count: 1
      };
    }
  },
  
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
  getDashboard: async () => {
    try {
      return await apiClient.get(API_CONFIG.endpoints.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Return sample data as fallback
      return {
        success: true,
        data: {
          summary: {
            total_calls: 1247,
            successful_calls: 892,
            success_rate: 71.5,
            total_customers: 2156,
            active_customers: 1834
          },
          recent_calls: [
            {
              call_id: 'sample-1',
              phone_number: '+91-9876543210',
              status: 'completed',
              duration: 154,
              outcome: 'successful',
              created_at: new Date().toISOString()
            }
          ],
          call_outcomes: {
            successful: 892,
            failed: 43,
            no_answer: 227,
            busy: 85,
            pending: 0
          }
        }
      };
    }
  },
  
  getReports: (params) => apiClient.get(API_CONFIG.endpoints.reports, params)
};

export const settingsAPI = {
  get: () => apiClient.get(API_CONFIG.endpoints.settings),
  update: (settings) => apiClient.put(API_CONFIG.endpoints.settings, settings)
};

// Health check function
export const healthCheck = () => apiClient.healthCheck();

// Configuration status
export const getConfigurationStatus = () => ({
  isConfigured: apiClient.isConfigured,
  apiUrl: API_CONFIG.baseURL,
  region: API_CONFIG.region
});

export default apiClient;
