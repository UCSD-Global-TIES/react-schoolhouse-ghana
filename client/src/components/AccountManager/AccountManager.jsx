// AccountManager.jsx
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import BlueButton from '../../components/Button/Button'; // Update import path as needed

const useStyles = makeStyles((theme) => ({
  // Add your styles here
  accountManager: {
    padding: theme.spacing(2),
  },
  searchInput: {
    marginBottom: theme.spacing(2),
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  // More styles if needed
}));

const AccountManager = () => {
  const classes = useStyles();

  // State and handlers for Admins, Teachers, and Students
  const [admins, setAdmins] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  const addAdmin = () => {
    // Handler logic to add an admin
  };

  const addTeacher = () => {
    // Handler logic to add a teacher
  };

  const addStudent = () => {
    // Handler logic to add a student
  };

  const renderSection = (title, placeholder, buttonText, list, addHandler) => {
    return (
      <div className={classes.section}>
        <TextField
          className={classes.searchInput}
          variant="outlined"
          placeholder={placeholder}
          fullWidth
        />
        <BlueButton text={buttonText} icon="add" buttonColor="blue" onClick={addHandler} />
        {/* Map over the list and render entries */}
        {list.map((entry, index) => (
          <div key={index}> {/* Replace with NameCard or other entry component */}
            {entry.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={classes.accountManager}>
      {renderSection("Admin", "Search admin accounts", "+ Admin", admins, addAdmin)}
      {renderSection("Teachers", "Search teacher accounts", "+ Teacher", teachers, addTeacher)}
      {renderSection("Students", "Search student accounts", "+ Student", students, addStudent)}
    </div>
  );
};

export default AccountManager;
