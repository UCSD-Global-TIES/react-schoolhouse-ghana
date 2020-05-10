const router = require("express").Router();
const assessmentController = require("../../controllers/assessmentController");

// Matches with "/api/assessment"
router.route("/")
  // Creates a new assessment account
  .get(assessmentController.getAssessment);

module.exports = router;