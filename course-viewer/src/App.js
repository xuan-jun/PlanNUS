import './App.css';
import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login'
import Calendar from './pages/Calendar'
import Assignments from './pages/Assignments'
import AddAssignment from './pages/AddAssignment';
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
      <Navbar />
      <div className='container'>
        <Routes>
          <Route path='/' element={<Login/>}></Route>
          <Route path='/calendar' element={<Calendar/>}></Route>
          <Route path='/assignments' element={<Assignments/>}></Route>
          <Route path='/assignments/addnew' element={<AddAssignment/>}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
