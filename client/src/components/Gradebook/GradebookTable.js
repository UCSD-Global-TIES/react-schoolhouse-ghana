import React, { useState } from "react";
import "./Gradebook.css"; // Ensure this file exists for styling

const GradebookTable = ({ data, updateData, readOnly }) => {
  const [assignments, setAssignments] = useState(["Assignment 1", "Assignment 2"]);

  const addAssignment = () => {
    setAssignments([...assignments, `Assignment ${assignments.length + 1}`]);
  };

  const handleGradeChange = (studentIndex, assignmentIndex, value) => {
    let updatedData = [...data];

    if (!updatedData[studentIndex].grades) {
      updatedData[studentIndex].grades = new Array(assignments.length).fill(0);
    }

    updatedData[studentIndex].grades[assignmentIndex] = parseFloat(value) || 0;
    updateData(updatedData); // ✅ Ensure this function is correctly passed
  };

  return (
    <div className="gradebook-container">
      <table className="gradebook-table">
        <thead>
          <tr>
            <th>Student Name</th>
            {assignments.map((assignment, index) => (
              <th key={index}>
                <input
                  type="text"
                  value={assignment}
                  onChange={(e) => {
                    let newAssignments = [...assignments];
                    newAssignments[index] = e.target.value;
                    setAssignments(newAssignments);
                  }}
                />
              </th>
            ))}
            <th>Total</th>
            <th>Letter Grade</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student, studentIndex) => (
            <tr key={studentIndex}>
              <td>
                {/* Student names are read-only as they come from enrollment */}
                <span>{student.studentName}</span>
              </td>
              {assignments.map((_, assignmentIndex) => (
                <td key={assignmentIndex}>
                  {readOnly ? (
                    <span>{student.grades?.[assignmentIndex]}</span>
                  ) : (
                    <input
                      type="number"
                      value={student.grades?.[assignmentIndex] || ""}
                      onChange={(e) => handleGradeChange(studentIndex, assignmentIndex, e.target.value)}
                    />
                  )}
                </td>
              ))}
              <td>{calculateTotal(student.grades)}</td>
              <td>{getLetterGrade(calculateTotal(student.grades))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!readOnly && (
        <button onClick={addAssignment}>Add Assignment</button>
      )}
    </div>
  );
};

const calculateTotal = (grades = []) => grades.reduce((acc, grade) => acc + (grade || 0), 0);
const getLetterGrade = (total) => (total >= 90 ? "A" : total >= 80 ? "B" : total >= 70 ? "C" : total >= 60 ? "D" : "F");

export default GradebookTable;
