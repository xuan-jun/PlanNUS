import React, { useState, useEffect } from 'react';
import moment from 'moment';
import buildCalendar from '../../../buildCalendar';
import CalendarHeader from '../CalendarHeader/CalendarHeader';
import './CalendarBody.css'
import DetailedView from '../DetailedView/DetailedView';
import axios from 'axios'

const CalendarBody = ({currentModule, semester, assignmentData, setAssignmentData, modulePairAssignment, setModulePairAssignment, stressScoreDaily, setStressScoreDaily}) => {
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

  // refreshes each time the currentModule changes
  useEffect(() => {
    if (currentModule) {
      const params = {
        "module_code" : currentModule,
        "semester" : semester
      }
      // get assignments from the current module
      async function get_assignments() {
        await axios.get('/get_assignments', {params})
        .then((response) => {
          const data = response.data
          setAssignmentData(data);
        })
        .catch((err) => {console.log(err)})
      }
      get_assignments();

      // get assignments from the relevant module pairings
      async function get_assignment_pairings() {
        await axios.get('/get_assignment_pairings', {params})
        .then((response) => {
          const data = response.data
          console.log(data)
          setModulePairAssignment(data);
        })
        .catch((err) => {console.log(err)})
      }
      get_assignment_pairings();
    }
  }, [currentModule])

  useEffect(() => {
    if (currentModule !== "" && currentModule !== "My View") {
      // keeps track of the stress for each day
      var stressCounter = {};
      // loop through all the assignments and add the day : count
      for (const assignment of assignmentData.concat(modulePairAssignment)) {
        const day = assignment['Due Date'];
        const stressScore = assignment['stress_score'];
  
        if (day in stressCounter) {
          stressCounter[day] += stressScore
        } else {
          stressCounter[day] = stressScore
        }
      }
      setStressScoreDaily(stressCounter);
    } else {
      setStressScoreDaily({});
    }
  }, [assignmentData, modulePairAssignment])

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
      <DetailedView isDetailed={isDetailed} setIsDetailed={setIsDetailed} date={value} assignmentData={assignmentData} modulePairAssignment={modulePairAssignment} stressScoreDaily={stressScoreDaily} currentModule={currentModule}/>
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
                handleClick={handleClick} assignmentData={assignmentData} stressScoreDaily={stressScoreDaily}/>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

const CalendarTile = ({ day, dayStyle, handleClick, assignmentData, stressScoreDaily }) => {
  const formattedDate = day.format("D-MMM-YY");

  // filter for current day data for current module
  const currentDayData = assignmentData.filter((day) => {
    return day['Due Date'] === formattedDate;
  })

  // filter for current day task for current module
  const currentDayTasks = currentDayData.length === 0 ? [] :
    currentDayData.map((assignment) => {
      return assignment['Name'];
    });

  // get the stressScore from the original computed value
  const stressScore = stressScoreDaily[formattedDate];

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
