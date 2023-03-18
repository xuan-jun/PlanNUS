import React from "react";
import './DetailedView.css'

function DetailedView({isDetailed, setIsDetailed, date}) {
  return (isDetailed) ? (
    <div className="detailed-view">
      <div className="detailed-view-content">
        <button className="close-btn" onClick={() => setIsDetailed(!isDetailed)}>close</button>
        <div>{date.toString()}</div>
        <div>This is a popup of the detailed view</div>
      </div>
    </div>
  ) : "";
}

export default DetailedView;
