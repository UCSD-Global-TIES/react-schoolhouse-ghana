const router = require("express").Router();
const subjectController = require("../../controllers/subjectController");

// Matches with "/api/subject"
router.route("/")
  // Gets all subjects
  .get(subjectController.getSubjects)
  // Adds a subject  
  .post(subjectController.addSubject)

// Matches with "/api/subject/:sid"
router.route("/:sid")
  // Get a specific subject (populate all)
  .get(subjectController.getSubject)
  // Delete a specific subject
  .delete(subjectController.deleteSubject)
  // Update a specific subject
  .put(subjectController.updateSubject)

// Matches with "/api/subject/:sid/ann"
router.route("/:sid/ann")
  .get(subjectController.getAnnouncements)
  // Create a Subject announcement
  .post(subjectController.addAnnouncement)

// Matches with "/api/subject/:sid/ann/:aid"
router.route("/:sid/ann/:aid")
  // Delete a specific Subject announcement
  .delete(subjectController.deleteAnnouncement)

// Matches with "/api/subject/:sid/file"
router.route("/:sid/file/:fid")
  // Add a file reference to the subject's 'files' array
  .post(subjectController.addFile)

// Matches with "/api/subject/:sid/file/:fid"
router.route("/:sid/file/:fid")
  // Remove a file reference from the subject's 'files' array
  .delete(subjectController.removeFile)

module.exports = router;

