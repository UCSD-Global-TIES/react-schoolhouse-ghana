const router = require("express").Router();
const fileController = require("../../controllers/fileController");

// Matches with "/api/file"
router.route("/")
    // Get all 'File' documents
    .get(fileController.getFiles)
    // Create a 'File'
    .post(fileController.createFile)

// Matches with "/api/file/:fid"
router.route("/:fid")
    // Get a 'File'
    .get(fileController.getFile)
    // Deletes a 'File'
    .delete(fileController.deleteFile)
    // Updates a 'File'
    .put(fileController.updateFile)

module.exports = router;