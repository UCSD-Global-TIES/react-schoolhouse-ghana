const router = require("express").Router();
const generalRoutes = require("./general");
const classRoutes = require("./class");
const gradeRoutes = require("./grade");
const verifyRoutes = require("./verify");
const accountRoutes = require("./account");

// Object routes
router.use("/general", generalRoutes);
router.use("/class", classRoutes);
router.use("/grade", gradeRoutes);
router.use("/verify", verifyRoutes);
router.use("/account", accountRoutes);

module.exports = router;