import './App.css';

import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import CalendarInstructor from './pages/Calendar/CalendarInstructor';
import CalendarStudent from './pages/Calendar/CalendarStudent';
import Assignments from './pages/Assignments';
import AddAssignment from './pages/AddAssignment';
import Landing from './pages/Landing/Landing';
import { Route, Routes } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import React, {useState, useEffect} from "react";

function App() {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');

  return (
    <div data-theme={theme} className='App'>
      <Navbar theme={theme} setTheme={setTheme}/>
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/calendar" element={<CalendarInstructor />}></Route>
          <Route path="/calendar-student" element={<CalendarStudent />}></Route>
          <Route path='/assignments' element={<Assignments theme={theme} />}></Route>
          <Route path='/assignments/addnew' element={<AddAssignment/>}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
