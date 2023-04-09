import React, { useState, useEffect } from 'react';
import './Landing.css'
import logo from '../../assets/logo.png'
import axios from 'axios';
import { motion } from "framer-motion";
import { plannus, plannusWrapper, fadeIn, staggerContainer } from "../../variants.ts";

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
    <body>
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* upper */}
      <div>
        <motion.span variants={fadeIn()} className="bubble-left">
        <p><strong>Instructors!</strong> <br /> Have you wondered whether your students are 
          having <br /> assignments on days where you have provided assignments?</p> 
        </motion.span>
        <motion.span variants={fadeIn()} className="bubble-right">
        <p><strong>Students!</strong>  <br /> Have you wondered about how the assignment <br /> workloads are like
        for the previous semester?</p>
        </motion.span>
      </div>
    </motion.div>

    <motion.div variants={plannusWrapper} initial="initial" animate="animate" className="plannusWrapper">
      <motion.img src={logo} variants={plannus} className="plannus-logo" />
    </motion.div>
    <motion.span variants={fadeIn()} initial="initial" animate="animate">
        <p>Whether you are an instructor or a student, there is <strong>always</strong> something for you!</p>
    </motion.span>

    <br></br><br></br>

    <div className="landing-select-type">
      <button class="learn-more">
        <a href = './login'>Instructor</a>
      </button>
      <button class="learn-more">
        <a href = './Calendar'>Student</a>
      </button>
    
    </div>

    </body>  
  </div>;
}

export default Landing;
