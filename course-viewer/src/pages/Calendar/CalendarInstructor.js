import React, { useState, useEffect } from 'react';
import CalendarBody from "./components/CalendarBody/CalendarBody";
import Filter from './components/Filter/Filter';
import NotificationList from './components/NotificationList/NotificationList';
import axios from 'axios';
import "./CalendarInstructor.css"

const CalendarInstructor = ({token}) => {
  const filterTitle = "SELECT THE VIEW YOU WANT TO SEE";

  const instructorName = token['userName']
  const semester = 2220 // default semester for now
  const [filters, setFilters] = useState([]);

  const filterDefault = 'Please Select View'
  const [currentFilter, setCurrentFilter] = useState(filterDefault);
  
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
  useEffect(() => {}, [currentFilter])

  return (
    <div className="calendar-page">
      <div className="side-panel">
        <Filter filterTitle={filterTitle} filters={filters}
          currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}/>
        <NotificationList />
      </div>
      <CalendarBody currentModule={currentFilter === filterDefault ? "" : currentFilter} semester = {semester}/>
    </div>
  )
};

export default CalendarInstructor;
