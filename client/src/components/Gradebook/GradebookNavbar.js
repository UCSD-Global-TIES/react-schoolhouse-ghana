import React from "react";
import { Link } from "react-router-dom";
// import "./GradebookNavbar.css";

const GradebookNavbar = ({ subjectName, teacherName, gradeLevel }) => {
  // Use subjectName as main title if it contains "Gradebook", otherwise add "Gradebook"
  const displayTitle = subjectName?.includes('Gradebook') ? subjectName : `${subjectName || 'Subject'} Gradebook`;
  
  const bannerStyle = {
    backgroundColor: "var(--primary-color)",
    color: "var(--background-color)",
    padding: "15px 20px",
    borderRadius: "4px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  const titleStyle = {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "600"
  };

  const infoStyle = {
    fontSize: "1rem",
    fontWeight: "500"
  };

  return (
    <div style={bannerStyle}>
      <h2 style={titleStyle}>{displayTitle}</h2>
      <div style={infoStyle}>
        <strong>Teacher:</strong> {teacherName}
      </div>
    </div>
  );
};

export default GradebookNavbar;
