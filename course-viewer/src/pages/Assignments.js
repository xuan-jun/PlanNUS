import React from "react";
import {
  makeStyles,
  CssBaseline,
  createTheme,
  ThemeProvider
} from "@material-ui/core";
import Assignment from "./Assignment/buildAssignments";

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

function Assignments() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.appMain}>
        <Assignment />
      </div>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default Assignments;
