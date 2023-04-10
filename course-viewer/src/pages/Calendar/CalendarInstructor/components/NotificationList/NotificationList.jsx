import React, { useState, useEffect } from 'react';
import "./NotificationList.css";
import moment from 'moment';
import cross from "../../../../../assets/cross.svg" // import the cross for the module selector
import DetailedView from '../DetailedView/DetailedView';

const NotificationList = ({assignmentData, modulePairAssignment, stressScoreDaily, currentModule}) => {

  // records the notifications selected state
  const [notifications, setNotifications] = useState([]);
  // checks which are the values the stress scores that exceeds
  useEffect(() => {
    var notiDates = []
    for (const [key, value] of Object.entries(stressScoreDaily)) {
      if (value >= 7.5 && key) { // abritrary value
        notiDates.push(key);
      }
    }

    // sort by notification dates
    notiDates.sort(function (left, right) {
      return moment(left).diff(moment(right))
    })
    setNotifications(notiDates);
  }, [stressScoreDaily]);

  // keeps track of whether we are looking at the detailed view
  const [isDetailed, setIsDetailed] = useState(false);
  // keeps track of whether we are looking at the detailed view
  const [notificationDate, setNotificationDate] = useState(moment());

  // notification removal click handler
  let notificationClickRemover = (removedDate) => {
    setNotifications(notifications.filter((date) => date !== removedDate));
  }

  // handleClick events by the user on each of the tiles
  let handleClick = (date) => {
    setNotificationDate(date);
    setIsDetailed(!isDetailed);
  }

  return (
    <div className="notification-box">
        <DetailedView isDetailed={isDetailed} setIsDetailed={setIsDetailed} date={notificationDate} assignmentData={assignmentData} modulePairAssignment={modulePairAssignment} stressScoreDaily={stressScoreDaily}
        currentModule={currentModule}
        />
        <h3 className='notification-header'>NOTIFICATIONS</h3>
        {
          notifications.length === 0 ? 
          <h4 className='no-notifications'>No optimisation required!</h4> :
          <ul className='notification-list'>
            {notifications.map(( notification ) => (
              <Notification date={notification} notificationClickRemover={notificationClickRemover} handleClick={handleClick} assignmentData={assignmentData}/>
            ))}
          </ul>
        }
    </div>
  )
}

const Notification = ({date, notificationClickRemover, handleClick, assignmentData}) => {
  // extract the current list of assignments
  const currentAssignments = assignmentData.filter((assignment) => {
    return assignment['Due Date'] === date;
  })

  return (
    <li className="notification">
      <h4 className="notification-title">Optimisation Possible!</h4>
      <img src={cross} onClick={() => notificationClickRemover(date)}/>
      <div className="notification-details"  onClick={() => handleClick(date)}>
        <div className="assignment-date">{date}</div>
        <div className="assignments-container">{
          currentAssignments.map((assignment) => {
            return <div className="assignment-name">
              {assignment['Name']}
            </div>
          })
        }</div>
      </div>
    </li>
  )
}

export default NotificationList;
