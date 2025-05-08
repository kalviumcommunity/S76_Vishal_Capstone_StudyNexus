// Auth utility functions

// Save token to localStorage
export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Get token from localStorage
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Remove token from localStorage
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  // Check if user is logged in
  export const isLoggedIn = () => {
    const token = getToken();
    return !!token;
  };