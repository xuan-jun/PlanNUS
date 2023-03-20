const KEYS = {
    assignments: "assignments",
    assignmentId: "assignmentId"
  };
  
  export function insertAssignment(data) {
    let assignments = getAllAssignments();
    data["id"] = generateAssignmentId();
    assignments.push(data);
    localStorage.setItem(KEYS.assignments, JSON.stringify(assignments));
  }
  
  export function updateAssignment(data) {
    let assignments = getAllAssignments();
    let recordIndex = assignments.findIndex((x) => x.id === data.id);
    assignments[recordIndex] = { ...data };
    localStorage.setItem(KEYS.assignments, JSON.stringify(assignments));
  }
  
  export function generateAssignmentId() {
    if (localStorage.getItem(KEYS.assignmentId) == null)
      localStorage.setItem(KEYS.assignmentId, "0");
    var id = parseInt(localStorage.getItem(KEYS.assignmentId), 10);
    localStorage.setItem(KEYS.assignmentId, (++id).toString());
    return id;
  }
  
  export function getAllAssignments() {
    if (localStorage.getItem(KEYS.assignments) == null)
      localStorage.setItem(KEYS.assignments, JSON.stringify([]));
    let assignments = JSON.parse(localStorage.getItem(KEYS.assignments));
    //map departmentID to department title
    return assignments.map((x) => ({
      ...x,
    }));
  }
  