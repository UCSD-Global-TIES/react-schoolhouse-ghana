const router = require("express").Router();
const generalController = require("../../controllers/generalController");

// Matches with "/api/general/ann"
router.route("/ann")
  // .post(objController.create)

// Matches with "/api/general/ann/:aid"
router.route("/ann/:aid")
// .delete(objController.delete)
// .put(objController.update)

module.exports = router;