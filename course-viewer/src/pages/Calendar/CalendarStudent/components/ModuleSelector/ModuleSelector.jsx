import React, { useState, useEffect } from 'react';
import "./ModuleSelector.css";
import cross from "../../../../../assets/cross.svg" // import the cross for the module selector
import data from "./ModuleData.json" // import the module data here

import axios from 'axios';

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


const ModuleSelector = ({currentModules, setCurrentModules, currentSemester, currentModuleListAssignments, setCurrentModuleListAssignments}) => {

  // search bar text state
  const [inputText, setInputText] = useState("");

  // current list of modules given the current semester
  const [moduleData, setModuleData] = useState([]);

  // state to record which module's colour picker is open
  const [moduleOpened, setModuleOpened] = useState('')

  // reloads whenever the current semester changes to get the modules available
  useEffect(() => {
    const semesterMapping = {
      'AY21/22 Sem 1' : 2110,
      'AY21/22 Sem 2' : 2120,
      'AY22/23 Sem 1' : 2210,
      'AY22/23 Sem 2' : 2220
    }

    const params = {
      'semester' : semesterMapping[currentSemester]
    }

    async function modulesForSemester() {
      await axios.get('/modules_for_semester', {params})
      .then((response) => {
        setModuleData(response.data);
      })
      .catch((err) => {console.log(err)});
    }

    modulesForSemester();


  }, [currentSemester])

  // get the list of assignments for the modules selected
  useEffect(() => {
    const semesterMapping = {
      'AY21/22 Sem 1' : 2110,
      'AY21/22 Sem 2' : 2120,
      'AY22/23 Sem 1' : 2210,
      'AY22/23 Sem 2' : 2220
    }

    const moduleList = currentModules.map((module) => {
      return module['moduleCode'];
    })

    const params = {
      'semester' : semesterMapping[currentSemester],
      'module_list' : moduleList
    }

    async function moduleListAssignments() {
      await axios.get('/module_list_assignments', {params})
      .then((response) => {
        setCurrentModuleListAssignments(response.data);
      })
      .catch((err) => {console.log(err)});
    }

    moduleListAssignments();

  }, [currentModules, currentSemester])

  // handler for the searchbar
  let inputHandler = (e) => {
    //convert input text to lower case
    var upperCase = e.target.value.toUpperCase();
    setInputText(upperCase);
  };

  // handler for color picker
  let colorPickerClickHandler = (moduleCode, color) => {
    var newModules = currentModules.concat();
    // find the index of the module that we want to change
    const index = newModules.findIndex((module) => {
      return module['moduleCode'] === moduleCode
    })
    // set the color for the newly selected color
    newModules[index]['backgroundColor'] = color

    // update the list of current modules
    setCurrentModules(newModules)

  }

  // handler for when we click on search results
  let searchClickHandler = (filteredModule) => {
    // check if the current module has already been added
    const moduleCheck = currentModules.filter((module) => {
      return module['moduleCode'] === filteredModule;
    })

    // if the module has not been added in before
    if (moduleCheck.length === 0) {
      const backgroundColor = colorsForSelection[Math.floor(Math.random() * colorsForSelection.length)]
      var newModules = currentModules.concat();
      // add the filtered module with its background color
      newModules.push({
        'moduleCode' : filteredModule,
        'backgroundColor' : backgroundColor
      });
      // set the new current modules list
      setCurrentModules(newModules);
    }
    setInputText("");
  }

  // module removal click handler
  let moduleRemovalClickHandler = (moduleCode) => {
    setCurrentModules(currentModules.filter((module) => module['moduleCode'] !== moduleCode));
  }

  // rerender each time we type the inputText in the search bar
  useEffect(() => {
    setInputText(inputText);
  }, [inputText])

  return (
    <div className="module-selector">
      <div className="module-search">
        <h2 className='module-title'>Search for Modules here</h2>
        <input className="search-bar"
        placeholder=" "
        value={inputText} onChange={(e) => {inputHandler(e)}}/>
        <ModuleList inputText={inputText} searchClickHandler={searchClickHandler} moduleData={moduleData}/>
      </div>
      <h2>Modules Added</h2>
      <div className="modules-selected">
        {currentModules.map((module) => (
          <Module moduleCode={module['moduleCode']} backgroundColor={module['backgroundColor']} 
          moduleRemovalClickHandler={moduleRemovalClickHandler}
          moduleOpened={moduleOpened}
          setModuleOpened = {setModuleOpened} 
          colorPickerClickHandler={colorPickerClickHandler}/>
        ))}
      </div>
    </div>
  )
};
// format the display of modules that have been selected
const Module = ({moduleCode, backgroundColor, moduleRemovalClickHandler, moduleOpened, setModuleOpened, colorPickerClickHandler}) => {
  const style = {
    backgroundColor : backgroundColor
  }

  return (
    <div className="module-added">
      <div className="selected-color" style={style} onClick={() => moduleOpened===moduleCode ? setModuleOpened("") : setModuleOpened(moduleCode)}>
        <div className={`color-picker ${moduleOpened===moduleCode ? 'open' : 'closed'}`}>
          {colorsForSelection.map((color) => (
            <div className="color-box"  style={{backgroundColor: color}} onClick={() => {
              colorPickerClickHandler(moduleCode, color)}}> </div>
          ))}
        </div>
      </div>
      <div className='module' style={style}>
        <div className="modulecode">
          {moduleCode}
        </div>
        <img src={cross} onClick={() => moduleRemovalClickHandler(moduleCode)}/>
      </div>
    </div>
  )
}

// list of filtered modules from the search bar
const ModuleList = ({inputText, searchClickHandler, moduleData}) => {
  const inputUpper = inputText.toUpperCase();

  return (
    <ul className='search-filter-modules'>
      {inputUpper !== "" ? moduleData.filter((module) => {
        return module.toUpperCase().includes(inputUpper);
      }).map((filteredModule) => (
        <li className="filtered-module" key={filteredModule}
        onClick = {() => searchClickHandler(filteredModule)}>
          {filteredModule}
          </li>
      )) : null}
    </ul>
  )
}

export default ModuleSelector;
