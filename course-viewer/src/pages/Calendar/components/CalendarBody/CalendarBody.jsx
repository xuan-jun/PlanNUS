import React, { useState, useEffect } from 'react';
import moment from 'moment';
import buildCalendar from '../../buildCalendar';
import CalendarHeader from '../CalendarHeader/CalendarHeader';
import './CalendarBody.css'
import DetailedView from '../DetailedView/DetailedView';
import assignmentData from "./CalendarData.json";

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

  // computes the colour for the background when we have 
  let dayStyle = (day, stressScore) => {
    let style = "";
    // assuming higher the worse it is
    if (stressScore >= 7.5 && stressScore <= 10) {
      style = style.concat("stressed")
    } else if (stressScore >= 5 && stressScore <= 7.5) {
      style = style.concat("moderate")
    } else {
      style = style.concat("good")
    }
    if (!value.isSame(day, "month")) {
      style = style.concat(" ", "diffMonth")
    }
    return style;
  }

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
                <CalendarTile day={day} dayStyle = {dayStyle}
                handleClick={handleClick}/>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

const CalendarTile = ({ day, dayStyle, handleClick }) => {
  const formattedDate = day.format("D MMM YYYY");
  const currentDayData = assignmentData.filter((day) => {
    return day['day'] === formattedDate;
  })
  const currentDayTasks = currentDayData.length > 0 ? currentDayData[0]['tasks'] : [];
  const stressScore = currentDayData.length > 0 ? currentDayData[0]['stressScore'] : null;

  const tileStyle = dayStyle(day, stressScore);

  return (
    <div className={`calendar-tile ${tileStyle}`}
      onClick={() => handleClick(day)}>
      <div className={`day ${tileStyle}`}>
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
