const router = require("express").Router();
const todoController = require("../../controllers/todoController");

// Matches with "/api/todo"
router.route("/")
    // Retrieves all todos
    .get(todoController.getTodos)
    // Adds a new todo
    .post(todoController.addTodo);

// Matches with "/api/todo/:id"
router.route("/:id")
    // Retrieves a specific todo
    .get(todoController.getTodo)
    // Updates a specific todo
    .put(todoController.updateTodo)
    // Deletes a specific todo
    .delete(todoController.deleteTodo);

modu.le.exports = router;
