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
    if ("start_date" in fieldValues)
      temp.start_date = fieldValues.start_date ? "" : "This field is required.";
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
  
  // intial values
  const initialFValues = {
    name: "",
    type: "",
    start_date: new Date(),
    due_date: new Date(),
    group_or_indv: "",
    weightage: ""
  };
  // current values from the assignment form
  const [values, setValues] = useState({
    name: "",
    type: "",
    start_date: new Date(),
    due_date: new Date(),
    group_or_indv: "",
    weightage: ""
  })
  // errors that we have detected
  const [errors, setErrors] = useState({})
  // for navigation
  const navigate = useNavigate()


  // function to handle the input changes
  const handleInputChange = (e) => {
    console.log(e.target)
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    validate({ [name]: value });
  };

  // resets the form
  const resetForm = () => {
    setValues({
      name: "",
      type: "",
      start_date: new Date(),
      due_date: new Date(),
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
        'module_code' : 'DSA3101',
        'semester' : 2220,
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

      navigate('/assignments')
    }
}

  return (
    
    <Form onSubmit={handleSubmit}>
        
        <br></br><br></br><br></br>
        <h1>Add New Assignment</h1>
        <br></br><br></br><br></br>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item xs={6} justifyContent="center" >
            <TextField 
              variant="outlined"
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              autoFocus id="issueName" label="Name" fullWidth margin="normal"
              onChange={handleInputChange}
              name = 'name'
            />

            <TextField
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              autoFocus id="changeTypes" label="Type" fullWidth margin="normal" textAlign="left"
              variant="outlined"
              select
              onChange={handleInputChange}
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
            />
            <TextField
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              id="startDate "label="Start Date" type="date" fullWidth margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
              name = 'start_date'
            />
            <TextField
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              id="endDate" label="End Date" type="date" fullWidth margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
              name = 'due_date'
            />
            

          <div>
            <Controls.Button type="submit" text="Submit" component={Link} to="/assignments" onClick={handleSubmit}/>
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
          <br></br>
          <Button component={Link} to="/assignments">
            Return To Assignments
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
}
