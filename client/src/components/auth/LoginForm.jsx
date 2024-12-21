import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { loginService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {login} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginService(email, password);
      
      console.log("response in loginform: ", response);
      await login(response.user);
      navigate('/recruiter/dashboard');

      // Redirect based on user role
      // if (response.role === 'candidate') {
      //   navigate('/candidate/dashboard');
      // } else if (response.role === 'recruiter') {
      //   navigate('/recruiter/dashboard');
      // }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div>
         <p className='text-center pb-6'>or
          </p> 
     
          <Button onClick={()=> { navigate('/register')}} className="w-full">
            Register
          </Button>
        </div>
        
        <div>
          <Button onClick={()=> { navigate('/candidate/careers')}} className="w-full">
            Go to Careers Page
          </Button>
        </div>

        
      </div>
    </div>
  );
};

export default LoginForm;