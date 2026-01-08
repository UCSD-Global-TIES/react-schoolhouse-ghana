const express = require("express");
const router = express.Router();
const gradebookController = require("../../controllers/gradebookController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/save", gradebookController.saveGradebook);
router.get("/export/:subjectId", gradebookController.exportToCSV);
router.post("/import", upload.single("file"), gradebookController.importFromCSV);

module.exports = router;
