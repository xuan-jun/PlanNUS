import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import { FormControl, InputLabel } from '@material-ui/core';
import axios from 'axios';
import useStyles from './PopupStyle';
import moment from 'moment';

const Popup = ({theme, open, setOpen, currentRow, setCurrentRow, assignments }) => {
  const classes = useStyles();

  const [name, setName] = useState(currentRow['Name']);
  const [type, setType] = useState(currentRow['Type']);
  const [group_or_indv, setGroupOrIndv] = useState(currentRow['Group or Individual']);
  const [weightage, setWeightage] = useState(currentRow['Weightage']);
  const [original_name, setOriginalName] = useState(currentRow['Name']);

  const reformattedStartDate = moment(currentRow['Start Date'], 'DD-MMM-YYYY').format('YYYY-MM-DD');
  const reformattedDueDate = moment(currentRow['Due Date'], 'DD-MMM-YYYY').format('YYYY-MM-DD');

  const [start_date, setStartDate] = useState(reformattedStartDate);
  const [due_date, setDueDate] = useState(reformattedDueDate);



 

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const isDuplicateName = assignments.some(a => a['Name'] === name && a['Module Code'] === currentRow['Module Code'] && a['Name'] !== currentRow['Name']);
    if (isDuplicateName) {
      alert('Assignment name must be unique within the module');
      return;
    }
  
    // Validate the start date and due date
    const startDate = moment(start_date, 'DD-MM-YYYY');
    const dueDate = moment(due_date, 'DD-MM-YYYY');
    if (dueDate.isBefore(startDate)) {
      alert('Due date must be later than start date');
      return;
    }
    if (startDate.isAfter(dueDate)) {
      alert('Start date must be before than due date');
      return;
    }
  
    // Validate the weightage
    const totalWeightage = assignments.reduce((sum, a) => sum + parseInt(a['Weightage']), 0);
    if (totalWeightage -parseInt(currentRow['Weightage']) + parseInt(weightage) > 100) {
      alert('The total weightage of all assignments under this module cannot be more than 100');
      return;
    }
    
      const params = {
          'original_name': original_name,
          'module_code': currentRow['Module Code'],
          'semester': currentRow['Semester'],
          'name': name,
          'weightage': weightage,
          'type': type,
          'group_or_indv': group_or_indv,
          'start_date': start_date,
          'due_date': due_date
      }

      axios.put('/update_assignments', {params})
      .then((response) => {
        console.log(response.data);
        setCurrentRow({...currentRow, 'Name': name, 'Start Date': start_date, 'Due Date': due_date,
        'Type': type, 'Group or Individual': group_or_indv, 'Weightage': weightage});
        setOpen(false);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {}, [open])

  const handleCancel = () => {
    setCurrentRow(null);
    setOpen(false);
  };

return (
  <div>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className={theme === "light" ? classes.popupLight : classes.popupDark}>Edit Assignment Details</DialogTitle>
      <DialogContent className={theme === "light" ? classes.popupLight : classes.popupDark}>
          <TextField
              className={theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              autoFocus
              margin="normal"
              id="name"
              label="Assignment Name"
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
          />
          <TextField
              className={theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              margin="normal"
              id="startdate"
              label="Start Date"
              type="date"
              fullWidth
              value= {start_date}
              onChange={(event) => setStartDate(event.target.value)}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
          />
          <TextField
              className={theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              margin="normal"
              id="duedate"
              label="Due Date"
              type="date"
              fullWidth
              value= {due_date}
              onChange={(event) => setDueDate(event.target.value)}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
          />
          <TextField
              className={theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              margin="normal"
              id="type"
              label="Weightage"
              type="number"
              fullWidth
              value={weightage}
              onChange={(event) => setWeightage(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
          />
          <div>
            <div style={{marginBottom: "20px", marginTop: "20px"}}>
              <FormControl className={theme === "light" ? classes.textFieldLight : classes.textFieldDark} fullWidth>
                <Select label="Type" value={type} onChange={(event) => setType(event.target.value)} fullWidth margin="normal">
                  <MenuItem value="Quiz">Quiz</MenuItem>
                  <MenuItem value="Project">Project</MenuItem>
                  <MenuItem value="Assignment">Assignment</MenuItem>
                  <MenuItem value="Participation">Participation</MenuItem>
                  <MenuItem value="Presentation">Presentation</MenuItem>
                  <MenuItem value="Exam">Exam</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
            <FormControl sx={{ m: 10 }} className={theme === "light" ? classes.textFieldLight : classes.textFieldDark} fullWidth>
              <Select label="Group or Individual" value={group_or_indv} 
              onChange={(event) => setGroupOrIndv(event.target.value)} fullWidth margin="normal">
                <MenuItem value="G">Group</MenuItem>
                <MenuItem value="I">Individual</MenuItem>
                <MenuItem value="I&G">Group and Individual</MenuItem>
              </Select>
            </FormControl>
            </div>
          </div>
      </DialogContent>
      <DialogActions className={theme === "light" ? classes.popupLight : classes.popupDark}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>
              Save
            </Button>
          </DialogActions>
    </Dialog>
  </div>
)};

export default Popup;