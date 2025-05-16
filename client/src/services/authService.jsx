import api from './api';

export const loginService = async (email, password) => {
  try {

    console.log("email & passowrd recieived:  ", email, password);

    const response = await api.post('/auth/login', { email, password });
    
    // Store token and user info
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    

    console.log("response in authservice: ", response.data);
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;

  } catch (error) {
    throw error.response ? error.response.data : new Error('Registration failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};
