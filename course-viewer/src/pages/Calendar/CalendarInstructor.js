import React, { useState } from 'react';
import CalendarBody from "./components/CalendarBody/CalendarBody";
import Filter from './components/Filter/Filter';
import NotificationList from './components/NotificationList/NotificationList';
import "./CalendarInstructor.css"

const CalendarInstructor = () => {
  const filterTitle = "SELECT THE VIEW YOU WANT TO SEE";
  const filters = ["DSA3101", "DSA3102", "My View"];

  return (
    <div className="calendar-page">
      <div className="side-panel">
        <Filter filterType="View"  filterTitle={filterTitle} filters={filters}/>
        <NotificationList />
      </div>
      <CalendarBody />
    </div>
  )
};

export default CalendarInstructor;
