import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginSuccess = () => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    const processLogin = async () => {
      try {
        
        const token = useSearchParams.get("token");
        
        if (!token) {
          setError('No access token found in URL parameters');
          setStatus('error');
          return;
        }

        localStorage.setItem('accessToken', token);
        
        const decodedToken = decodeJWT(token);
        
        if (decodedToken) {
          const userData = {
            id: decodedToken.sub || decodedToken.id || decodedToken.user_id,
            email: decodedToken.email,
            name: decodedToken.name || (decodedToken.given_name && decodedToken.family_name 
              ? decodedToken.given_name + ' ' + decodedToken.family_name 
              : decodedToken.given_name || decodedToken.family_name),
            picture: decodedToken.picture || decodedToken.avatar,
            provider: decodedToken.provider || 'oauth',
            exp: decodedToken.exp,
            iat: decodedToken.iat
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          
          setStatus('success');
          
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setError('Failed to decode user information from token');
          setStatus('error');
        }
      } catch (error) {
        console.error('Login processing error:', error);
        setError('An error occurred while processing login');
        setStatus('error');
      }
    };

    processLogin();
  }, []);

  // Handle error cases - redirect to login after delay
  useEffect(() => {
    if (status === 'error') {
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'processing' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <h2 className="text-2xl font-bold text-gray-900">Processing Login...</h2>
              <p className="text-gray-600">Please wait while we complete your authentication.</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="rounded-full h-12 w-12 bg-green-100 mx-auto flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Login Successful!</h2>
              <p className="text-gray-600">Redirecting you to the homepage...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="rounded-full h-12 w-12 bg-red-100 mx-auto flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Login Failed</h2>
              <p className="text-red-600">{error}</p>
              <p className="text-gray-600">Redirecting to login page...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSuccess;