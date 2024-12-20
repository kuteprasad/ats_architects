import api from './api';

export const login = async (email, password) => {
  try {
    // return true;
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
  return JSON.parse(localStorage.getItem('user'));
};