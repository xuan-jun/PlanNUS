import React, { useEffect, useState, useRef } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, Typography } from '@mui/material';
import { FormControl, InputLabel } from '@material-ui/core';
import axios from 'axios';
import useStyles from './PopupStyle';
import moment from 'moment';
import './Tiles.css';

//tiles
const Tile = ({ dueDate, date, stressScores, setConstDiff, selectedDate, setSelectedDate }) => {

  //get the stress score
  const formatDate = (date) => moment(date).format('DD-MMM-YY');
  const stressScore = stressScores[formatDate(date)];

  //calculate the difference between current stress score and new selected due date stress score
  const diff = () => {
    if (stressScore === 'Before start date') {
      return 'Not Applicable!'
    }
      const change = stressScores[dueDate] - stressScore
      return change
  };


  // Set color based on stress score
  let color;
   if (stressScore === 'Before start date') {
    color = 'rgba(128, 128, 128, 0.2)'; // gray
  } else if (stressScore < 5) {
    color = 'rgba(51, 155, 83, 0.2)'; // good
  } else if (stressScore >= 5 && stressScore < 7.5) {
    color = 'rgba(247, 151, 0, 0.3)'; // moderate
  } else if (stressScore >= 7.5) {
    color = 'rgba(202, 32, 45, 0.3)'; // stressed
  } else {
    color = 'rgba(250, 250, 250, 0)'; // null
  } 

  //change colour when tile selected
  const isSelected = selectedDate === date;

  return (
    <div className={`tile${isSelected ? ' selected' : ''}`} style={{ backgroundColor: color }} onClick={() => {
      setSelectedDate(date);
      setConstDiff(diff());
    }}>
      <div className="date">{date}</div>
      <div className="stress-score">
        {typeof stressScore === "string" ? stressScore : Math.floor(stressScore)}
      </div>
    </div>
  );
};

const TileGroup = ({ selectedModule, semester, name, weightage, type, group_or_indv, start_date, due_date}) => {

  const [stressScores, setStressScores] = useState([]);
  const [bestDates, setBestDates] = useState([]);
  
  //to display increase or decrease
  const [constDiff, setConstDiff] = useState(null);

  const [selectedTile, setSelectedTile] = useState(null);



  useEffect(() => {
    const params = {
      'module_code': selectedModule,
      'semester': semester,
      'name': name,
      'weightage': weightage,
      'type': type,
      'group_or_indv': group_or_indv,
      'start_date': start_date,
      'due_date': due_date
    }
    console.log(start_date)
    console.log(due_date)
    axios.get('/get_window_stresses', {params})
    .then((response => {
      const data = response.data;
      setStressScores(data['stress_scores']);
      setBestDates(data['best_dates']);
    }))
    .catch((err) => console.log(err));
    }, [])

    


  //get the dates for the +5 -7 days
  const dates = [];

  // Add 5 days before due date
  for (let i = 5; i > 0; i--) {
    dates.push(moment(due_date).subtract(i, 'days').format('D-MMM-YY'));
  }

  // Add due date
  dates.push(moment(due_date).format('D-MMM-YY'));

  // Add 7 days after due date
  for (let i = 1; i <= 7; i++) {
    dates.push(moment(due_date).add(i, 'days').format('D-MMM-YY'));
  }



  return (
    <div>
      {due_date != "Invalid date" ? (
        <div>
          <div className='dates-info'>
            {selectedTile && (
              <div className='const-diff'>
                <b> Selected Suggested Date: </b>{selectedTile}
              </div>
            )}
            <div className="const-diff">
              {constDiff === null ? (
                <p>Click on a tile!</p>
              ) : typeof constDiff === "string" ? (
                <p><b>Choose another date!</b></p>
              ) : constDiff > 0 ? (
                <p><b>Increase in stress score:</b> {Math.floor(constDiff)}</p>
              ) : constDiff < 0 ? (
                <p><b>Decrease in stress score:</b> {-constDiff}</p>
              ) : (
                <p>No change in stress</p>
              )}
            </div>
            <br></br>
            <div className='suggested-dates'>
              <p><b>Suggested Due Dates: </b></p>
              {bestDates.map((best) => (
                <span>{best} </span>
              ))}
            </div>
          </div>
          <div className="tile-group">
            {dates.map((date) => (
              <Tile dueDate={due_date} date={date} stressScores={stressScores} setConstDiff={setConstDiff} 
              selectedDate={selectedTile} setSelectedDate={setSelectedTile}/>
            ))}
          </div>
        </div>
      ) : (
        <p style ={{ marginLeft: 225}}><b>Pick a due date!</b></p>
      )}
    </div>
  );
}
  

const Popup = ({theme, open, setOpen, currentRow, setCurrentRow, assignments, edited, setEdited, semester, selectedModule }) => {
  const classes = useStyles();

  const [name, setName] = useState(currentRow['Name']);
  const [type, setType] = useState(currentRow['Type']);
  const [group_or_indv, setGroupOrIndv] = useState(currentRow['Group or Individual']);
  const [weightage, setWeightage] = useState(currentRow['Weightage']);
  const [original_name, setOriginalName] = useState(currentRow['Name']);



  function SubmitDate(event) {
    if (event === '') {
      return event;
    }
    return moment(event, 'YYYY-MM-DD').format('D-MMM-YY');
  }

  function handleDates(event) {
    if (moment(event, 'DD-MMM-YY', true)) {
      return moment(event, 'D-MMM-YY').format('YYYY-MM-DD');
    }
      return event;
  }

  const [start_date, setStartDate] = useState(handleDates(currentRow['Start Date']));
  const [due_date, setDueDate] = useState(handleDates(currentRow['Due Date']));
  const [dueDateDisplay, setDueDateDisplay] = useState(handleDates(currentRow['Due Date']));

  const [selectedDate, setSelectedDate] = useState('');

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
    const startDate = moment(start_date, 'YYYY-MM-DD');
    const dueDate = moment(due_date, 'YYYY-MM-DD');
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
          'start_date': SubmitDate(start_date),
          'due_date': SubmitDate(due_date)
      }

      axios.put('/update_assignments', {params})
      .then((response) => {
        console.log(response.data);
        setCurrentRow({...currentRow, 'Name': name, 'Start Date': start_date, 'Due Date': due_date,
        'Type': type, 'Group or Individual': group_or_indv, 'Weightage': weightage});
        setOpen(false);
      })
      .catch((err) => console.log(err));

      setEdited(edited+1)
  }

  useEffect(() => {}, [open])

  const handleCancel = () => {
    setCurrentRow(null);
    setOpen(false);
  };

  const handleDelete = () => {
    const params = {
      'name': original_name,
      'module_code': currentRow['Module Code'],
      'semester': currentRow['Semester']
    }

    axios.delete('/delete_assignments', {params})
    .then((response) => {
      setCurrentRow(null);
      setOpen(false);
      setEdited(edited+1);
    })
    .catch((err) => console.log(err));
  }

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
              type='date'
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
              fullWidth
              type='date'
              value= {dueDateDisplay}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => setDueDate(event.target.value)}
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
      <TileGroup 
      selectedModule={selectedModule}
      semester={semester}
      name={name}
      weightage={weightage}
      group_or_indv={group_or_indv}
      type={type}
      start_date={SubmitDate(start_date)}
      due_date={SubmitDate(due_date)} />
      <DialogActions className={theme === "light" ? classes.popupLight : classes.popupDark}>
            <Button onClick={handleDelete} className='delete-assignment'>
              Delete Assignment
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>
              Save
            </Button>
          </DialogActions>
    </Dialog>
  </div>
)};

export default Popup;