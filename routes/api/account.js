const router = require("express").Router();
const accountController = require("../../controllers/accountController");

// Matches with "/api/account"
router.route("/")
  // .post(objController.create)

// Matches with "/api/account/:aid"
router.route("/:aid")
// .delete(objController.delete)
// .put(objController.update)

module.exports = router;