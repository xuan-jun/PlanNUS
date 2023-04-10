import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Grid, Button, MenuItem, TextField } from "@material-ui/core";
import Controls from "./Assignment/components/controls/Controls";
import Select from "./Assignment/components/controls/Select";
import { useForm, Form } from "./Assignment/components/useForm";
import { Link } from 'react-router-dom';
import { FormControl, InputLabel } from '@mui/material';
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './AddAssignment.css'


const font =  "'Inter', sans-serif";
const useStyles = makeStyles(theme => ({
    tableDark: {
      maxWidth: 1200,
      paddingTop: 90,
      borderBottom: "none",
      marginTop: theme.spacing(3),
      height: "90vh",
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
    divcontrol: {
        display: "flex",
        flexDirection: "row",
        alignItems: "left"
    },
    tableLight: {
      maxWidth: 1200,
      paddingTop: 90,
      borderBottom: "none",
      marginTop: theme.spacing(3),
      height: "90vh",
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
        color: '#000000', // set the focused label color
      },
      '& .MuiTextField-root':{
        margin: theme.spacing(1), width: '25ch',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'none', // set the focused border color
      },
      '& .MuiInputBase-root': {
        color: '#fffefe', // set the default text color
      },
      '& .MuiInputLabel-root': {
        color: '#808080', // set the default label color
      },
      '& .MuiInputBase-input': {
        color: '#000000', // change the input text color
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#000000', // change the border color
        },
      },
      '& input':{
        textAlign:"left"
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



export default function AssignmentForm(props) {
const classes = useStyles();

  // current semester manually computed
  const semester = 2220;

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

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name
        ? ""
        : "This field is required.";
    if ("type" in fieldValues)
      temp.type = fieldValues.type ? "" : "This field is required.";
    if ("due_date" in fieldValues)
      temp.due_date = fieldValues.due_date ? "" : "This field is required.";
    if ("group_or_indv" in fieldValues)
      temp.group_or_indv = fieldValues.group_or_indv
        ? ""
        : "This field is required.";
    if ("weightage" in fieldValues)
      temp.weightage = fieldValues.weightage ? "" : "This field is required.";
    setErrors({
      ...temp
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  // functions and states for form submission
  // current values from the assignment form
  const [values, setValues] = useState({
    name: "",
    type: "",
    start_date: "",
    due_date: "",
    group_or_indv: "",
    weightage: ""
  })
  // errors that we have detected
  const [errors, setErrors] = useState({})
  // for navigation
  const navigate = useNavigate()


  // function to handle the input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    validate({ [name]: value });
  };

  // handle date inputs from inputs and remap into the submission format
  const handleDate = (date) => {
    if (date === '') {
      return 'Invalid date';
    }
    return moment(date, 'YYYY-MM-DD').clone().format('D-MMM-YY');
  }

  // resets the form
  const resetForm = () => {
    setValues({
      name: "",
      type: "",
      start_date: "",
      due_date: "",
      group_or_indv: "",
      weightage: ""
    });
    setErrors({});
  };
  useEffect(() => {}, [values])

  // handle the submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const name = values['name']
      const type = changeTypes.filter((type) => {
        return type['value'] == values['type']
      })[0]['label']
      const group_or_indv = values['group_or_indv'] == 1 ? 'I' : 'G'
      const start_date = moment(values['start_date'], 'YYYY-M-DD').format('D-MMM-YY')
      const due_date = moment(values['due_date'], 'YYYY-M-DD').format('D-MMM-YY')
      const weightage = values['weightage']
      
      const params = {
        'module_code' : props.currentModule,
        'semester' : semester,
        'name' : name,
        'type' : type,
        'group_or_indv' : group_or_indv,
        'start_date' : start_date,
        'due_date' : due_date,
        'weightage' : weightage
      }
  
      axios.post('/add_new_assignments', {params})
      .then((response) => {
          console.log(response.data);
      })
      .catch((err) => console.log(err));

      resetForm();
      navigate('/assignments')
    }
}

  return (
    
    <Form onSubmit={handleSubmit}>
      <h1 className="add-assignment-title">Add New Assignment</h1>
      <div className="current-module-notification">
        <span>Curently adding for:</span>
        <span className="add-assignment-current-module">{props.currentModule}</span>
      </div>
      <div className="form-container">
        <div className="assignment-details">
          <h3>Assignment Details</h3>
          <Grid container direction="column" justifyContent="center" alignItems="center"> 
            <Grid item s={6} justifyContent="center" >
                <TextField 
                  variant="outlined"
                  className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
                  autoFocus id="issueName" label="Name" fullWidth margin="normal"
                  onChange={handleInputChange}
                  value={values['name']}
                  name = 'name'
                />

                <TextField
                  className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
                  autoFocus id="changeTypes" label="Type" fullWidth margin="normal" textAlign="left"
                  variant="outlined"
                  select
                  onChange={handleInputChange}
                  value={values['type']}
                  name = 'type'
                  //defaultValue="3"
                >
                  {changeTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))} 
                </TextField>
                <TextField
                  className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
                  id="indivGrp" label="Individual or Group" fullWidth margin="normal"
                  select
                  variant="outlined"
                  onChange={handleInputChange}
                  name = 'group_or_indv'
                  value={values['group_or_indv']}
                  //defaultValue="1"
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
                  variant="outlined"
                  onChange={handleInputChange}
                  name = 'weightage'
                  value={values['weightage']}
                />
                <TextField
                  className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
                  id="startDate "label="Start Date" type="date" fullWidth margin="normal"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={values['start_date']}
                  onChange={handleInputChange}
                  name = 'start_date'
                />
                <TextField
                  className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
                  id="endDate" label="Due Date" type="date" fullWidth margin="normal"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleInputChange}
                  value={values['due_date']}
                  name = 'due_date'
                />
            </Grid>
          </Grid>
        </div>

        <TileGroup 
        currentModule={props.currentModule}
        semester={semester}
        name={values['name']}
        weightage={values['weightage']}
        group_or_indv={values['group_or_indv'] == 1 ? 'I' : 'G'}
        type={values['type'] ? changeTypes.filter((type) => {
          return type['value'] == values['type']
        })[0]['label'] : ""}
        start_date={handleDate(values['start_date'])}
        due_date={handleDate(values['due_date'])} />
      </div>
                    

      <div>
        <Controls.Button type="submit" text="Submit" component={Link} to="/assignments" onClick={handleSubmit}/>
        <Controls.Button text="Reset" color="default" onClick={resetForm} />
      </div>
      <Button component={Link} to="/assignments">
        Return To Assignments
      </Button>

    </Form>
  );
}

