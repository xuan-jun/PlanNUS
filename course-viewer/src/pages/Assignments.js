import React from "react";
import Assignment from "./Assignment/buildAssignments";

const Assignments = ({theme, token}) => {
  return (
      <div>
        <Assignment theme={theme} token={token} />
      </div>
  );
}

export default Assignments;