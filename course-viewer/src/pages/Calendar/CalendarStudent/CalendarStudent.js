import React, { useState, useEffect } from 'react';
import CalendarBody from "./components/CalendarBody/CalendarBody";
import Filter from '../components/Filter/Filter';
import "./CalendarStudent.css"
import ModuleSelector from './components/ModuleSelector/ModuleSelector';
import axios from 'axios';

const CalendarStudent = () => {
  const filterTitle = "AY/SEM";
  const filters = ["AY21/22 Sem 1", "AY21/22 Sem 2", "AY22/23 Sem 1", "AY22/23 Sem 2"];

  // records the current semester that the student selected
  const [currentSemester, setCurrentSemester] = useState("Please Select AY/SEM");
  // records the current module that the studnet selected
  const [currentModules, setCurrentModules] = useState([]);

  // current list of assignments selected for the semester selected
  const [currentModuleListAssignments, setCurrentModuleListAssignments] = useState([]);

  useEffect(() => {}, [currentModules, currentSemester, currentModuleListAssignments])

  return (
    <div className="calendar-page">
      <div className="side-panel">
        <Filter filterType="AY/SEM"  filterTitle={filterTitle} filters={filters} currentFilter={currentSemester} setCurrentFilter={setCurrentSemester}/>
        <ModuleSelector currentModules={currentModules} setCurrentModules={setCurrentModules} currentSemester={currentSemester} currentModuleListAssignments={currentModuleListAssignments} setCurrentModuleListAssignments={setCurrentModuleListAssignments}/>
      </div>
      <CalendarBody currentModuleListAssignments={currentModuleListAssignments} currentSemester={currentSemester}/>
    </div>
  )
};

export default CalendarStudent;
