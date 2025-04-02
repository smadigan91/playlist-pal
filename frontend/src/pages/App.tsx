import React, { useEffect, useState } from 'react';

// components
import Main from '../components/Main';
import Login from '../components/Login';
import LoginRedirect from '../components/LoginRedirect';

// providers
import { PlaylistProvider } from '../context/PlaylistContext';

// routing
import { Navigate, Routes, Route, useNavigate } from 'react-router-dom';

// styles
import '../styles/global.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem('userInfo') !== null
  );

  const navigate = useNavigate();

  // if no login info, redirect to login page
  useEffect(() => {
    console.log('isLoggedIn: ', isLoggedIn);
    if (!isLoggedIn) return;

    // Login component sets the user info in local storage
    // check that info and use it to verify auth status
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    console.log(userInfo);
  }, [isLoggedIn])

  const logIn = () => {
    console.log('post login');
    navigate('/');
    setIsLoggedIn(true);
  }

  // pass this callback to components you want to allow logging out
  // it will update the local state and then get persisted
  const logOut = () => setIsLoggedIn(false);

  return (
    <PlaylistProvider>
      <Routes>
        <Route path='/' element={isLoggedIn ? <Main /> : <Navigate to='/login' />} />
        <Route path='/login' element={<Login onLogIn={logIn} />} />
        <Route path='/postlogin' element={<LoginRedirect />} />
      </Routes>
    </PlaylistProvider>
  );
};

export default App;
