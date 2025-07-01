const apiFetch = async (link, body = null) => {
  const origin = import.meta.env.VITE_REACT_APP_ORIGIN;
  console.log('API Fetch URL:', `${origin}${link}`);
  
  try {
    const url = `${origin}${link}`;
    
    const options = {
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',   
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
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