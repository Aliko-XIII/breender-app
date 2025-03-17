// import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Login } from './components/Login/Login'
import { Register } from './components/Register/Register'
import { WelcomePage } from './components/WelcomePage/WelcomePage';
import { UserProfile } from "./components/Profile/Profile";
function App() {
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token',]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthenticated = cookies.access_token && cookies.refresh_token;
    const isAuthRoute =
      location.pathname === '/login' ||
      location.pathname === '/signup' ||
      location.pathname === '/';

    if (!isAuthenticated && !isAuthRoute) {
      // navigate('/');
    }
  }, [cookies, location.pathname, navigate]);


  return (
    <>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/profile' element={<UserProfile userId="test_id" />} />
      </Routes>
    </>
  )
}

export default App
