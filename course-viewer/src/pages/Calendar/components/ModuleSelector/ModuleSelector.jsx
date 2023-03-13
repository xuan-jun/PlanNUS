import React, { useState, useEffect } from 'react';
import "./ModuleSelector.css";
import cross from "../../../../assets/cross.svg" // import the cross for the module selector
import data from "./ModuleData.json" // import the module data here

const ModuleSelector = () => {
  // records the modules selected state
  const [modules, setModules] = useState([]);
  // rerender each time the module list changes
  useEffect(() => {}, [modules])
  // ideally we should have the background color mapped to each module
  const moduleStyle = {backgroundColor : "lightblue"};

  // search bar text state
  const [inputText, setInputText] = useState("");
  
  // handler for the searchbar
  let inputHandler = (e) => {
    //convert input text to lower case
    var upperCase = e.target.value.toUpperCase();
    setInputText(upperCase);
  };

  // handler for when we click on search results
  let searchClickHandler = (filteredModule) => {
    if (!modules.includes(filteredModule.text)) {
      var newModules = modules.concat();
      newModules.push(filteredModule.text);
      setModules(newModules);
    }
    setInputText("");
  }

  // module removal click handler
  let moduleRemovalClickHandler = (moduleCode) => {
    setModules(modules.filter(module => module !== moduleCode));
  }

  // rerender each time we type the inputText in the search bar
  useEffect(() => {
    setInputText(inputText);
  }, [inputText])

  return (
    <div className="module-selector">
      <h2>Modules Added</h2>
      <div className="modules-selected">
        {modules.map((module) => (
          <Module moduleCode={module} moduleStyle={moduleStyle} moduleRemovalClickHandler={moduleRemovalClickHandler}/>
        ))}
      </div>
      <div className="module-search">
        <h2>Search for Modules here</h2>
        <input className="search-bar" placeholder="Module Code Here"
        value={inputText} onChange={(e) => {inputHandler(e)}}/>
        <ModuleList inputText={inputText} searchClickHandler={searchClickHandler}/>
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
const ModuleList = ({inputText, searchClickHandler}) => {
  const inputUpper = inputText.toUpperCase();

  return (
    <ul className='search-filter-modules'>
      {inputUpper !== "" ? data.filter((module) => {
        return module.text.toUpperCase().includes(inputUpper);
      }).map((filteredModule) => (
        <li className="filtered-module" key={filteredModule.id}
        onClick = {() => searchClickHandler(filteredModule)}>
          {filteredModule.text}
          </li>
      )) : null}
    </ul>
  )
}

export default ModuleSelector;
