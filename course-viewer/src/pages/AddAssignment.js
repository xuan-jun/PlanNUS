import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Grid, Button } from "@material-ui/core";
import Controls from "./Assignment/components/controls/Controls";
import Select from "./Assignment/components/controls/Select";
import { useForm, Form } from "./Assignment/components/useForm";
import { Link } from 'react-router-dom';

const initialFValues = {
  id: 0,
  issueName: "",
  changeTypes: "",
  startDate: new Date(),
  endDate: new Date(),
  indivGrp: "",
  weightage: ""
};

export default function AssignmentForm(props) {
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
          <Controls.Input
            name="issueName"
            label="Name"
            value={values.issueName}
            onChange={handleInputChange}
            error={errors.issueName}
          />
           <Select
            label="Type"
            name="changeTypes"
            value={values.changeTypes}
            onChange={handleInputChange}
          />
           <Select
            label="Individual or Group"
            name="indivGrp"
            value={values.indivGrp}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Weightage"
            name="weightage"
            value={values.weightage}
            onChange={handleInputChange}
          />
          <Controls.DatePicker
            name="Start Date"
            label="startDate"
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
