import React, { useState, useEffect } from 'react';
import CalendarBody from './components/CalendarBody/CalendarBody';
import Filter from '../components/Filter/Filter';
import NotificationList from './components/NotificationList/NotificationList';
import axios from 'axios';
import "./CalendarInstructor.css"

const CalendarInstructor = ({token, currentModule, setCurrentModule}) => {
  const filterTitle = "SELECT VIEW";

  const instructorName = token['userName']
  const semester = 2220 // default semester for now
  // keeps track of the current list of filters
  const [filters, setFilters] = useState([]);

  // keeps track of the current assignment data
  const [assignmentData, setAssignmentData] = useState([]);
  // keeps track of the assignentsFromModulePairs
  const [modulePairAssignment, setModulePairAssignment] = useState([]);
  // day, stress scores
  const [stressScoreDaily, setStressScoreDaily] = useState({});
  
  // make the api call to get the list of modules the instructor is currently teaching
  useEffect(() => {
    const params = {
      'instructor' : instructorName,
      'semester' : semester,
    }
    axios.get('/modules_for_instructor', {params})
      .then((response) => {
        var filters = response.data
        filters.push('My View')
        setFilters(response.data)
      })
      .catch((err) => console.log(err));
  }, [])

  // make a rerender whenever the currentFilter changes
  useEffect(() => {}, [currentModule])

  return (
    <div className="calendar-page">
      <div className="side-panel">
        <Filter filterTitle={filterTitle} filters={filters}
          currentFilter={currentModule} setCurrentFilter={setCurrentModule}/>
        {currentModule === 'My View' ?
        <div className="module-list">
          <h3>Modules you are currently teaching</h3>
          {filters.filter((module) => {
            return module !== "My View";
          }).map((module) => {
            return <div className="modules">{module}</div>
          })}
        </div> :
          <NotificationList assignmentData={assignmentData} modulePairAssignment={modulePairAssignment} stressScoreDaily={stressScoreDaily} currentModule={currentModule}/>
        }
      </div>
      <CalendarBody currentModule={currentModule}
      currentModules={filters} semester = {semester} assignmentData={assignmentData}
      instructor = {instructorName}
      setAssignmentData={setAssignmentData} modulePairAssignment={modulePairAssignment} setModulePairAssignment={setModulePairAssignment} stressScoreDaily={stressScoreDaily}
      setStressScoreDaily={setStressScoreDaily}/>
    </div>
  )
};

export default CalendarInstructor;
