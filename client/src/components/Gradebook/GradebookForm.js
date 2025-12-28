import React, { useState } from "react";

const GradebookForm = ({ onSubmit }) => {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState(""); // assume you’ll pick from a dropdown in real use

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ studentId, studentName });
    setStudentName("");
    setStudentId("");
  };

  return (
    <form onSubmit={handleSubmit} className="gradebook-form">
      <label>Student Name:</label>
      <input
        type="text"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        required
      />
      <br />

      <label>Student ID:</label>
      <input
        type="text"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        required
      />
      <br />

      <button type="submit">Add Student</button>
    </form>
  );
};

export default GradebookForm;
