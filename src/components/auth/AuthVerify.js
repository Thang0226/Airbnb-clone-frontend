import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isTokenExpired } from '../utils/jwtdecode'

const AuthVerify = ({children}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && isTokenExpired(token)) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return children;
};


export default AuthVerify;