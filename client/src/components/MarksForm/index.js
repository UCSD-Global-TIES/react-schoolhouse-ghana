import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import API from "../../utils/API"; 

function MarksInput({ onSave }) {
  const [studentName, setStudentName] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [grade, setGrade] = useState("");

  const handleSave = async () => {
    if (studentName && assignmentName && grade !== '' && !isNaN(grade)) {
      try {
        await API.post('/marks', {
          studentName,
          assignmentName,
          grade: parseFloat(grade),
        });

        onSave(); 
        setStudentName('');
        setAssignmentName('');
        setGrade('');
      } catch (error) {
        console.log('Error saving grade:', error);
      }
    }
  };

  return (
    <Paper style={{ padding: "1rem" }}>
      <Typography variant="h6">Enter Assignment Grades</Typography>
      <TextField
        label="Student Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
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
