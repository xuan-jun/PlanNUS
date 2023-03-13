import React from 'react';
import CalendarBody from "./components/CalendarBody/CalendarBody";
import Filter from './components/Filter/Filter';
import "./CalendarInstructor.css"

const CalendarInstructor = () => {
  const filterTitle = "SELECT THE VIEW YOU WANT TO SEE";
  const filters = ["DSA3101", "DSA3102", "My View"];

  return (
    <div className="calendar-page">
      <Filter filterType="View"  filterTitle={filterTitle} filters={filters}/>
      <CalendarBody />
    </div>
  )
};

export default CalendarInstructor;
