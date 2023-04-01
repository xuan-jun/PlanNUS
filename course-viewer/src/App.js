import './App.css';

import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import CalendarInstructor from './pages/Calendar/CalendarInstructor';
import CalendarStudent from './pages/Calendar/CalendarStudent';
import Assignments from './pages/Assignments';
import AddAssignment from './pages/AddAssignment';
import Landing from './pages/Landing/Landing';
import useToken from './components/useToken/useToken';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import React, {useState, useEffect} from "react";

function App() {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');

  const {token, removeToken, setToken} = useToken();

  return (
    <div data-theme={theme} className='App'>
      <Navbar theme={theme} setTheme={setTheme} token={token} removeToken={removeToken}/>
      <div className="container">
        <Routes>
          <Route path="/" element={
          token ?
          <CalendarInstructor token = {token}/> :
          <Landing />
          }/>
          <Route path="/calendar" element={
            <ProtectedRoute isAllowed = {!token} redirectPath="/">
              <CalendarStudent/>
            </ProtectedRoute>
          }/>
          <Route path="/login" element={
            <ProtectedRoute isAllowed = {!token} redirectPath="/">
              <Login setToken={setToken}/>
            </ProtectedRoute>
          }/>
          <Route path='/assignments' element={
            <ProtectedRoute isAllowed = {token} redirectPath="/login">
              <Assignments theme={theme} token={token}/>
            </ProtectedRoute>
          }/>
          <Route path='/assignments/addnew' element={
            <ProtectedRoute isAllowed = {token} redirectPath="/login">
              <AddAssignment token={token}/>
            </ProtectedRoute>
          }/>
        </Routes>
      </div>
    </div>
  );
}


// components that helps to ensure only if the user is logged in, we will get them to go to the relevant paths
const ProtectedRoute = ({ isAllowed, redirectPath, children }) => {
  if (!isAllowed) {
    return <Navigate to = {redirectPath} />
  }

  return children ? children : <Outlet />
}

export default App;
