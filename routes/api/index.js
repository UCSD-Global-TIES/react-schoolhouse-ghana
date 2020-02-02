const router = require("express").Router();
const generalRoutes = require("./general");
const classRoutes = require("./class");
const gradeRoutes = require("./grade");
const sessionRoutes = require("./session");
const accountRoutes = require("./account");
const verifyRoutes = require("./verify");


// Object routes
router.use("/general", generalRoutes);
router.use("/class", classRoutes);
router.use("/grade", gradeRoutes);
router.use("/session", sessionRoutes);
router.use("/account", accountRoutes);
router.use("/verify", verifyRoutes);


module.exports = router;