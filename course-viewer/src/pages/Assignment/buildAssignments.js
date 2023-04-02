import React, {useState, useEffect} from "react";
import ModuleMenu from '../Assignment/components/moduleMenu/moduleMenu';
import AssignmentTable from '../Assignment/components/AssignmentTable/AssignmentTable';
import {Button, makeStyles} from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  newButton: {
    position: "absolute",
    right: 425,
    top: "100px"
  }, 
})); 

const Assignment = ({theme, token}) => {

  const instructorName = token['userName']
  const semester = 2220 // default semester for now
  const [modules, setModules] = useState([]);
  const moduleDefault = 'Please Select Module'
  const [selectedModule, setSelectedModule] = useState(moduleDefault);

  const classes = useStyles();
  // make the api call to get the list of modules the instructor is currently teaching
  useEffect(() => {
    const params = {
      'instructor' : instructorName,
      'semester' : semester,
    }
    axios.get('/modules_for_instructor', {params})
      .then((response) => {
        setModules(response.data)
      })
      .catch((err) => console.log(err));
  }, [])

  // make a rerender whenever the currentFilter changes
  useEffect(() => {}, [selectedModule])

  return (
    <div>
      <div>
        <ModuleMenu theme={theme} modules={modules}
          selectedModule={selectedModule} setSelectedModule={setSelectedModule}/>
        <Button component={Link} to="/assignments/addnew" className={classes.newButton} variant="contained" color="primary">
        Add New
        </Button>
        <AssignmentTable theme={theme} selectedModule={selectedModule} semester={semester} />
      </div>
    </div>
  )
};

export default Assignment;