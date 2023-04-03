import { makeStyles } from "@material-ui/core/styles";

const font =  "'Inter', sans-serif";
const useStyles = makeStyles(theme => ({

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
        color: '#f4bc1c', // set the focused label color
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'none', // set the focused border color
      },
      '& .MuiInputBase-root': {
        color: '#fffefe', // set the default text color
      },
      '& .MuiInputLabel-root': {
        color: '#fffefe', // set the default label color
      },
      '& .MuiInputBase-input': {
        color: '#fffefe', // change the input text color
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#fffefe', // change the border color
        },
      },
    },
}));

export default useStyles;