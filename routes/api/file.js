const express = require("express");
const router = express.Router();
const fileController = require("../../controllers/fileController");
const multer = require("multer");
const path = require("path");

// Configure Multer storage (can adapt to S3/MinIO later)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Matches with "/api/file"
router
  .route("/")
  // Get all 'File' documents
  .get(fileController.getFiles)
  // Upload and create a 'File'
  .post(upload.single("file"), fileController.createFile);

// Matches with "/api/file/:fid"
router
  .route("/:fid")
  // Get a 'File'
  .get(fileController.getFile)
  // Deletes a 'File'
  .delete(fileController.deleteFile)
  // Updates a 'File'
  .put(fileController.updateFile);

module.exports = router;