import React from "react";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    borderRadius: "1.5rem",
    borderTop: "1px solid #E5E5E5",
    borderRight: "1px solid #E5E5E5",
    borderBottom: "4px solid #E5E5E5",
    borderLeft: "1px solid #E5E5E5",
    background: "#FFF",
  },
});

function White(props) {
  const classes = useStyles();
  return (
    <Button className={classes.root}>
      {props.symbol}
      {props.text}
    </Button>
  );
}

export default White;