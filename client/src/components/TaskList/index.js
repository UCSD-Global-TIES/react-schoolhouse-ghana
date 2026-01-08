import React, { useEffect, useState } from 'react';
import API from "../../utils/API";

const TaskList = ({ subjectId, userKey }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.getTasks(subjectId, userKey)
      .then(response => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [subjectId, userKey]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    
    return <div>Error: {error.message} | {subjectId} | {userKey}</div>;
  }

  return (
    <div>
      <h2>Tasks for Subject {subjectId}</h2>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;