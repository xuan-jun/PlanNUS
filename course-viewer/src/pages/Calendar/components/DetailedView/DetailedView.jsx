import React from "react";
import './DetailedView.css'

function DetailedView({isDetailed, setIsDetailed, date}) {
  return (
    <div className={`detailed-view ${isDetailed ? "active" : "inactive"}`}>
      <div className="detailed-view-content">
        <button className="close-btn" onClick={() => setIsDetailed(!isDetailed)}>
          Return to Calendar View
        </button>
        <div>{date.toString()}</div>
        <div>This is a popup of the detailed view</div>
      </div>
    </div>
  );
}

export default DetailedView;
