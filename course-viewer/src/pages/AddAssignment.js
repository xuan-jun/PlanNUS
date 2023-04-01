import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Grid, Button, MenuItem, TextField } from "@material-ui/core";
import Controls from "./Assignment/components/controls/Controls";
import Select from "./Assignment/components/controls/Select";
import { useForm, Form } from "./Assignment/components/useForm";
import { Link } from 'react-router-dom';
import { FormControl, InputLabel } from '@mui/material';
import { makeStyles } from "@material-ui/core/styles";

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
const initialFValues = {
  id: 0,
  issueName: "",
  changeTypes: "",
  startDate: new Date(),
  endDate: new Date(),
  indivGrp: "",
  weightage: ""
};

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

export default function AssignmentForm(props) {
const classes = useStyles();
  const { addOrEdit, recordForEdit } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("issueName" in fieldValues)
      temp.issueName = fieldValues.issueName
        ? ""
        : "This field is required.";
    if ("changeTypes" in fieldValues)
      temp.changeTypes = fieldValues.changeTypes ? "" : "This field is required.";
    if ("startDate" in fieldValues)
      temp.startDate = fieldValues.startDate ? "" : "This field is required.";
    if ("endDate" in fieldValues)
      temp.endDate = fieldValues.endDate ? "" : "This field is required.";
    if ("indivGrp" in fieldValues)
      temp.indivGrp = fieldValues.indivGrp
        ? ""
        : "This field is required.";
    if ("weightage" in fieldValues)
      temp.weightage = fieldValues.weightage ? "" : "This field is required.";
    setErrors({
      ...temp
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit
      });
  }, [recordForEdit]);

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
            />

            <TextField
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              autoFocus id="changeTypes" label="Type" fullWidth margin="normal" textAlign="left"
              variant="outlined"
              select
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
            />
            <TextField
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              id="startDate "label="Start Date" type="date" fullWidth margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              className={props.theme === "light" ? classes.textFieldLight : classes.textFieldDark}
              id="endDate" label="End Date" type="date" fullWidth margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            

          <div>
            <Controls.Button type="submit" text="Submit" component={Link} to="/assignments" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
          <br></br>
          <br></br>
          <Button component={Link} to="/assignments">
            Return To Assignments
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
}
