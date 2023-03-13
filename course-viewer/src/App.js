import './App.css';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login';
import CalendarInstructor from './pages/Calendar/CalendarInstructor';
import CalendarStudent from './pages/Calendar/CalendarStudent';
import Assignments from './pages/Assignments';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
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
    </>
  );
}

export default App;
