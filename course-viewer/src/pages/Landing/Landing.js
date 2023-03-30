import React, { useState, useEffect } from 'react';
import './Landing.css'
import logo from '../../assets/logo.png'
import axios from 'axios';

function Landing() {
  const [assignments, setAssignments] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios('/get-instructors');
      setAssignments(response.data);
      console.log(response);
    } catch (error) {
      console.log(error.response)
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return <div className="landing-page">
    <img className="plannus-logo" src = {logo} alt = "plannus logo" />
    <div className="landing-text-wrapper">
        <h1 className='landing-title'>Welcome to <em><p className='blue'>Plan</p>NUS</em> !</h1>
        <p><strong>Instructors!</strong> Have you wondered whether your students are 
          having assignments on days where you have provided assignments?</p>
        <p><strong>Students!</strong> Have you wondered about how the assignment workloads are like
        for the previous semester?</p>
        <p>Whether you are an instructor or a student there is something here for you</p>

        <div className="landing-select-type">
            <button className="landing-button">
                <a href = './login'>Instructor</a>
            </button>
            <button className="landing-button">
                <a href = "./calendar-student">Student</a>
            </button>
        </div>
    </div>
  </div>;
}

export default Landing;
