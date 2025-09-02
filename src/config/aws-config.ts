// AWS Configuration for the AI Calling Agent Admin Portal
// This configuration will be populated by the Terraform outputs

const awsConfig = {
  Auth: {
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    userPoolId: process.env.REACT_APP_USER_POOL_ID || '',
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || '',
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || '',
    mandatorySignIn: true,
    authenticationFlowType: 'USER_SRP_AUTH',
  },
  API: {
    endpoints: [
      {
        name: 'aiCallingAgentAPI',
        endpoint: process.env.REACT_APP_API_ENDPOINT || '',
        region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
      },
    ],
  },
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_S3_BUCKET || '',
      region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    },
  },
  Analytics: {
    disabled: false,
    autoTrack: {
      enable: true,
      type: 'multiPageApp',
    },
  },
};

export default awsConfig;

// Configuration for different environments
export const getEnvironmentConfig = () => {
  const environment = process.env.REACT_APP_ENVIRONMENT || 'dev';
  
  const configs = {
    dev: {
      apiEndpoint: 'https://dev-api.example.com',
      connectInstanceId: 'dev-connect-instance',
      lexBotId: 'dev-lex-bot',
      quicksightDashboardUrl: 'https://quicksight.aws.amazon.com/dev-dashboard',
    },
    staging: {
      apiEndpoint: 'https://staging-api.example.com',
      connectInstanceId: 'staging-connect-instance',
      lexBotId: 'staging-lex-bot',
      quicksightDashboardUrl: 'https://quicksight.aws.amazon.com/staging-dashboard',
    },
    prod: {
      apiEndpoint: 'https://prod-api.example.com',
      connectInstanceId: 'prod-connect-instance',
      lexBotId: 'prod-lex-bot',
      quicksightDashboardUrl: 'https://quicksight.aws.amazon.com/prod-dashboard',
    },
  };

  return configs[environment as keyof typeof configs] || configs.dev;
};

// API endpoints configuration
export const API_ENDPOINTS = {
  CUSTOMERS: '/customers',
  CALLS: '/calls',
  ANALYTICS: '/analytics',
  ADMIN: '/admin',
  AUTH: '/auth',
};

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_REAL_TIME_UPDATES: process.env.REACT_APP_ENABLE_REAL_TIME === 'true',
  ENABLE_ADVANCED_ANALYTICS: process.env.REACT_APP_ENABLE_ADVANCED_ANALYTICS === 'true',
  ENABLE_BULK_OPERATIONS: process.env.REACT_APP_ENABLE_BULK_OPERATIONS === 'true',
  ENABLE_EXPORT_FEATURES: process.env.REACT_APP_ENABLE_EXPORT === 'true',
};

// Application constants
export const APP_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['.xlsx', '.xls', '.csv'],
  PAGINATION_SIZE: 50,
  REFRESH_INTERVAL: 30000, // 30 seconds
  CALL_TIMEOUT: 45000, // 45 seconds
  MAX_DAILY_CALLS: 200000,
};
