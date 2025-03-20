// import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Login } from './components/Login/Login'
import { Register } from './components/Register/Register'
import { WelcomePage } from './components/WelcomePage/WelcomePage';
import { UserProfile } from "./components/Profile/Profile";
import { AnimalProfile } from "./components/AnimalProfile/AnimalProfile";
import { ApiResponse } from "./types";

interface Api {
  registerUser: (email: string, password: string) => Promise<ApiResponse>;
  loginUser: (email: string, password: string) => Promise<ApiResponse>;
}

function App({ api }: { api: Api }) {
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token',]);
  const navigate = useNavigate();
  const location = useLocation();

  const setAccessToken = (token: string) => {
    setCookie('access_token', token, { path: '/' });
  };

  const setRefreshToken = (token: string) => {
    setCookie('refresh_token', token, { path: '/' });
  };

  const processLogin = (email: string, password: string) => {
    api.loginUser(email, password)
      .then(response => {
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          if (
            !response.data.data.access_token ||
            !response.data.data.refresh_token ||
            typeof response.data.data.access_token !== 'string' ||
            typeof response.data.data.refresh_token !== 'string'
          ) {
            alert("Login failed");
            return;
          }
          setAccessToken(response.data.data.access_token);
          setRefreshToken(response.data.data.refresh_token);
          navigate('/user-profile');
        }
        else {
          alert("Login failed");
        }
      });
  };

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
        <Route path='/login' element={<Login loginUser={processLogin} />} />
        <Route path='/signup' element={<Register registerUser={api.registerUser} />} />
        <Route path='/user-profile' element={<UserProfile userId="test_id" />} />
        <Route path='/animal-profile' element={<AnimalProfile animalId="test_id" />} />
      </Routes>
    </>
  )
}

export default App
