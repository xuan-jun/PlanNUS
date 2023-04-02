import React, { useState, useEffect } from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import useStyles from './AssignmentTableStyle';
import axios from 'axios';
import Popup from '../EditPopup/Popup';

const AssignmentTable = ({theme, selectedModule, semester}) => {      
    const classes = useStyles();
  
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        if (selectedModule) {
            const params = {
                'module_code' : selectedModule,
                'semester' : semester,
              }
              axios.get('/get_assignments', {params})
              .then((response) => {
                setAssignments(response.data)
              })
              .catch((err) => console.log(err));
        }
     }, [selectedModule])

     //for sorting function
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    const handleEditClick = (row) => {
        setOpen(true);
        setCurrentRow(row);
      };

     const handleSortClick = (columnName) => {
        if (sortColumn === columnName) {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
          setSortColumn(columnName);
          setSortOrder("asc");
        }
      };
      
      const sortedAssignments = assignments.slice().sort((a, b) => {
        if (sortColumn) {
          const aValue = a[sortColumn];
          const bValue = b[sortColumn];
          if (aValue < bValue) {
            return sortOrder === "asc" ? -1 : 1;
          } else if (aValue > bValue) {
            return sortOrder === "asc" ? 1 : -1;
          }
        }
        return 0;
      });



  return (
    <div>
        <TableContainer>
            <Table className={theme === "light" ? classes.tableLight : classes.tableDark} stickyHeader="true">
                <TableHead>
                    <TableRow>
                        <TableCell onClick={() => handleSortClick("Name")}>
                        Assignment Name {sortColumn === "Name" && (sortOrder === "asc" ? "▲" : "▼")}
                        </TableCell>
                        <TableCell onClick={() => handleSortClick("Start Date")}>
                        Start Date {sortColumn === "Start Date" && (sortOrder === "asc" ? "▲" : "▼")}
                        </TableCell>
                        <TableCell onClick={() => handleSortClick("Due Date")}>
                        Due Date {sortColumn === "Due Date" && (sortOrder === "asc" ? "▲" : "▼")}
                        </TableCell>
                        <TableCell onClick={() => handleSortClick("Type")}>
                        Type {sortColumn === "Type" && (sortOrder === "asc" ? "▲" : "▼")}
                        </TableCell>
                        <TableCell onClick={() => handleSortClick("Group Or Individual")}>
                        Group Or Individual {sortColumn === "Group Or Individual" && (sortOrder === "asc" ? "▲" : "▼")}
                        </TableCell>
                        <TableCell onClick={() => handleSortClick("Weightage")}>
                        Weightage (%) {sortColumn === "Weightage" && (sortOrder === "asc" ? "▲" : "▼")}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedAssignments.map((assignment) => (
                    <TableRow key={assignment} value={assignment} hover onClick={() => handleEditClick(assignment)}>
                        <TableCell>{assignment['Name']}</TableCell>
                        <TableCell>{assignment['Start Date']}</TableCell>
                        <TableCell>{assignment['Due Date']}</TableCell>
                        <TableCell>{assignment['Type']}</TableCell>
                        <TableCell>{assignment['Group or Individual']}</TableCell>
                        <TableCell>{assignment['Weightage']}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        {open && currentRow && (
        <Popup
            theme={theme}
            open={open}
            setOpen={setOpen}
            currentRow={currentRow}
            setCurrentRow={setCurrentRow}
            assignments={assignments}
        />
        )}
    </div>
  )
};

export default AssignmentTable;
