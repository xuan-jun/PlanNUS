import React from "react";
import { Navigate } from "react-router-dom";

function AddAssignment() {
  const [addNewAssignment, setAddNewAssignment] = React.useState(false);

  if (addNewAssignment) {
    return <Navigate to="/assignments/addnew" />;
  }

  return (
    <div>
      AddAssignment
      <button
        onClick={() => {
          setAddNewAssignment(true);
        }}
      >
        {" "}
        I want to add a new assignment
      </button>
    </div>
  );
}

export default AddAssignment;

