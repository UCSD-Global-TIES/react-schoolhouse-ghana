import React, { useState } from "react";

const GradebookForm = ({ onSubmit }) => {
  const [studentName, setStudentName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert("Please enter a student name.");
      return;
    }

    onSubmit({ studentName, grades: [] }); // ✅ No need for initial scores
    setStudentName(""); // Clear input after submitting
  };

  return (
    <div className="gradebook-form">
      <h3>Add Student</h3>
      <form onSubmit={handleSubmit}>
        <label>Student Name:</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />
        <br />
        <button type="submit" className="gradebook-button">Add Student</button>
      </form>
    </div>
  );
};

export default GradebookForm;
