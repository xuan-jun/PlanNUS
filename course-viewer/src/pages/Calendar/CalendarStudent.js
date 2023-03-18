import React from 'react';
import CalendarBody from "./components/CalendarBody/CalendarBody";
import Filter from './components/Filter/Filter';
import "./CalendarStudent.css"
import ModuleSelector from './components/ModuleSelector/ModuleSelector';

const CalendarStudent = () => {
  const filterTitle = "AY/SEM";
  const filters = ["AY21/22 Sem 1", "AY21/22 Sem 2", "AY22/23 Sem 1", "AY22/23 Sem 2"];

  return (
    <div className="calendar-page">
      <div className="side-panel">
        <Filter filterType="AY/SEM"  filterTitle={filterTitle} filters={filters}/>
        <ModuleSelector/>
      </div>
      <CalendarBody />
    </div>
  )
};

export default CalendarStudent;