//tiles
const Tile = ({ dueDate, date, stressScores, setConstDiff, selectedDate, setSelectedDate, bestDates }) => {
  //get the stress score
  const formatDate = (date) => moment(date).format('DD-MMM-YY');
  const stressScore = stressScores[formatDate(date)];

  //calculate the difference between current stress score and new selected due date stress score
  const diff = () => {
    if (stressScore === 'Before start date') {
      return 'Not Applicable!'
    }
      // return the difference between the selected score and the stress score
      const change = ((stressScore - stressScores[formatDate(dueDate)])/stressScores[formatDate(dueDate)])
      return Math.round(change * 10000) / 10000
  };


  // Set color based on stress score
  let color;
   if (stressScore === 'Before start date') {
    color = '#c3cbcd'; // gray
  } else if (stressScore > 10) {
    color = 'rgb(174, 9, 29)'; // very stressed
  } else if (stressScore >= 7) {
    color = 'rgb(255, 150, 80)'; // stressed
  } else if (stressScore >= 5) {
    color = 'rgb(251, 217, 96)'; // moderate
  } else {
    color = 'rgb(180, 237, 181)'; // good
  } 

  //change colour when tile selected
  const isSelected = selectedDate === date;

  return (
    <div className={`tile ${isSelected ? ' selected' : ''} ${date===dueDate ? 'current-date' : ''}`} style={{ backgroundColor: color }} onClick={() => {
      setSelectedDate(date);
      setConstDiff(diff());
    }}>
      <div className="date">{date}</div>
      <span className='minimum-stress-tag'>{bestDates.includes(formatDate(date)) ? "Minimum Stress" : ' '}</span>
      <div className="stress-score">
        {typeof stressScore === "string" ?
        stressScore :
        `Stress Score: \n ${Math.round(stressScore * 100) / 100}`}
      </div>
    </div>
  );
};

