import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from '../ModuleTitle/Title';
import AddAssignmentButton from "../AssignmentButton/Button";

// Generate Order Data
function createData(id, name, startdate, enddate, weight) {
  return { id, name, startdate, enddate, weight };
}

const rows = [
  createData(
    0,
    "Docker Assignment",
    "16 Mar, 2023",
    "23 Mar, 2023",
    5
  ),
  createData(
    1,
    "Git Quiz",
    "16 Mar, 2023",
    "23 Mar, 2023",
    10
  ),
  createData(
    2,
    "Peer Review",
    "16 Mar, 2023",
    "23 Mar, 2023",
    5
  ),
  createData(
    3,
    "Assignment 1",
    "16 Mar, 2023",
    "23 Mar, 2023",
    15
  ),
  createData(
    4,
    "Assignment 2",
    "15 Mar, 2023",
    "23 Mar, 2023",
    5
  )
];

export default function AssignmentTable() {
  return (
    <React.Fragment>
      <AddAssignmentButton />
      <Title>DSA3101</Title>
      <Table className="atable">
        <TableHead>
          <TableRow>
            <TableCell>Assignment Name</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Weightage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="abody">
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell numeric component="a" href="/detailedview">{row.name}</TableCell>
              <TableCell>{row.startdate}</TableCell>
              <TableCell>{row.enddate}</TableCell>
              <TableCell>{row.weight}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
