// routes/subjects.js
const router = require("express").Router();
const subjectController = require("../../controllers/subjectController");
const gradebookController = require("../../controllers/gradebookController");
const taskController    = require("../../controllers/taskController");

// Matches with "/api/subjects"
router
  .route("/")
  .get(subjectController.getSubjects)    // GET  /api/subjects
  .post(subjectController.addSubject);   // POST /api/subjects

// Matches with "/api/subjects/:subjectId"
router
  .route("/:subjectId")
  .get(subjectController.getSubject)     // GET    /api/subjects/:subjectId
  .put(subjectController.updateSubject)  // PUT    /api/subjects/:subjectId
  .delete(subjectController.deleteSubject); // DELETE /api/subjects/:subjectId

// Announcements for a subject
// Matches with "/api/subjects/:subjectId/ann"
router
  .route("/:subjectId/ann")
  .get(subjectController.getAnnouncements)    // GET  /api/subjects/:subjectId/ann
  .post(subjectController.addAnnouncement);   // POST /api/subjects/:subjectId/ann

// Specific announcement
// Matches with "/api/subjects/:subjectId/ann/:announceId"
router
  .route("/:subjectId/ann/:announceId")
  .delete(subjectController.deleteAnnouncement); // DELETE /api/subjects/:subjectId/ann/:announceId

// File attachments on a subject
// Matches with "/api/subjects/:subjectId/file/:fileId"
router
  .route("/:subjectId/file/:fileId")
  .post(subjectController.addFile)     // POST   /api/subjects/:subjectId/file/:fileId
  .delete(subjectController.removeFile); // DELETE /api/subjects/:subjectId/file/:fileId

// Tasks for a subject
// Matches with "/api/subjects/:subjectId/tasks"
router
  .route("/:subjectId/tasks")
  .get(subjectController.getTasksForSubject); // GET /api/subjects/:subjectId/tasks

router
  .route("/:subjectId/gradebook")
  .get(gradebookController.getGradesBySubject)
  .post(gradebookController.saveGradebook);

module.exports = router;
