import React from "react";
import Assignment from "./Assignment/buildAssignments";

const Assignments = ({theme, token, selectedModule, setSelectedModule}) => {
  return (
      <div>
        <Assignment theme={theme} token={token}
        selectedModule={selectedModule} setSelectedModule={setSelectedModule}/>
      </div>
  );
}

export default Assignments;