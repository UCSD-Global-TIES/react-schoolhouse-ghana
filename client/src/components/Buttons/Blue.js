import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from 'react';

const useStyles = makeStyles({
  root: {
    borderRadius: "24px",
    borderTop: "1px solid #005FD9",
    borderRight: "1px solid #005FD9",
    borderBottom: "4px solid #005FD9",
    borderLeft: "1px solid #005FD9",
    backgroundColor: "#005FD9",
    color: "white",
    '&:hover':{
      backgroundColor: "#2584FF",
    },
  },
})

function Blue(props) {
  const classes = useStyles();
  return(
    <Button className={classes.root}>
      {props.symbol}
      {props.text}
    </Button>
  )
}

export default Blue;
