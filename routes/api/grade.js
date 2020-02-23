const router = require("express").Router();
const gradeController = require("../../controllers/gradeController");

// Matches with "/api/grade"
router.route("/")
  // Retrieves all grades (don't populate)
  .get(gradeController.getGrades)
  // Adds a new grade
  .post(gradeController.addGrade)

// Matches with "/api/grade/:gid"
router.route("/:gid")
  // Retrieves a specific grade
  .get(gradeController.getGrade)
  // Deletes a specific grade
  .delete(gradeController.deleteGrade)
// Updates a specific grade
.put(gradeController.updateGrade)

router.route("/:uid/user")
  // Retrieves a specific grade
  .get(gradeController.getUserGrade)

// // Matches with "/api/grade/:gid/student/:sid"
// router.route("/:gid/student/:sid")
//   // Add a student to the grade
//   .post(gradeController.addStudent)
//   // Remove a student from the grade
//   .delete(gradeController.removeStudent)

// // Matches with "/api/grade/:gid/teacher/:sid"
// router.route("/:gid/teacher/:tid")
//   // Add a teacher to the grade
//   .post(gradeController.addTeacher)
//   // Remove a teacher from the grade
//   .delete(gradeController.removeTeacher)

// // Matches with "/api/grade/:gid/subject/:sid" 
// router.route("/:gid/subject/:sid")
//   // Add a subject to the grade
//   .post(gradeController.addSubject)
//   // Remove a subject from the grade
//   .delete(gradeController.removeSubject)

module.exports = router;