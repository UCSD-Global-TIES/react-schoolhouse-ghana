import React from "react";
import "./Gradebook.css";

const Gradebook = ({ students, assignments, data }) => {
  return (
    <div className="gradebook-scroll">
      <table className="gradebook-table">
        <thead>
          <tr>
            <th className="name-header">Name</th>
            <th className="total-header">Total %</th>
            {assignments.map((a) => (
              <th key={a.id}>
                <div className="assignment-title">{a.title}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="name-cell">{s.name}</td>
              <td className="total-cell">
                {data.find((r) => r.studentId === s.id)?.total ?? "-"}%
              </td>
              {assignments.map((a) => {
                const score = data.find(
                  (r) => r.studentId === s.id && r.assignmentId === a.id
                )?.score;
                return (
                  <td key={a.id}>
                    <div className="grade-cell">
                      <div className="grade-box">{score ?? "-"}</div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Gradebook;