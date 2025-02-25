import React from "react";
import { Link } from "react-router-dom";
// import "./GradebookNavbar.css";

const GradebookNavbar = () => {
  return (
    <nav className="gradebook-navbar">
      <h2>Gradebook</h2>
      <Link to="/subjects">Subjects</Link>
      <Link to="/gradebook/view">View Grades</Link>
      <Link to="/gradebook/edit">Edit Grades</Link>
    </nav>
  );
};

export default GradebookNavbar;
