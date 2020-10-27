const router = require("express").Router();
const assessmentController = require("../../controllers/assessmentController");

// Matches with "/api/assessment"
router.route("/")
  // Creates a new assessment account
  .get(assessmentController.getAssessments) // READ
  .put(assessmentController.submitStudentResponse) // CREATE
  .post(assessmentController.createForm) // UPDATE

router.route("/:formId")
  .get(assessmentController.getAssessment)
  .delete(assessmentController.deleteForm); // DELETE


// Matches with "/api/assessment/sync"
router.route("/sync/:formId")
  .post(assessmentController.sendFileToDrive);

module.exports = router;