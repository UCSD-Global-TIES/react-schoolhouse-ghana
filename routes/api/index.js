const router = require("express").Router();
const objRoutes = require("./obj");

// Object routes
router.use("/obj", objRoutes);

module.exports = router;