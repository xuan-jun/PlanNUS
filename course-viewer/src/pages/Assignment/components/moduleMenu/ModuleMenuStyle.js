import { makeStyles} from "@material-ui/core";

const font =  "'Inter', sans-serif";
const useStyles = makeStyles(theme => ({
  moduleSelectLight: {
    fontFamily: font,
    position: "absolute",
    left: 425,
    top: "100px",
    fontSize: "20px",
    color: "#455a63",
  },
  moduleSelectDark: {
    fontFamily: font,
    position: "absolute",
    left: 425,
    top: "100px",
    fontSize: "20px",
    color: "#fffefe",
  },  
}));

export default useStyles;