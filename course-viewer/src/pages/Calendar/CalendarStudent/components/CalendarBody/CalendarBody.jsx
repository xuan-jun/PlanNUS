import React, { useState, useEffect } from 'react';
import moment from 'moment';
import buildCalendar from '../../../buildCalendar';
import CalendarHeader from '../CalendarHeader/CalendarHeader';
import './CalendarBody.css'
import DetailedView from '../DetailedView/DetailedView';
import axios from 'axios'

const CalendarBody = ({currentModuleListAssignments, currentSemester, currentModules}) => {
  // calendar array of dates in the current view
  const [calendar, setCalendar] = useState([]);
  // currently selected date
  const [value, setValue] = useState(moment());
  // keeps track of whether we are looking at the detailed view
  const [isDetailed, setIsDetailed] = useState(false);

  // readjust the starting date when the semester changes
  useEffect(() => {
    if (['AY21/22 Sem 1', 'AY21/22 Sem 2', 'AY22/23 Sem 1', 'AY22/23 Sem 2'].includes(currentSemester)) {
      const startDateMapping = {
        'AY21/22 Sem 1' : moment('01 Aug 2021', 'DD MMM YYYY'),
        'AY21/22 Sem 2' : moment('01 Jan 2022', 'DD MMM YYYY'),
        'AY22/23 Sem 1' : moment('01 Aug 2022', 'DD MMM YYYY'),
        'AY22/23 Sem 2' : moment('01 Jan 2023', 'DD MMM YYYY')
      }
      setValue(startDateMapping[currentSemester])
    }
  }, [currentSemester])
  // each time the selected date is changed, we can rebuild the calendar
  useEffect(() => {
    setCalendar(buildCalendar(value));
  }, [value])


  // computes the colour for the background when we have 
  let dayStyle = (day, stressScore) => {
    let style = "";
    // assuming higher the worse it is
    if (!value.isSame(day, "month")) {
      style = style.concat("diffMonth")
    }
    else if (stressScore >= 7.5) {
      style = style.concat("stressed")
    } else if (stressScore >= 5 && stressScore <= 7.5) {
      style = style.concat("moderate")
    } else {
      style = style.concat("good")
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
      <DetailedView isDetailed={isDetailed} setIsDetailed={setIsDetailed} date={value} assignmentData={currentModuleListAssignments}/>
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
                handleClick={handleClick} currentModuleListAssignments={currentModuleListAssignments} currentModules={currentModules}/>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

const CalendarTile = ({ day, dayStyle, handleClick, currentModuleListAssignments, currentModules }) => {
  const formattedDate = day.format("D-MMM-YY");
  const currentDayData = currentModuleListAssignments.filter((day) => {
    return day['Due Date'] === formattedDate;
  })
  const currentDayTasks = currentDayData.length === 0 ? [] :
    currentDayData.map((assignment) => {
      // get the background color of the module
      const backgroundColor = currentModules.filter((module) => {
        // find the module code that we are trying to record
        return module['moduleCode'] === assignment['Module Code']
      }).map((module) => {return module['backgroundColor']})[0]

      return {
        'title' : `${assignment['Module Code']} ${assignment['Name']}`,
        'backgroundColor' : backgroundColor
      };
    });

  // compute the stress score for the day
  const stressScore = currentDayData.length === 0 ? [] :
  currentDayData.map((assignment) => {
    return assignment['stress_score'];
  }).reduce((a, b) => {return a+b}, 0)

  const tileStyle = dayStyle(day, stressScore);

  return (
    <div className={`calendar-tile ${tileStyle}`}
      onClick={() => handleClick(day)}>
      <div className={`day ${tileStyle}`}>
        {day.format("D").toString()}
      </div>
      <div className="current-day-tasks">
        {currentDayTasks.map((task) => (
          <div className="task" style={{'backgroundColor' : task['backgroundColor']}}>
            {task['title']}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarBody;
