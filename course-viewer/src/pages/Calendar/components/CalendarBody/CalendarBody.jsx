import React, { useState, useEffect } from 'react';
import moment from 'moment';
import buildCalendar from '../../buildCalendar';
import dayStyles from '../../tileStyles';
import CalendarHeader from '../CalendarHeader/CalendarHeader';
import './CalendarBody.css'
import DetailedView from '../DetailedView/DetailedView';

const CalendarBody = () => {
  // calendar array of dates in the current view
  const [calendar, setCalendar] = useState([]);
  // currently selected date
  const [value, setValue] = useState(moment());
  // keeps track of whether we are looking at the detailed view
  const [isDetailed, setIsDetailed] = useState(false);

  // each time the selected date is changed, we can rebuild the calendar
  useEffect(() => {
    setCalendar(buildCalendar(value));
  }, [value])

  const tileStyle = {
    backgroundColor:"lightgreen"
  }

  const currentDayTasks = [
    "Midterms",
    "Finals"
  ]

  // handleClick events by the user on each of the tiles
  let handleClick = (day) => {
    setValue(day);
    setIsDetailed(!isDetailed);
  }

  return (
    <div className='calendar-wrapper'>
      <DetailedView isDetailed={isDetailed} setIsDetailed={setIsDetailed} date={value}/>
      <div className="calendar">
        <CalendarHeader value={value} setValue={setValue}/>
        <div className="body">
          <div className="day-names">
            {
              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div className="day-name">
                  {d}
                </div>
              ))
            }
          </div>
          {calendar.map((week) => (
            <div className = "week">
              {week.map((day) => (
                <CalendarTile day={day} tileStyle = {tileStyle}
                  currentDayTasks={currentDayTasks} handleClick={handleClick}/>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

const CalendarTile = ({ day, tileStyle, currentDayTasks, handleClick }) => {
  return (
    <div className="calendar-tile" style={tileStyle}
      onClick={() => handleClick(day)}>
      <div className="day">
        {day.format("D").toString()}
      </div>
      <div className="current-day-tasks">
        {currentDayTasks.map((task) => (
          <div className="task">
            {task}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarBody;
