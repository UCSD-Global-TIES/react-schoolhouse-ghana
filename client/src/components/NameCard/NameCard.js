import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    display: "flex",
    padding: "1.25rem 1.875rem",
    alignItems: "center",
    gap: "0.75rem",
    flex: "1 0 0",
    borderRadius: "0.75rem",
    border: "3px solid #E5E5E5",
    background: "#FFF",
  },
  text: {
    color: "#4B4B4B",
    fontFamily: "Nunito",
    fontSize: "1.125rem",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
  },
});

function NameCard(props) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <p>{props.name}</p>
    </div>
  );
}

export default NameCard;
