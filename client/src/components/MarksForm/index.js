import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@material-ui/core";

function MarksInput({subject_id}) {
  const [studentUsername, setStudentUsername] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [grade, setGrade] = useState("");
  const subject = subject_id;

  
  const handleSave = async () => {
    if (studentUsername && assignmentName && subject && grade !== '' && !isNaN(parseFloat(grade))) {
      try {
        const response = await fetch('http://localhost:3001/api/mark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentUsername,
            assignmentName,
            grade: parseFloat(grade),
            subject 
          }),
        });

        if (response.ok) {
          setStudentUsername('');
          setAssignmentName('');
          setGrade('');
          console.log('Saved Grade');
        } else {
          console.log('Error saving grade:', response.status, response.statusText);
        }
      } catch (error) {
        console.log('Error saving grade:', error);
      }
    }
  };

  return (
    <Paper style={{ padding: "1rem" }}>
      <Typography variant="h6">Enter Assignment Grades</Typography>
      <TextField
        label="Student Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={studentUsername}
        onChange={(e) => setStudentUsername(e.target.value)}
      />
      <TextField
        label="Assignment Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={assignmentName}
        onChange={(e) => setAssignmentName(e.target.value)}
      />
      <TextField
        label="Grade (out of 100)"
        variant="outlined"
        fullWidth
        margin="normal"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </Paper>
  );
}

export default MarksInput;
