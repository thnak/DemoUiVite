// ----------------------------------------------------------------------
// JWT Utility Functions
// Utilities for decoding and extracting information from JWT tokens
// ----------------------------------------------------------------------

/**
 * JWT payload interface
 */
export interface JwtPayload {
  sub?: string; // Subject (user ID)
  email?: string;
  role?: string | string[]; // User role(s)
  exp?: number; // Expiration time
  iat?: number; // Issued at
  [key: string]: any; // Allow other claims
}

/**
 * Decode JWT token without verification
 * Note: This does not validate the signature, only decodes the payload
 * 
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JwtPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Extract user roles from JWT token
 * 
 * @param token - JWT token string
 * @returns Array of user roles
 */
export function getUserRolesFromToken(token: string): string[] {
  const payload = decodeJwt(token);
  if (!payload) {
    return [];
  }

  // Handle both single role (string) and multiple roles (array)
  if (Array.isArray(payload.role)) {
    return payload.role;
  }
  
  if (typeof payload.role === 'string') {
    return [payload.role];
  }

  // Check alternative claim names
  if (payload.roles) {
    return Array.isArray(payload.roles) ? payload.roles : [payload.roles];
  }

  return [];
}

/**
 * Check if user has a specific role
 * 
 * @param token - JWT token string
 * @param role - Role name to check (case-insensitive)
 * @returns True if user has the role
 */
export function hasRole(token: string, role: string): boolean {
  const roles = getUserRolesFromToken(token);
  return roles.some(r => r.toLowerCase() === role.toLowerCase());
}

/**
 * Check if JWT token is expired
 * 
 * @param token - JWT token string
 * @returns True if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now();
}

/**
 * Get access token from localStorage
 * 
 * @returns Access token or null
 */
export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

/**
 * Check if current user is an Operator
 * 
 * @returns True if user has Operator role
 */
export function isOperator(): boolean {
  const token = getAccessToken();
  if (!token) {
    return false;
  }

  return hasRole(token, 'Operator');
}
