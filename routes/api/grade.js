const router = require("express").Router();
const gradeController = require("../../controllers/gradeController");

// Matches with "/api/grade"
router.route("/")
  .get(gradeController.getGrades)
  .post(gradeController.addGrade)

// Matches with "/api/grade/:gid"
router.route("/:gid")
  .get(gradeController.getGrade)
  .delete(gradeController.deleteGrade)
// .put(gradeController.updateGrade)

module.exports = router;