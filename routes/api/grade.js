const router = require("express").Router();
const gradeController = require("../../controllers/gradeController");

// Matches with "/api/grade"
router.route("/")
  // .post(objController.create)

// Matches with "/api/grade/:gid"
router.route("/:gid")
// .get(objController.find)
// .delete(objController.delete)
// .put(objController.update)

module.exports = router;