import React, { useState } from 'react';
import {Select, MenuItem, makeStyles} from '@material-ui/core';
import useStyles from './ModuleMenuStyle';

const ModuleMenu = ({theme, modules, selectedModule, setSelectedModule}) => {      
    const classes = useStyles();
  
    const handleModuleChange = (event) => {
    setSelectedModule(event.target.value); // update the selected module state when the user selects a module option
    };

  return (
    <div>
      <div>
        <Select value={selectedModule} onChange={handleModuleChange} className={theme === "light" ? classes.moduleSelectLight : classes.moduleSelectDark}>
          <MenuItem key={selectedModule} value={selectedModule}>{selectedModule}</MenuItem>
            {modules.map((module) => (
              <MenuItem key={module} value={module} onClick={() => {setSelectedModule(module)}}>
                {module}
              </MenuItem>
            ))}
        </Select>
      </div>
    </div>
  )
};

export default ModuleMenu;