import { makeStyles } from "@material-ui/core";
import MuiButton from "@material-ui/core/Button";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles({
  root: (props) => ({
    display: "flex",
    height: "3.5rem",
    padding: "0.5625rem 1.25rem",
    alignItems: "center",
    gap: "0.625rem",
    flexShrink: "0",
    fontSize: "1.75rem",
    borderRadius: "1.5rem",
    borderTop:
      props.buttonColor === "blue" ? "1px solid #005FD9" : "1px solid #E5E5E5",
    borderRight:
      props.buttonColor === "blue" ? "1px solid #005FD9" : "1px solid #E5E5E5",
    borderBottom:
      props.buttonColor === "blue" ? "4px solid #005FD9" : "4px solid #E5E5E5",
    borderLeft:
      props.buttonColor === "blue" ? "1px solid #005FD9" : "1px solid #E5E5E5",
    backgroundColor: props.buttonColor === "blue" ? "#2584FF" : (props.buttonColor === "white" ? "#FFF" : props.buttonColor), // Updated to handle custom colors
    color: props.buttonColor === "blue" || props.buttonColor === "white" ? "#FFF" : "#2584FF", // Updated to handle custom colors
    "&:hover": {
      backgroundColor: props.buttonColor === "blue" ? "#005FD9" : (props.buttonColor === "white" ? "#FFF" : props.buttonColor), // Updated to handle custom colors
    },
    fontFamily: "Nunito",
  }),
});

function Button({ text, icon, buttonColor }) {
  const classes = useStyles({ buttonColor });

  function renderIcon(buttonIcon) {
    if (buttonIcon === "add") {
      return <AddIcon />;
    } else if (buttonIcon === "cancel") {
      return <CloseIcon />;
    }
  }

  return (
    <MuiButton className={classes.root}>
      {renderIcon(icon)}
      {text}
    </MuiButton>
  );
}

export default Button;
