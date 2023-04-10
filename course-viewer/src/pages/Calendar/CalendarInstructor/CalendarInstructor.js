import React, { useState, useEffect } from 'react';
import CalendarBody from './components/CalendarBody/CalendarBody';
import Filter from '../components/Filter/Filter';
import NotificationList from './components/NotificationList/NotificationList';
import axios from 'axios';
import "./CalendarInstructor.css"

// colours for selection
const colorsForSelection = [
  '#c3332b', // red
  '#ef6937', // orange
  '#f4a813', // yellow
  '#328741', // green
  '#4574ef', // dark blue
  '#80a5fb', // light blue
  '#9f6cc9', // purple
  '#e59998' // rose
]


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
  // state to collate the colours for each of the modules that the professor teaches
  const [moduleColors, setModuleColors] = useState([]);
  // state to record which module's colour picker is open
  const [moduleOpened, setModuleOpened] = useState('')
  
  // make the api call to get the list of modules the instructor is currently teaching
  useEffect(() => {
    const params = {
      'instructor' : instructorName,
      'semester' : semester,
    }
    axios.get('/modules_for_instructor', {params})
      .then((response) => {
        const result = response.data
        // setting the filters
        var newFilters = result.concat()
        newFilters.push('My View')
        setFilters(newFilters)

        var newModuleColors = []
        // set the module color pairings
        result.map((module) => {
          // choose a random background color
          const backgroundColor = colorsForSelection[Math.floor(Math.random() * colorsForSelection.length)]
          // add the current module to the list
          newModuleColors.push({
            "moduleCode" : module,
            "backgroundColor" : backgroundColor
          })
        })
        // set the state
        setModuleColors(newModuleColors);
      })
      .catch((err) => console.log(err));
  }, [])

  // make a rerender whenever the currentFilter changes
  useEffect(() => {}, [currentModule])


  // handler for color picker
  let colorPickerClickHandler = (moduleCode, color) => {
    var newModules = moduleColors.concat();
    // find the index of the module that we want to change
    const index = newModules.findIndex((module) => {
      return module['moduleCode'] === moduleCode
    })
    // set the color for the newly selected color
    newModules[index]['backgroundColor'] = color

    // update the list of current modules
    setModuleColors(newModules)

  }

  return (
    <div className="calendar-page">
      <div className="side-panel">
        <Filter filterTitle={filterTitle} filters={filters}
          currentFilter={currentModule} setCurrentFilter={setCurrentModule}/>

        {currentModule === 'My View' ?
        <div className="module-list">
          <h3>Modules you are currently teaching</h3>
          {moduleColors.map((module) => (
            <Module moduleCode={module['moduleCode']}
            backgroundColor={module['backgroundColor']}
            moduleOpened={moduleOpened}
            setModuleOpened={setModuleOpened}
            colorPickerClickHandler={colorPickerClickHandler}/>
          ))}
        </div> :
          <NotificationList assignmentData={assignmentData} modulePairAssignment={modulePairAssignment} stressScoreDaily={stressScoreDaily} currentModule={currentModule}/>
        }
      </div>
      <CalendarBody currentModule={currentModule}
      currentModules={filters} 
      semester = {semester}
      assignmentData={assignmentData}
      instructor = {instructorName}
      setAssignmentData={setAssignmentData}
      modulePairAssignment={modulePairAssignment} 
      setModulePairAssignment={setModulePairAssignment} 
      stressScoreDaily={stressScoreDaily}
      setStressScoreDaily={setStressScoreDaily}
      moduleColors={moduleColors}/>
    </div>
  )
};

// format the display of modules that have been selected
const Module = ({moduleCode, backgroundColor, moduleOpened, setModuleOpened, colorPickerClickHandler}) => {
  const style = {
    backgroundColor : backgroundColor
  }

  return (
    <div className="module-added-instructor">
      <div className="selected-color-instructor" style={style} onClick={() => moduleOpened===moduleCode ? setModuleOpened("") : setModuleOpened(moduleCode)}>
        <div className={`color-picker-instructor ${moduleOpened===moduleCode ? 'open' : 'closed'}`}>
          {colorsForSelection.map((color) => (
            <div className="color-box-instructor"  style={{backgroundColor: color}} onClick={() => {
              colorPickerClickHandler(moduleCode, color)}}> </div>
          ))}
        </div>
      </div>
      <div className='module-instructor' style={style}>
        <div className="modulecode-instructor">
          {moduleCode}
        </div>
      </div>
    </div>
  )
}

export default CalendarInstructor;
