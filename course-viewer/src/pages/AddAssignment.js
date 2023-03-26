import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Grid, Button } from "@material-ui/core";
import Controls from "./Assignment/components/controls/Controls";
import { useForm, Form } from "./Assignment/components/useForm";
import { Link } from 'react-router-dom';

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
        
      <Grid container direction = "column" align="center">
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
            <Controls.Button type="submit" text="Submit" component={Link} to="/assignments" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
          <Button component={Link} to="/assignments">
            Return To Assignments
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
}
