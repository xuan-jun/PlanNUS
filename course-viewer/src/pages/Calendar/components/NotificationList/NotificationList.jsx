import React, { useState, useEffect } from 'react';
import "./NotificationList.css";
import moment from 'moment';
import data from "./NotificationData.json" // import the Notification data here
import cross from "../../../../assets/cross.svg" // import the cross for the module selector
import DetailedView from '../DetailedView/DetailedView';

const NotificationList = () => {

  // records the notifications selected state
  const [notifications, setNotifications] = useState(data);
  // rerender each time the notification list changes
  useEffect(() => {}, [notifications]);

  // keeps track of whether we are looking at the detailed view
  const [isDetailed, setIsDetailed] = useState(false);
  // keeps track of whether we are looking at the detailed view
  const [notificationDate, setNotificationDate] = useState(moment());

  // notification removal click handler
  let notificationClickRemover = (assignmentName) => {
    setNotifications(notifications.filter(notification => notification['assignment-name'] !== assignmentName));
  }

  // handleClick events by the user on each of the tiles
  let handleClick = (date) => {
    setNotificationDate(date);
    setIsDetailed(!isDetailed);
  }

  return (
    <div className="notification-box">
        <DetailedView isDetailed={isDetailed} setIsDetailed={setIsDetailed} date={notificationDate}/>
        <h3>NOTIFICATIONS</h3>
        <ul className='notification-list'>
          {notifications.map(( notification ) => (
            <Notification title={notification['title']} assignmentName={notification['assignment-name']}
              date={notification['date']} notificationClickRemover={notificationClickRemover} handleClick={handleClick}/>
          ))}
        </ul>
    </div>
  )
}

const Notification = ({title, assignmentName, date, notificationClickRemover, handleClick}) => {
  return (
    <li className="notification">
      <div className='wrapper'>
        
      </div>
      <h4 className="notification-title">{title}</h4>
      <img src={cross} onClick={() => notificationClickRemover(assignmentName)}/>
      <div className="notification-details"  onClick={() => handleClick(date)}>
        <div className="assignment-date">{date}</div>
        <div className="assignment-name">{assignmentName}</div>
      </div>
    </li>
  )
}

export default NotificationList;
