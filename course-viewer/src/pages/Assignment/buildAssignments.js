import React, { useState } from "react";
import { Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom';
import { Filter } from '../Calendar/components/Filter/Filter';
import { FormControl, InputLabel } from '@mui/material';

//page style
const font =  "'Inter', sans-serif";
const useStyles = makeStyles(theme => ({
    tableDark: {
      maxWidth: 1200,
      paddingTop: 90,
      borderBottom: "none",
      marginTop: theme.spacing(3),
      '& thead th': {
          fontWeight: '600',
          color: "#fffefe",
          backgroundColor: "#455a63",
      },
      '& tbody td': {
        color: "#fffefe",
        fontWeight: '300',
        border: '0',
        fontFamily: font,
      },
      '& tbody tr': {
          backgroundColor: "#455a63"
      },
      '& tbody tr:hover': {
          backgroundColor: '#f4bc1c !important',
          cursor: 'pointer'
      },
    },
    tableLight: {
      maxWidth: 1200,
      paddingTop: 90,
      borderBottom: "none",
      marginTop: theme.spacing(3),
      '& thead th': {
          fontFamily: font,
          fontWeight: '600',
          color: "#455a63",
          backgroundColor: "#ffffff",
      },
      '& tbody td': {
          color: "#455a63",
          fontFamily: font,
          fontWeight: '300',
          border: '0',
      },
      '& tbody tr': {backgroundColor: "#ffffff"},
      '& tbody tr:hover': {
        backgroundColor: '#fffbf2 !important',
        cursor: 'pointer'
      }       
    },

  //popup style
    popupLight: {
      fontFamily: font,
      backgroundColor: "#ffffff",
      color: "#455a63",
    }, 
    popupDark : {
      fontFamily: font,
      backgroundColor: "#455a63",
      color: "#fffefe",
      Input: "#fffefe !important",
      borderColor: "#fffefe !important"
    },

  //text field in popup style
  textFieldLight: {
  },
    textFieldDark: {
      '& label.Mui-focused': {
        color: '#f4bc1c', // set the focused label color
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'none', // set the focused border color
      },
      '& .MuiInputBase-root': {
        color: '#fffefe', // set the default text color
      },
      '& .MuiInputLabel-root': {
        color: '#fffefe', // set the default label color
      },
      '& .MuiInputBase-input': {
        color: '#fffefe', // change the input text color
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#fffefe', // change the border color
        },
      },
    },
  moduleSelectLight: {
    fontFamily: font,
    position: "absolute",
    left: 425,
    top: "100px",
    fontSize: "30px",
    color: "#455a63",
  },
  moduleSelectDark: {
    fontFamily: font,
    position: "absolute",
    left: 425,
    top: "100px",
    fontSize: "30px",
    color: "#fffefe",
  },
  newButton: {
    position: "absolute",
    right: 425,
    top: "100px"
  },  
}));

const modules = ['DSA3101', 'DSA2101', 'DSA3102']; // an array of module options
//const changeTypes = ['Quiz', 'Project', 'Assignment', 'Participation', 'Presentation', 'Exam'] //array of assignment types
const indivGrp = [
  {
    value: '1',
    label: 'Individual'
  },
  {
    value: '2',
    label: 'Group'
  }
];
const changeTypes = [
  {
    value: '1',
    label: 'Quiz',
  },
  {
    value: '2',
    label: 'Project',
  },
  {
    value: '3',
    label: 'Assignment',
  },
  {
    value: '4',
    label: 'Participation',
  },
  {
    value: '5',
    label: 'Presentation',
  },
  {
    value: '6',
    label: 'Exam',
  }
];
const assignments = [
  { "id": 1, "module": "DSA3101", "issueName": "Assignment 1", "changeTypes": "Assignment", "startDate": "2022-01-01", "endDate": "2022-01-09", "optimisedEndDate": "2022-01-14", "indivGrp": "Individual", "weightage": 10 },
  { "id": 2, "module": "DSA3102", "issueName": "Assignment 2", "changeTypes": "Assignment", "startDate": "2022-01-02", "endDate": "2022-01-12", "optimisedEndDate": "2022-01-15", "indivGrp": "Group", "weightage": 20 },
  { "id": 3, "module": "DSA2101", "issueName": "Assignment 3", "changeTypes": "Assignment","startDate": "2022-01-05", "endDate": "2022-01-15", "optimisedEndDate": "2022-01-16", "indivGrp": "Group", "weightage": 15 },
  { "id": 4, "module": "DSA3101", "issueName": "Assignment 4", "changeTypes": "Assignment","startDate": "2022-01-07", "endDate": "2022-01-10", "optimisedEndDate": "2022-01-17", "indivGrp": "Individual", "weightage": 25 },
  { "id": 5, "module": "DSA3101", "issueName": "Assignment 10", "changeTypes": "Assignment","startDate": "2022-10-01", "endDate": "2022-10-10", "optimisedEndDate": "2022-10-14", "indivGrp": "Group", "weightage": 19 }
];

