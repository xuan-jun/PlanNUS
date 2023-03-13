import React, { useState, useEffect } from 'react';
import moment from 'moment';
import buildCalendar from '../../buildCalendar';
import dayStyles from '../../tileStyles';
import CalendarHeader from '../CalendarHeader/CalendarHeader';
import './CalendarBody.css'

const CalendarBody = () => {
  // calendar array of dates in the current view
  const [calendar, setCalendar] = useState([]);
  // currently selected date
  const [value, setValue] = useState(moment());

  // each time the selected date is changed, we can rebuild the calendar
  useEffect(() => {
    setCalendar(buildCalendar(value));
  }, [value])

  return (
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
              <div className="day"
                onClick = {() => setValue(day)}
              >
                <div
                  className={dayStyles(day, value)}
                >
                  {day.format("D").toString()}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
};

export default CalendarBody;
