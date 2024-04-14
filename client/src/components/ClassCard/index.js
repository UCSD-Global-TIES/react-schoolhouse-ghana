import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import BooksIcon from "../../assets/books.svg";

const useStyles = makeStyles({
  container: {
    width: '11.8125rem',
    height: '14rem',
    borderRadius:' 0.75rem',
    border:' 1px solid #4B4B4B',
    background:' #FFF',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    color: '#4B4B4B',
    fontFamily: 'Nunito',
    fontSize: '1.125rem',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: 'normal',
    textTransform: 'uppercase',
  },
  // Add styles for other elements like the icon, admin label, etc.
  adminLabel: {
    backgroundColor: "#D9EAD3", // Adjust to match the green background from the design
    borderRadius: "1rem",
    padding: "0.25rem 0.75rem",
    color: "#38761D", // Adjust to match the text color from the design
    fontWeight: "bold",
    fontSize: "0.875rem",
  },
  imageContainer: {
    display: 'flex',
    width: '11.75rem',
    height: '7.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    // flexShrink: 0,
    borderRadius: '0.25rem',
    borderBottom: '1px solid #4B4B4B',
  },
  tagContainer: {
    display: 'flex',
    padding: '0rem 0.6875rem',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.625rem'
  }
  // Add more styles as needed for the design
});

function ClassCard(props) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.imageContainer}>
        <img src={BooksIcon} alt={props.name} />
      </div>
      <p className={classes.text}>{props.name}</p>
      <div className={classes.tagContainer}></div>
    </div>
  );
}

export default ClassCard;