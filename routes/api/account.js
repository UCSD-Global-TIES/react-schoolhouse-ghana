const router = require("express").Router();
const accountController = require("../../controllers/accountController");

// Matches with "/api/account"
router.route("/")
  .post(accountController.addAccount)

// Matches with "/api/account/:aid"
router.route("/:aid")
  .delete(accountController.deleteAccount)
  .put(accountController.updateAccount)

module.exports = router;