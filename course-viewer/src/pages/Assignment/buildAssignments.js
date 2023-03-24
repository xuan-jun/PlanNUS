import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

//assignment table style
const useStyles = makeStyles(theme => ({
  headerLightText: {
    color: "#455a63",
    backgroundColor:"#ffffff",
    fontWeight: "700"
  },
  headerDarkText: {
    color: "#fffefe",
    backgroundColor:"#455a63",
    fontWeight: "700"
  },
  lightText: {
    color: "#455a63",
    backgroundColor:"#ffffff"
  },
  darkText: {
    color: "#fffefe",
    backgroundColor:"#455a63"
  },
  newButton: {
    position: "absolute",
    right: "110px",
    top: "100px"
  }
}));

//initalData to test
const initialData = [
  { id: 1, assignment: "Assignment 1", startDate: "2022-01-01", endDate: "2022-01-10", weightage: 20 },
  { id: 2, assignment: "Assignment 2", startDate: "2022-02-01", endDate: "2022-02-10", weightage: 30 },
  { id: 3, assignment: "Assignment 3", startDate: "2022-03-01", endDate: "2022-03-10", weightage: 50 },
  { id: 4, assignment: "Assignment 4", startDate: "2022-03-01", endDate: "2022-03-10", weightage: 5 },
  { id: 5, assignment: "Assignment 5", startDate: "2022-03-01", endDate: "2022-03-10", weightage: 10 },
  { id: 6, assignment: "Assignment 6", startDate: "2022-03-01", endDate: "2022-03-10", weightage: 20 },
  { id: 7, assignment: "Assignment 7", startDate: "2022-03-01", endDate: "2022-03-10", weightage: 40 },
  { id: 8, assignment: "Assignment 8", startDate: "2022-03-01", endDate: "2022-03-10", weightage: 5 },
  { id: 9, assignment: "Assignment 9", startDate: "2022-03-01", endDate: "2022-03-10", weightage: 10 }
];

const Assignment = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(initialData);
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

  //for edit pop-up cancel button
  const handleCancelClick = () => {
    setCurrentRow(null);
    setOpen(false);
  };


  return (
    <div style={{padding:10, margin:"40px 100px"}}>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <Typography variant="h4" align="left" className={props.theme === "light" ? classes.headerLightText : classes.headerDarkText} gutterBottom> DSA3101 </Typography>
          </Box>
        <Button className={classes.newButton} component={Link} to="/assignments/addnew" variant="contained" color="primary">
        Add New
        </Button>
        <TableContainer>
          <Table aria-label="simple table" className={props.theme === "light" ? "table-light" : "table-dark"}>
            <TableHead>
              <TableRow>
                <TableCell className={props.theme === "light" ? classes.headerLightText : classes.headerDarkText}>Assignment</TableCell>
                <TableCell className={props.theme === "light" ? classes.headerLightText : classes.headerDarkText} align="right">Start Date</TableCell>
                <TableCell className={props.theme === "light" ? classes.headerLightText : classes.headerDarkText} align="right">End Date</TableCell>
                <TableCell className={props.theme === "light" ? classes.headerLightText : classes.headerDarkText} align="right">Weightage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} hover onClick={() => handleEditClick(row)}>
                  <TableCell component="th" scope="row" className={props.theme === "light" ? classes.lightText : classes.darkText}>
                    {row.assignment}
                  </TableCell>
                  <TableCell className={props.theme === "light" ? classes.lightText : classes.darkText} align="right">{row.startDate}</TableCell>
                  <TableCell className={props.theme === "light" ? classes.lightText : classes.darkText} align="right">{row.endDate}</TableCell>
                  <TableCell className={props.theme === "light" ? classes.lightText : classes.darkText} align="right">{row.weightage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog fullWidth='lg' maxWidth='lg'open={open} onClose={handleCancelClick}>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="assignment"
              label="Assignment"
              fullWidth
              value={currentRow?.assignment}
              onChange={(e) => setCurrentRow({ ...currentRow, assignment: e.target.value })}
            />
            <TextField
              margin="dense"
              id="startDate"
              label="Start Date"
              type="date"
              fullWidth
              value={currentRow?.startDate}
              onChange={(e) => setCurrentRow({ ...currentRow, startDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              id="endDate"
              label="End Date"
              type="date"
              fullWidth
              value={currentRow?.endDate}
              onChange={(e) => setCurrentRow({ ...currentRow, endDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              id="weightage"
              label="Weightage"
              type="number"
              fullWidth
              value={currentRow?.weightage}
              onChange={(e) => setCurrentRow({ ...currentRow, weightage: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelClick} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveClick} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};

export default Assignment;