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

function getValidAccessToken(requiredRole = null, requireEmailVerification = true) {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    console.log("this is the token i got from the api ")
    
    if (!token) {
      return { 
        isValid: false, 
        token: null, 
        isEmailVerified: false,
        reason: 'No token found' 
      };
    }
    
    // Decode the token
    const payload = decodeJWT(token);
    console.log("this is the payload i got ", payload)
    
    if (!payload) {
      return { 
        isValid: false, 
        token: null, 
        isEmailVerified: false,
        reason: 'Invalid token format' 
      };
    }
    
    // Check if token has expiration time
    if (!payload.exp) {
      return { 
        isValid: false, 
        token: null, 
        isEmailVerified: payload.isEmailVerified,
        reason: 'Token has no expiration time' 
      };
    }
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const isExpired = payload.exp < currentTime;
    
    if (isExpired) {
      localStorage.removeItem('accessToken');
      return { 
        isValid: false, 
        token: null, 
        isEmailVerified: payload.isEmailVerified ,
        reason: 'Token expired' 
      };
    }
    
    // Check email verification if required
    const emailVerified = payload.isEmailVerified ;

    
    // Check role if required
    if (requiredRole) {
      const userRole = payload.role;
      
      if (!userRole) {
        return { 
          isValid: false, 
          token: null, 
          isEmailVerified: emailVerified,
          reason: 'No role found in token' 
        };
      }
      
      // Handle single role or array of roles
      const hasRequiredRole = Array.isArray(userRole) 
        ? userRole.includes(requiredRole)
        : userRole === requiredRole;
      
      if (!hasRequiredRole) {
        return { 
          isValid: false, 
          token: null, 
          isEmailVerified: emailVerified,
          reason: `Insufficient permissions. Required role: ${requiredRole}` 
        };
      }
    }

    if (requireEmailVerification && !emailVerified) {
      return { 
        isValid: true, 
        token: null, 
        isEmailVerified: false,
        reason: 'Email not verified' 
      };
    }
    
    return { 
      isValid: true, 
      token, 
      payload,
      isEmailVerified: emailVerified,
      expiresAt: new Date(payload.exp * 1000), // Convert to readable date
      reason: 'Token is valid'
    };
    
  } catch (error) {
    console.error('Error validating token:', error);
    return { 
      isValid: false, 
      token: null, 
      isEmailVerified: false,
      reason: 'Error validating token' 
    };
  }
}

function isAuthenticated(requiredRole = null, requireEmailVerification = true) {
  const result = getValidAccessToken(requiredRole, requireEmailVerification);
  return result.isValid;
}

function useAuth(requiredRole = null, requireEmailVerification = true) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    loading: true,
    userRole: null,
    isEmailVerified: false,
    authError: null
  });
  
  useEffect(() => {
    const checkAuth = () => {
      const result = getValidAccessToken(requiredRole, requireEmailVerification);
      setAuthState({
        isAuthenticated: result.isValid,
        token: result.token,
        userRole: result.payload?.role || result.payload?.roles || result.payload?.user_role || null,
        isEmailVerified: result.isEmailVerified,
        authError: result.reason,
        loading: false
      });
    };
    
    checkAuth();
    
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, [requiredRole, requireEmailVerification]);
  
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

// Utility function to check if email is verified
function isEmailVerified() {
  const result = getValidAccessToken(null, false); // Don't require email verification for this check
  return result.isEmailVerified;
}

// Utility function to get user info from token
function getUserInfo() {
  const result = getValidAccessToken(null, false); // Don't require email verification for this check
  if (!result.isValid) return null;
  
  return {
    email: result.payload?.email || null,
    name: result.payload?.name || null,
    userId: result.payload?.userId || null,
    role: result.payload?.role || result.payload?.roles || result.payload?.user_role || null,
    isEmailVerified: result.payload?.isEmailVerified || false,
    type: result.payload?.type || null
  };
}

export { 
  getValidAccessToken, 
  isAuthenticated, 
  useAuth,
  hasRole,
  getUserRole,
  isEmailVerified,
  getUserInfo
};