import React from "react";
import {
  makeStyles,
  CssBaseline,
  createTheme,
  ThemeProvider
} from "@material-ui/core";
import Assignment from "./Assignment/buildAssignments";
import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00254d",
      light: "#ffffff"
    },
    secondary: {
      main: "#00254d",
      light: "#ffffff"
    },
    background: {
      default: "#ffffff"
    }
  },
  overrides: {
  },
  props: {
    MuiIconButton: {
      disableRipple: true
    }
  }
});

const useStyles = makeStyles({
  appMain: {
    width: "100%"
  }
});

const initialFValues = {
    id: 0,
    AssignmentName: "",
    startDate: new Date(),
    endDate: new Date(),
    weightage: ""
  };
  
  export default function AssignmentForm(props) {
    const { addOrEdit, recordForEdit } = props;
  
    const validate = (fieldValues = values) => {
      let temp = { ...errors };
      if ("AssignmentName" in fieldValues)
        temp.AssignmentName = fieldValues.AssignmentName
          ? ""
          : "This field is required.";
      if ("startDate" in fieldValues)
        temp.startDate = fieldValues.startDate ? "" : "This field is required.";
      if ("endDate" in fieldValues)
        temp.endDate = fieldValues.endDate ? "" : "This field is required.";
      if ("startDate" in fieldValues)
        temp.startDate = fieldValues.AssignmentName
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
        <Grid container>
          <Grid item xs={6}>
            <Controls.Input
              name="AssignmentName"
              label="Assignment Name"
              value={values.AssignmentName}
              onChange={handleInputChange}
              error={errors.AssignmentName}
            />
            <Controls.Input
              label="Weightage"
              name="weightage"
              value={values.weightage}
              onChange={handleInputChange}
            />
            <Controls.DatePicker
              name="startDate"
              label="Start Date"
              value={values.startDate}
              onChange={handleInputChange}
            />
            <Controls.DatePicker
              name="endDate"
              label="End Date"
              value={values.endDate}
              onChange={handleInputChange}
            />
  
            <div>
              <Controls.Button type="submit" text="Submit" />
              <Controls.Button text="Reset" color="default" onClick={resetForm} />
            </div>
          </Grid>
        </Grid>
      </Form>
    );
  }

