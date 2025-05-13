import React from "react";
import { Link } from "react-router-dom";
// import "./GradebookNavbar.css";

const GradebookNavbar = ({ subjectName, teacherName, gradeLevel }) => {
  return (
    <nav className="gradebook-navbar">
      <h2>Gradebook</h2>
      <div className="gradebook-info">
        <span><strong>Subject:</strong> {subjectName}</span>
        <span><strong>Teacher:</strong> {teacherName}</span>
        <span><strong>Grade Level:</strong> {gradeLevel}</span>
      </div>
      <div className="gradebook-links">
        <Link to="/subjects">Subjects</Link>
        <Link to="/gradebook/view">View Grades</Link>
        <Link to="/gradebook/edit">Edit Grades</Link>
      </div>
    </nav>
  );
};

export default GradebookNavbar;
