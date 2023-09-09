const router = require("express").Router();
const generalRoutes = require("./general");
const subjectRoutes = require("./subject");
const gradeRoutes = require("./grade");
const accountRoutes = require("./account");
const fileRoutes = require("./file");
const verifyRoutes = require("./verify");
const assessmentRoutes = require("./assessment");
const markRoutes = require("./mark");

// Object routes
router.use("/general", generalRoutes);
router.use("/subject", subjectRoutes);
router.use("/grade", gradeRoutes);
router.use("/account", accountRoutes);
router.use("/file", fileRoutes);
router.use("/verify", verifyRoutes);
router.use("/assessment", assessmentRoutes);
router.use("/mark", markRoutes);

module.exports = router;