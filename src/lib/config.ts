// Centralized configuration from environment variables
export const config = {
  // Authentication settings
  auth: {
    tokenExpirationHours: parseInt(process.env.TOKEN_EXPIRATION_HOURS || '24'),
    passwordHashRounds: parseInt(process.env.PASSWORD_HASH_ROUNDS || '10'),
    cookieMaxAgeDays: parseInt(process.env.COOKIE_MAX_AGE_DAYS || '1'),
    defaultUserRole: process.env.DEFAULT_USER_ROLE || 'STUDENT',
    availableRoles: (process.env.AVAILABLE_ROLES || 'STUDENT,EDUCATOR,RESEARCHER,ADMIN').split(','),
    domainWhitelist: (process.env.DOMAIN_WHITELIST || '').split(',').filter(Boolean),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    loginLockoutMinutes: parseInt(process.env.LOGIN_LOCKOUT_MINUTES || '15'),
  },
  
  // Application settings
  app: {
    name: process.env.APP_NAME || 'TruthLens',
    tagline: process.env.APP_TAGLINE || 'Verify the Reality',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
  },
  
  // API settings
  api: {
    serperKey: process.env.SERPER_API_KEY || '',
    geminiKey: process.env.GEMINI_API_KEY || '',
    aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  },
  
  // Database
  database: {
    url: process.env.DATABASE_URL || '',
    directUrl: process.env.DIRECT_URL || '',
  },
  
  // Security
  security: {
    authSecret: process.env.AUTH_SECRET || '',
    nodeEnv: process.env.NODE_ENV || 'development',
  }
};

// Validation functions
export const validateEmailDomain = (email: string): boolean => {
  if (!config.auth.domainWhitelist.length) return true; // No whitelist restriction
  
  const domain = email.split('@')[1]?.toLowerCase();
  return config.auth.domainWhitelist.includes(domain);
};

export const isValidRole = (role: string): boolean => {
  return config.auth.availableRoles.includes(role);
};

export const getCookieSettings = () => ({
  httpOnly: true,
  secure: config.security.nodeEnv === 'production',
  maxAge: config.auth.cookieMaxAgeDays * 60 * 60 * 24, // Convert days to seconds
  path: '/',
});

export const getTokenExpiration = () => {
  const now = new Date();
  now.setHours(now.getHours() + config.auth.tokenExpirationHours);
  return now;
};
