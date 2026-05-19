


import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './components/Login';
// import Users from './components/users/Users';
// import CreateUser from './components/CreateUser';
import MainPage from './components/MainPage';
import Profile from './components/Profile';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';


function App() {
  return (
      <BrowserRouter>
        <Routes>
          
          <Route path="/auth/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          

        </Routes>
      </BrowserRouter>
  );
}

export default App;
