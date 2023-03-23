import './App.css';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login';
import CalendarInstructor from './pages/Calendar/CalendarInstructor';
import CalendarStudent from './pages/Calendar/CalendarStudent';
import Assignments from './pages/Assignments';
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
          <Route path="/" element={<Login />}></Route>
          <Route path="/calendar" element={<CalendarInstructor />}></Route>
          <Route path="/calendar-student" element={<CalendarStudent />}></Route>
          <Route
            path="/assignments"
            element={<Assignments />}
          ></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
