import React from "react";
import Assignment from "./Assignment/buildAssignments";

const Assignments = (props) => {
  return (
      <div>
        <Assignment theme={props.theme}/>
      </div>
  );
}

export default Assignments;