const Assignment = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(assignments);
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  //for edit pop-up action
  const handleEditClick = (row) => {
    setOpen(true);
    setCurrentRow(row);
  };

  //for edit pop-up save action
  const handleSaveClick = () => {
    const newData = data.map((d) => {
      if (d.id === currentRow.id) {
        return { ...currentRow };
      }
      return d;
    });
    setData(newData);
    setCurrentRow(null);
    setOpen(false);
  };

  //for edit pop-up cancel action
  const handleCancelClick = () => {
    setCurrentRow(null);
    setOpen(false);
  };


   //for module filter
  const [selectedModule, setSelectedModule] = useState(modules[0]); // initialize the selected module to the first module option

  const handleModuleChange = (event) => {
    setSelectedModule(event.target.value); // update the selected module state when the user selects a module option
  };

  const filteredAssignments = assignments.filter((assignment) => assignment.module === selectedModule); // filter the assignments based on the selected module


  //for sorting function
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  
  const handleSortClick = (columnName) => {
    if (sortColumn === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortOrder("asc");
    }
  };
  
  const sortedAssignments = filteredAssignments.slice().sort((a, b) => {
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
      <Select value={selectedModule} onChange={handleModuleChange} className={props.theme === "light" ? classes.moduleSelectLight : classes.moduleSelectDark}>
        {modules.map((module) => (
          <MenuItem key={module} value={module}>{module}</MenuItem>
        ))}
      </Select>
        <Button className={classes.newButton} component={Link} to="/assignments/addnew" variant="contained" color="primary">
        Add New
        </Button>
      <TableContainer>
        <Table className={props.theme === "light" ? classes.tableLight : classes.tableDark} stickyHeader="true">
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSortClick("issueName")}>
              Name {sortColumn === "issueName" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell onClick={() => handleSortClick("changeTypes")}>
              Type {sortColumn === "changeTypes" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell onClick={() => handleSortClick("startDate")}>
              Start Date {sortColumn === "startDate" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell onClick={() => handleSortClick("endDate")}>
              End Date {sortColumn === "endDate" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell onClick={() => handleSortClick("optimisedEndDate")}>
              Optimised End Date {sortColumn === "optimisedEndDate" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell onClick={() => handleSortClick("indivGrp")}>
              Individual or Group {sortColumn === "indivGrp" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell onClick={() => handleSortClick("weightage")}>
              Weightage (%) {sortColumn === "weightage" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableCell>
          </TableRow>
        </TableHead>
          <TableBody>
            {sortedAssignments.map((assignment) => (
              <TableRow key={assignment.id} hover onClick={() => handleEditClick(assignment)}>
                <TableCell>{assignment.issueName}</TableCell>
                <TableCell>{assignment.changeTypes}</TableCell>
                <TableCell>{assignment.startDate}</TableCell>
                <TableCell>{assignment.endDate}</TableCell>
                <TableCell>{assignment.optimisedEndDate}</TableCell>
                <TableCell>{assignment.indivGrp}</TableCell>
                <TableCell>{assignment.weightage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        <Dialog fullWidth='lg' open={open} onClose={handleCancelClick}>
          <DialogTitle className={props.theme === "light" ? classes.popupLight : classes.popupDark}>
            Edit Assignment</DialogTitle>
          <DialogContent className={props.theme === "light" ? classes.popupLight : classes.popupDark}>
            <TextField 
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              autoFocus id="issueName" label="Name" fullWidth margin="normal"
              value={currentRow?.issueName}
              onChange={(e) => {
                const updatedRow = { ...currentRow, issueName: e.target.value };
                setCurrentRow(updatedRow);
              }}
            />

            <TextField
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              autoFocus id="changeTypes" label="Type" fullWidth margin="normal"
              select
              defaultValue="3"
            >
              {changeTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              id="startDate "label="Start Date" type="date" fullWidth margin="normal"
              value={currentRow?.startDate}
              onChange={(e) => {
                const updatedRow = { ...currentRow, startDate: e.target.value };
                setCurrentRow(updatedRow);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              id="endDate" label="End Date" type="date" fullWidth margin="normal"
              value={currentRow?.endDate}
              onChange={(e) => {
                const updatedRow = { ...currentRow, endDate: e.target.value };
                setCurrentRow(updatedRow);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              autoFocus id="indivGrp" label="Individual or Group" fullWidth margin="normal"
              select
              defaultValue="1"
            >
              {indivGrp.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              id="weightage" label="Weightage" type="number" fullWidth margin="normal"
              value={currentRow?.weightage}
              onChange={(e) => {
                const updatedRow = { ...currentRow, weightage: e.target.value };
                setCurrentRow(updatedRow);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelClick}>Cancel</Button>
            <Button onClick={handleSaveClick}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};

export default Assignment;