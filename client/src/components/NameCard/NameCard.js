import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "space-between", // Added for spacing between name and icons
    padding: "1rem", // Adjust padding as per the design
    alignItems: "center",
    marginBottom: "1rem", // Add margin between cards
    borderRadius: "0.5rem", // Adjust border-radius as per the design
    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)", // Add shadow to match the design
    background: "#FFF",
    // Remove border if not needed as per design or adjust the color
    // border: "3px solid #E5E5E5", 
  },
  text: {
    color: "#4B4B4B",
    fontFamily: "Nunito",
    fontSize: "1rem", // Adjust font-size as per the design
    fontWeight: "600", // Adjust font-weight as per the design
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
  iconContainer: {
    // Add styles for the icon container
  },
  // Add more styles as needed for the design
});

function NameCard(props) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <p className={classes.text}>{props.name}</p>
      {props.isAdmin && <div className={classes.adminLabel}>Admin</div>}
      <div className={classes.iconContainer}>
        {/* Add icons here */}
      </div>
    </div>
  );
}

export default NameCard;
