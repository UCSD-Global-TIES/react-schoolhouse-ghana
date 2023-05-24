// Example todos (can be replaced with a database or any other data source)
let todos = [
    { id: 1, task: "Task 1", completed: false },
    { id: 2, task: "Task 2", completed: true },
    { id: 3, task: "Task 3", completed: false }
];

// Get all todos
const getTodos = (req, res) => {
    res.json(todos);
};

// Get a specific todo
const getTodo = (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find((todo) => todo.id === id);

    if (todo) {
        res.json(todo);
    } else {
        res.status(404).json({ message: "Todo not found" });
    }
};

// Add a new todo
const addTodo = (req, res) => {
    const { task } = req.body;

    const newTodo = {
        id: todos.length + 1,
        task,
        completed: false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
};

// Update a specific todo
const updateTodo = (req, res) => {
    const id = parseInt(req.params.id);
    const { task, completed } = req.body;

    const todo = todos.find((todo) => todo.id === id);

    if (todo) {
        todo.task = task || todo.task;
        todo.completed = completed || todo.completed;

        res.json(todo);
    } else {
        res.status(404).json({ message: "Todo not found" });
    }
};

// Delete a specific todo
const deleteTodo = (req, res) => {
    const id = parseInt(req.params.id);

    const index = todos.findIndex((todo) => todo.id === id);

    if (index !== -1) {
        todos.splice(index, 1);
        res.json({ message: "Todo deleted successfully" });
    } else {
        res.status(404).json({ message: "Todo not found" });
    }
};

module.exports = {
    getTodos,
    getTodo,
    addTodo,
    updateTodo,
    deleteTodo
};
