import  {useEffect} from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

export default function RefreshHandler({ setIsAuthenticated }) {
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    if(localStorage.getItem('token')) {
      setIsAuthenticated(true);
      if(location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
        navigate('/recruiter/dashboard', {replace: false});
      }
    }
  }, [location, navigate, setIsAuthenticated]);

  return (
    null
  )
}
