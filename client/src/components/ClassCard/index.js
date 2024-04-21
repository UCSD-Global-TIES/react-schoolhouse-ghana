import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import BooksIcon from "../../assets/books.svg";
import Tag from "../Tag";

const useStyles = makeStyles({
  container: {
    width: '10.5rem',
    height: 'fit-content',
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
    marginBottom: '0.75rem',
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
    width: '10.4rem',
    height: '7.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    // flexShrink: 0,
    borderRadius: '0.25rem',
    borderBottom: '1px solid #4B4B4B',
  },
  tagContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    // other styles...
  },
  
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
      <div className={classes.tagContainer}>
        <Tag label={props.tagLabel} color={props.tagColor}></Tag>
      </div>
      
    </div>
  );
}

export default ClassCard;