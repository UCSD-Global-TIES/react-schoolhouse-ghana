import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flex: "1 0 0",
    gap: "0.75rem",
    justifyContent: "space-between", // Added for spacing between name and icons
    padding: "1.25rem 1.875rem",
    alignItems: "center",
    marginBottom: "1rem", // Add margin between cards
    borderRadius: "0.75rem", // Adjust border-radius as per the design
    // boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)", // Add shadow to match the design
    background: "#FFF",
    border: "3px solid #E5E5E5",
    "&:hover": {
      border: "3px solid #005FD9",
      background: "#f0f4fc",
    },
    "&:hover $iconContainer": {
      display: "flex",
      justifyContent: "space-between",
      width: "4rem"
    },
  },
  text: {
    color: "#4B4B4B",
    fontFamily: "var(--primary-font)",
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
    display: "none",
  },
  icon: {
    '&:hover': {
      cursor: "pointer"
    }
  }
  // Add more styles as needed for the design
});

function NameCard(props) {
  const classes = useStyles();

  //new code
  const { name, handleDocument, document } = props; // Destructure the required props

  const handleClick = () => {
    if (handleDocument) {
      handleDocument(true, document); // Call the handleDocument function with (true, document)
    }
  };

  return (
    <div className={classes.container}>
      {/* <p className={classes.text}>{props.name}</p> */}
      <p className={classes.text}>{name}</p>
      {/* {props.isAdmin && <div className={classes.adminLabel}>Admin</div>} */}
      <div className={classes.iconContainer}>
        {/* Add icons here */}
        <div className={classes.icon} onClick={handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z"
              fill="#4B4B4B"
            />
          </svg>
        </div>
        <div className={classes.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
              fill="#4B4B4B"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default NameCard;
