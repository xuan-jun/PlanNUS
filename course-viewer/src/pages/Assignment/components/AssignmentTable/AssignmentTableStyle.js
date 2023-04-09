import { makeStyles } from "@material-ui/core";

const font =  "'Inter', sans-serif";
const useStyles = makeStyles(theme => ({
    tableDark: {
      maxWidth: 1200,
      marginBottom: 30,
      marginTop: theme.spacing(10),
      height: '90vh',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
      '& body': {
        backgroundColor: 'black',
      },
      '& thead th': {
          fontWeight: '600',
          color: "#fffefe",
          backgroundColor: "#2f3b45",
      },
      '& tbody td': {
        color: "#fffefe",
        fontWeight: '300',
        border: '0',
        fontFamily: font,
      },
      '& tbody tr': {
          backgroundColor: "#2f3b45"
      },
      '& tbody tr:nth-child(odd)': {
        backgroundColor: "#40505e"
      },
      '& tbody tr:hover': {
          backgroundColor: '#484545 !important',
          cursor: 'pointer'
      },
    },
    tableLight: {
      maxWidth: 1200,
      marginBottom: 30,
      borderBottom: "none",
      marginTop: theme.spacing(10),
      height: '90vh',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
      '&$bodyWhite': {
        backgroundColor: 'white',
      },
      '& thead th': {
          fontFamily: font,
          fontWeight: '600',
          color: "#606060",
          backgroundColor: "#f2f2f2",
      },
      '& tbody td': {
          color: "#455a63",
          fontFamily: font,
          fontWeight: '300',
          border: '0',
      },
      '& tbody tr': {backgroundColor: "#f2f2f251"},
      '& tbody tr:nth-child(odd)': {
        backgroundColor: "#f2f2f299"
      },
      '& tbody tr:hover': {
        backgroundColor: '#ddd !important',
        cursor: 'pointer'
      }       
    },
}));

export default useStyles;