import { useState, useEffect } from 'react';

function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

function getValidAccessToken(requiredRole = null) {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      return { isValid: false, token: null, reason: 'No token found' };
    }
    
    // Decode the token
    const payload = decodeJWT(token);
    
    if (!payload) {
      return { isValid: false, token: null, reason: 'Invalid token format' };
    }
    
    // Check if token has expiration time
    if (!payload.exp) {
      return { isValid: false, token: null, reason: 'Token has no expiration time' };
    }
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const isExpired = payload.exp < currentTime;
    
    if (isExpired) {
      localStorage.removeItem('accessToken');
      return { isValid: false, token: null, reason: 'Token expired' };
    }
    
    // Check role if required
    if (requiredRole) {
      const userRole = payload.role || payload.roles || payload.user_role;
      
      if (!userRole) {
        return { isValid: false, token: null, reason: 'No role found in token' };
      }
      
      // Handle single role or array of roles
      const hasRequiredRole = Array.isArray(userRole) 
        ? userRole.includes(requiredRole)
        : userRole === requiredRole;
      
      if (!hasRequiredRole) {
        return { 
          isValid: false, 
          token: null, 
          reason: `Insufficient permissions. Required role: ${requiredRole}` 
        };
      }
    }
    
    return { 
      isValid: true, 
      token, 
      payload,
      expiresAt: new Date(payload.exp * 1000), // Convert to readable date
      reason: 'Token is valid'
    };
    
  } catch (error) {
    console.error('Error validating token:', error);
    return { isValid: false, token: null, reason: 'Error validating token' };
  }
}

function isAuthenticated(requiredRole = null) {
  const result = getValidAccessToken(requiredRole);
  return result.isValid;
}

function useAuth(requiredRole = null) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    loading: true,
    userRole: null
  });
  
  useEffect(() => {
    const checkAuth = () => {
      const result = getValidAccessToken(requiredRole);
      setAuthState({
        isAuthenticated: result.isValid,
        token: result.token,
        userRole: result.payload?.role || result.payload?.roles || result.payload?.user_role || null,
        loading: false
      });
    };
    
    checkAuth();
    
    // Optional: Set up interval to check token periodically
    const interval = setInterval(checkAuth, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [requiredRole]);
  
  return authState;
}

// Utility function to check if user has specific role
function hasRole(requiredRole) {
  const result = getValidAccessToken();
  if (!result.isValid) return false;
  
  const userRole = result.payload?.role || result.payload?.roles || result.payload?.user_role;
  
  if (!userRole) return false;
  
  return Array.isArray(userRole) 
    ? userRole.includes(requiredRole)
    : userRole === requiredRole;
}

// Utility function to get user role from token
function getUserRole() {
  const result = getValidAccessToken();
  if (!result.isValid) return null;
  
  return result.payload?.role || result.payload?.roles || result.payload?.user_role || null;
}

export { 
  getValidAccessToken, 
  isAuthenticated, 
  useAuth,
  hasRole,
  getUserRole
};