const TileGroup = ({ currentModule, semester, name, weightage, type, group_or_indv, start_date, due_date}) => {

  const [stressScores, setStressScores] = useState([]);
  const [bestDates, setBestDates] = useState([]);
  
  //to display increase or decrease
  const [constDiff, setConstDiff] = useState(null);

  const [selectedTile, setSelectedTile] = useState(null);


  useEffect(() => {
    const params = {
      'module_code': currentModule,
      'semester': semester,
      'name': name,
      'weightage': weightage,
      'type': type,
      'group_or_indv': group_or_indv,
      'start_date': start_date,
      'due_date': due_date
    }
    axios.get('/get_window_stresses', {params})
    .then((response => {
      const data = response.data;
      setStressScores(data['stress_scores']);
      setBestDates(data['best_dates']);
    }))
    .catch((err) => console.log(err));
    }, [name, weightage, type, group_or_indv, start_date, due_date])

    //get the stress score for the due date
    const formatDate = (date) => moment(date).clone().format('DD-MMM-YY');
    const due_date_stress = stressScores[formatDate(due_date)];

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
    <div className='add-assign-tile-group-wrapper'>
      <h2 className='tile-group-title'>Stress Scores Visualisation</h2>
      {due_date_stress === "Before start date" ? (
        <div>Ensure that due date is after start date!</div>
      ): (due_date !== "Invalid date" & name !== "" & weightage !=="" & type !== "" & group_or_indv !== "") ? (
        <div className="tile-visualisation-details">
          <div className='dates-info'>
            <div className="current-date">
              <b>Current Due Date:</b>{due_date}
            </div>
            {selectedTile && (
              <div className='const-diff'>
                <b>Selected Due Date: </b>{selectedTile}
              </div>
            )}
            <div className="const-diff">
              {constDiff === null ? (
                <p>Click on a tile to compare the stress scores!</p>
              ) : typeof constDiff === "string" ? (
                <p><b>Choose another date! This is before the start date!</b></p>
              ) : constDiff > 0 ? (
                <div className="score-increase">
                  <b>Increase in stress score:</b> {Math.round(constDiff*10000)/100}%

                </div>
              ) : constDiff < 0 ? (
                <div className="score-decrease">
                  <b>Decrease in stress score:</b> {-Math.round(constDiff*10000)/100}%
                </div>
              ) : (
                <b>No change in stress</b>
              )}
            </div>
          </div>
          <div className="stress-diff-visualisation">
            {constDiff === null || typeof constDiff === "string" ?
              "" :
              (
                <div className={`stress-bar ${constDiff > 0 ?
                "increase" : constDiff == 0 ? 'nochange' : 'decrease'}`}
                style={constDiff > 0 ? 
                  {"--width": `${Math.min(constDiff*100, 100)}%`}:
                {"--width": `${constDiff === 0 ? 100 : Math.min(-constDiff*100, 100)}%`}}>{constDiff > 0 ? Math.round(constDiff*10000)/100 : -Math.round(constDiff*10000)/100}% </div>
              )
            }
          </div>
          <div className="tile-group">
            {dates.map((date) => (
              <Tile dueDate={due_date} date={date} stressScores={stressScores} setConstDiff={setConstDiff} 
              selectedDate={selectedTile} setSelectedDate={setSelectedTile}
              bestDates = {bestDates}/>
            ))}
          </div>
        </div>
      ) : (
        <p><b>Fill in the assignment details!</b></p>
      )}
    </div>
  );
}