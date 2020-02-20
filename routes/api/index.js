const router = require("express").Router();
const generalRoutes = require("./general");
const subjectRoutes = require("./subject");
const gradeRoutes = require("./grade");
const accountRoutes = require("./account");
const verifyRoutes = require("./verify");


// Object routes
router.use("/general", generalRoutes);
router.use("/subject", subjectRoutes);
router.use("/grade", gradeRoutes);
router.use("/account", accountRoutes);
router.use("/verify", verifyRoutes);


module.exports = router;