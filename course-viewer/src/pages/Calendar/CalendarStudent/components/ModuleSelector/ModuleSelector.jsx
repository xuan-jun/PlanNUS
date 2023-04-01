import React, { useState, useEffect } from 'react';
import "./ModuleSelector.css";
import cross from "../../../../../assets/cross.svg" // import the cross for the module selector
import data from "./ModuleData.json" // import the module data here

import axios from 'axios';

const ModuleSelector = ({currentModules, setCurrentModules, currentSemester, currentModuleListAssignments, setCurrentModuleListAssignments}) => {
  // ideally we should have the background color mapped to each module
  const moduleStyle = {backgroundColor : "lightblue"};

  // search bar text state
  const [inputText, setInputText] = useState("");

  // current list of modules given the current semester
  const [moduleData, setModuleData] = useState([]);
  
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

    const params = {
      'semester' : semesterMapping[currentSemester],
      'module_list' : currentModules
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

  // handler for when we click on search results
  let searchClickHandler = (filteredModule) => {
    if (!currentModules.includes(filteredModule)) {
      var newModules = currentModules.concat();
      newModules.push(filteredModule);
      setCurrentModules(newModules);
    }
    setInputText("");
  }

  // module removal click handler
  let moduleRemovalClickHandler = (moduleCode) => {
    setCurrentModules(currentModules.filter(module => module !== moduleCode));
  }

  // rerender each time we type the inputText in the search bar
  useEffect(() => {
    setInputText(inputText);
  }, [inputText])

  return (
    <div className="module-selector">
      <div className="module-search">
        <h2>Search for Modules here</h2>
        <input className="search-bar" placeholder="Module Code Here"
        value={inputText} onChange={(e) => {inputHandler(e)}}/>
        <ModuleList inputText={inputText} searchClickHandler={searchClickHandler} moduleData={moduleData}/>
      </div>
      <h2>Modules Added</h2>
      <div className="modules-selected">
        {currentModules.map((module) => (
          <Module moduleCode={module} moduleStyle={moduleStyle} moduleRemovalClickHandler={moduleRemovalClickHandler}/>
        ))}
      </div>

    </div>
  )
};
// format the display of modules that have been selected
const Module = ({moduleCode, moduleStyle, moduleRemovalClickHandler}) => {

  return (
    <div className='module' style={moduleStyle}>
      <div className="modulecode">
        {moduleCode}
      </div>
      <img src={cross} onClick={() => moduleRemovalClickHandler(moduleCode)}/>
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
