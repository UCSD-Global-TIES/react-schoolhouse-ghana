import React, { useState, useEffect } from "react";
import "./Gradebook.css"; // Ensure this file exists for styling

const GradebookTable = ({ data, updateData, readOnly, onAssignmentNamesChange }) => {
  const [assignments, setAssignments] = useState([]);

  // Initialize assignments based on the data's grades structure and saved assignment names
  useEffect(() => {
    if (data && data.length > 0) {
      // Find the maximum number of assignments from all students
      const maxAssignments = Math.max(
        ...data.map(student => student.grades?.length || 0)
      );
      
      // Check if the first entry has saved assignment names
      const savedNames = data[0]?.assignmentNames || [];
      
      // Use saved names or create default names
      let newAssignments;
      if (savedNames.length > 0) {
        // Use saved names, padding with defaults if needed
        newAssignments = Array.from({ length: Math.max(maxAssignments, savedNames.length, 2) }, (_, i) => 
          savedNames[i] || `Assignment ${i + 1}`
        );
      } else {
        // Create default assignment names
        newAssignments = Array.from({ length: Math.max(maxAssignments, 2) }, (_, i) => `Assignment ${i + 1}`);
      }
      setAssignments(newAssignments);
    } else {
      // Default to 2 assignments if no data
      setAssignments(["Assignment 1", "Assignment 2"]);
    }
  }, [data]);

  // Notify parent when assignment names change
  useEffect(() => {
    if (onAssignmentNamesChange) {
      onAssignmentNamesChange(assignments);
    }
  }, [assignments, onAssignmentNamesChange]);

  const addAssignment = () => {
    const newAssignment = `Assignment ${assignments.length + 1}`;
    setAssignments([...assignments, newAssignment]);
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
    </div>
  );
};

const calculateTotal = (grades = []) => grades.reduce((acc, grade) => acc + (grade || 0), 0);
const getLetterGrade = (total) => (total >= 90 ? "A" : total >= 80 ? "B" : total >= 70 ? "C" : total >= 60 ? "D" : "F");

export default GradebookTable;
