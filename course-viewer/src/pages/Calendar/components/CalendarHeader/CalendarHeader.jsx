import React from "react";
import "./CalendarHeader.css"
import rightarrow from "../../../../assets/rightarrow.svg"

const CalendarHeader = ({value, setValue}) => {
  function currMonthName() {
    return value.format("MMMM");
  }
  
  function currYear() { // extracts the current year
    return value.format("YYYY");
  }

  function prevMonth() { // gets the next month
    return value.clone().subtract(1, "month");
  }

  function nextMonth() {
    return value.clone().add(1, "month");
  }

  return (
    <div className="header">
      <div className='previous'
        onClick={() => setValue(prevMonth())}>
          <img src = {rightarrow}/>
          </div>
      <div className='current'>
        <div className="current-month">
          {currMonthName()}
        </div>
        <div className="current-year">
         {currYear()}
        </div>
      </div>
      <div className='next'
        onClick={() => setValue(nextMonth())}>
        <img src = {rightarrow}/>
        </div>
    </div>
  )
}

export default CalendarHeader;