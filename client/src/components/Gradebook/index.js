import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import "./Gradebook.css"; // Optional: add styling

const Gradebook = () => {
  const { subjectId } = useParams();
  const [gradebook, setGradebook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/gradebook/${subjectId}`)
      .then((res) => res.json())
      .then((data) => {
        setGradebook(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching gradebook:", err));
  }, [subjectId]);

  const handleGradeChange = (studentId, assignment, value) => {
    const updatedStudents = gradebook.students.map((s) =>
      s.student_id === studentId
        ? {
            ...s,
            grades: { ...s.grades, [assignment]: { score: Number(value), max_score: 100 } },
          }
        : s
    );
    setGradebook({ ...gradebook, students: updatedStudents });
  };

  const saveGrades = () => {
    fetch("http://localhost:5000/api/gradebook/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ class_id: subjectId, students: gradebook.students }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Saved successfully:", data))
      .catch((err) => console.error("Error saving grades:", err));
  };

  if (loading) return <p>Loading gradebook...</p>;

  return (
    <div>
      <h2>Gradebook for {gradebook.subject}</h2>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            {gradebook.columns.map((col) => (
              <th key={col.name}>{col.name} (/{col.max_score})</th>
            ))}
            <th>Total</th>
            <th>Letter Grade</th>
          </tr>
        </thead>
        <tbody>
          {gradebook.students.map((student) => (
            <tr key={student.student_id}>
              <td>{student.name}</td>
              {gradebook.columns.map((col) => (
                <td key={col.name}>
                  <input
                    type="number"
                    value={student.grades[col.name]?.score || ""}
                    onChange={(e) => handleGradeChange(student.student_id, col.name, e.target.value)}
                  />
                </td>
              ))}
              <td>{student.total.toFixed(2)}</td>
              <td>{student.letter_grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={saveGrades}>Save Grades</button>
    </div>
  );
};

export default Gradebook;
