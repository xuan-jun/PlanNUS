import React, { useState } from 'react';
import "./Filter.css"
import dropDownArrow from "../../../../assets/dropdownarrow.svg"

const Filter = ({filterType, filterTitle, filters}) => {
  const [currentFilter, setCurrentFilter] = useState(`Please Select ${filterType}`);
  const [isOpen, setIsOpen] = useState(false); 

  return (
    <div className="filter">
      <div className="filter-description">{filterTitle}</div>
      <div className="currently-selected-filter">
        <div className="current-filter">
          {currentFilter}
        </div>
        <img src={dropDownArrow} onClick = {() => {setIsOpen(!isOpen)}} />
      </div>
      <ul className={`filter-menu ${isOpen ? "active" : "inactive"}`}>
        {filters.map((filter) => (
          <FilterItem filterName={filter} onClick={() => {
            setCurrentFilter(filter)
            setIsOpen(!isOpen)
          }}/>
        ))}
      </ul>
    </div>
  )
};

const FilterItem = (props) => {
  return (
    <li className='filter-item' onClick={props.onClick}>
      {props.filterName}
    </li>
  )
}

export default Filter;
