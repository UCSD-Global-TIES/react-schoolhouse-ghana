import { makeStyles } from "@material-ui/core/styles";
import React, {useState } from "react";
import moment from "moment";
import AnnouncementViewer from "../AnnouncementViewer";

const useStyles = makeStyles({
  container: {
    display: "flex",
    height: "4.25rem",
    flex: "1 0 0",
    gap: "0.75rem",
    justifyContent: "space-between",
    padding: "1.25rem 1.875rem",
    alignItems: "center",
    marginBottom: "0rem",
    borderRadius: "0.75rem",
    // boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)", // Add shadow to match the design
    background: "#FFF",
    border: "3px solid #E5E5E5",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#005FD9",
      background: "#f0f4fc",
    },
    "&:hover $iconContainer": {
      display: "flex",
      justifyContent: "space-between",
      width: "4rem",
    },
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.75rem",
    fontFamily: "var(--primary-font)",
    color: "#AFAFAF",
  },
  text: {
    color: "#4B4B4B",
    fontFamily: "var(--primary-font)",
    fontSize: "1rem",
    fontWeight: "600",
  },
  adminLabel: {
    backgroundColor: "#D9EAD3",
    borderRadius: "1rem",
    padding: "0.25rem 0.75rem",
    color: "#38761D",
    fontWeight: "bold",
    fontSize: "0.875rem",
  },
  iconContainer: {
    display: "none",
  },
  icon: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  viewerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  viewerContent: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.75rem',
    maxWidth: '80%',
    maxHeight: '80%',
    overflow: 'auto',
    zIndex: 1001,
  }
});

function AnnouncementCard(props) {
  const classes = useStyles();
  const [showViewer, setShowViewer] = useState(false);
  const [PROPS, setProps] = useState(props);

  const {
    name,
    createdAt,
    handleDocument,
    handleSelect,
    document,
    user
  } = props;

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent container click
    if (handleDocument) {
      handleDocument(true, document);
    }
    setShowViewer(true);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    if (handleDocument) {
      handleDocument(false, null);
    }
  };

  const deleteDocument = (e) => {
    e.stopPropagation(); 
    handleSelect(document._id);
  };

  const handleContainerClick = () => {
    setShowViewer(true);
    // Remove the handleDocument call here since we want to show viewer, not form
  };

  // Check if current user can edit/delete this announcement
  const canEditOrDelete = () => {
    if (!user || !document) return false;
    
    // Admin can edit/delete any announcement
    if (user.type === "Admin") return true;
    
    // Teacher can only edit/delete their own announcements
    if (user.type === "Teacher") {
      // If announcement has author metadata, use it for permission check
      if (document.authorId) {
        return document.authorId === user.key || document.authorId === user.profile._id;
      }
      
      // For legacy announcements without authorId, check by authorName
      // This is a fallback for existing announcements
      if (document.authorName && user.profile) {
        const userFullName = `${user.profile.first_name} ${user.profile.last_name}`;
        return document.authorName === userFullName;
      }
      
      // If no author info available, allow edit for teachers (legacy behavior)
      // You may want to change this to false for more restrictive behavior
      return true;
    }
    
    return false;
  };
 
  return (
    <>
      <div
        className={classes.container}
        onClick={handleContainerClick}
      >
        <div className={classes.textContainer}>
          <p className={classes.text}>{name}</p>
          <p className={classes.dateText}>
            CREATED ON: {moment(PROPS.document.createdAt).format('MM/DD/YYYY')}
          </p>
        </div>
        {user && canEditOrDelete() && (
          <div className={classes.iconContainer}>
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
            <div className={classes.icon} onClick={deleteDocument}>
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
        )}
      </div>
     
      {showViewer && (
        <AnnouncementViewer
          document={document}
          onClose={handleCloseViewer}
          {...props}
        />
      )}
    </>
  );
}

export default AnnouncementCard;