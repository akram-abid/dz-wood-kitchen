const apiFetch = async (link, body = null, addContentType = true, method = null) => {
  const origin = import.meta.env.VITE_REACT_APP_ORIGIN;
  const token = localStorage.getItem('accessToken');
  
  try {
    const url = `${origin}${link}`;
    const headers = {
      "Authorization": `Bearer ${token}`,
    };

    // Only add Content-Type for non-FormData bodies
    if (addContentType && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Determine HTTP method dynamically
    let httpMethod;
    if (method) {
      // If method is explicitly provided, use it
      httpMethod = method.toUpperCase();
    } else {
      // Fallback to original logic for backward compatibility
      httpMethod = body ? 'POST' : 'GET';
    }

    const options = {
      method: httpMethod,
      headers: headers,
      credentials: 'omit',
    };

    console.log("i got this body ", body)

    // Add body for methods that support it
    if (body && ['POST', 'PUT', 'PATCH'].includes(httpMethod)) {
      if (body instanceof FormData) {
        options.body = body; // Don't stringify FormData
      } else {
        options.body = JSON.stringify(body); // Stringify regular objects
      }
    }

    console.log("the headers are ", headers)
    console.log("the options are hehe", options)
    console.log("the body that i will send is ", body)

    const response = await fetch(url, options);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use the status message
        }
      } else {
        const errorText = await response.text();
        console.log('Error Response Body:', errorText);
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    // Check if response is actually JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.log('Non-JSON Response:', responseText);
      throw new Error('Server did not return JSON response');
    }

    const data = await response.json();
    console.log('API Fetch Response:', data);
    return {
      success: true,
      data: data,
      error: null
    };
  } catch (error) {
    console.error('API Fetch Error:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

export default apiFetch;
