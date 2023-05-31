import React from 'react';

function ToDoItem({ task, onDelete }) {
    return (
        <li>
            {task}
            <button onClick={onDelete}>Delete</button>
        </li>
    );
}

export default ToDoItem;
