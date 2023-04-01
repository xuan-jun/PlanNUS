import React, { useState, useEffect } from 'react';
import './Landing.css'
import logo from '../../assets/logo.png'
import axios from 'axios';

function Landing() {
  const [assignments, setAssignments] = useState([]);
  // const fetchData = async () => {
  //   try {
  //     const params = {
  //       instructor : 's/o Gopal Vikneswaran',
  //       semester : '2220'
  //     }

  //     const response = await axios('/modules_for_instructor', { params });
  //     setAssignments(response.data);
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error.response)
  //   }
  // }
  // useEffect(() => fetchData(), []);

  // useEffect(() => {
  //   const params = {
  //     module_code : 'DSA3101',
  //     semester : '2220',
  //     name : 'Assignment 2 Docker',
  //     weightage : 10,
  //     type : 'Assignment',
  //     group_or_indv : 'Individual',
  //     start_date : '23 Mar 2023',
  //     due_date : '1 Apr 2023'
  //   }
  //   axios.post('/add_new_assignments', {params})
  //     .then((response) => {
  //       console.log(response.data)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }, [])

  // useEffect(() => {
  //   const params = {
  //     module_code : 'DSA3101',
  //     semester : '2220',
  //     original_name : 'Assignment 2 Docker',
  //     name : 'Assignment 3 Docker',
  //     weightage : 20,
  //     type : 'Assignment',
  //     group_or_indv : 'Individual',
  //     start_date : '23 Mar 2023',
  //     due_date : '3 Apr 2023'
  //   }
  //   axios.put('/update_assignments', {params})
  //     .then((response) => {
  //       console.log(response.data)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }, [])

  // useEffect(() => {
  //   const params = {
  //     module_code : 'DSA3101',
  //     semester : '2220'
  //   }
  //   axios.get('/get_assignments', {params})
  //     .then((response) => {
  //       console.log(response.data)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }, [])

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
                <a href = "./calendar">Student</a>
            </button>
        </div>
    </div>
  </div>;
}

export default Landing;
